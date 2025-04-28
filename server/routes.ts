import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertRenderSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import axios from "axios";

// Setup uploads directory
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG image files are allowed'));
    }
  }
});

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Helper to get a baseURL for this server
const getBaseUrl = (req: Request) => {
  const host = req.get('host');
  const protocol = req.protocol;
  return `${protocol}://${host}`;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', express.static(uploadsDir));

  // API routes
  // User profile
  app.get('/api/profile', isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Get user's render history
  app.get('/api/renders', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const renders = await storage.getUserRenders(userId);
      res.json(renders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch renders" });
    }
  });

  // Get single render
  app.get('/api/renders/:id', isAuthenticated, async (req, res) => {
    try {
      const renderId = parseInt(req.params.id);
      const render = await storage.getRender(renderId);
      
      if (!render) {
        return res.status(404).json({ message: "Render not found" });
      }
      
      if (render.userId !== req.user?.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(render);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch render" });
    }
  });

  // Upload image for rendering
  app.post('/api/renders/upload', isAuthenticated, upload.single('image'), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const baseUrl = getBaseUrl(req);
      const imageUrl = `${baseUrl}/uploads/${file.filename}`;
      
      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to upload image" });
    }
  });

  // Create a new render
  app.post('/api/renders', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has renders remaining
      if (user.planType === 'free' && user.rendersRemaining <= 0) {
        return res.status(403).json({ 
          message: "You've used all your free renders. Upgrade to premium for unlimited renders."
        });
      }
      
      // Validate input
      const parseResult = insertRenderSchema.safeParse({
        ...req.body,
        userId
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid input", errors: parseResult.error.format() });
      }
      
      // Determine if premium quality based on plan
      const isPremiumQuality = user.planType === 'premium';
      
      // Create render record
      const renderData = {
        ...parseResult.data,
        isPremiumQuality,
        status: 'pending'
      };
      
      const render = await storage.createRender(renderData);
      
      // Simulate render with a placeholder in this MVP
      // In production, we would call the Replicate API here
      
      // Decrement renders remaining for free users
      if (user.planType === 'free') {
        await storage.updateUser(userId, { 
          rendersRemaining: user.rendersRemaining - 1 
        });
      }
      
      // Success
      res.status(201).json(render);
      
      // Simulate async processing
      setTimeout(async () => {
        // Update render status to processing
        await storage.updateRender(render.id, { status: 'processing' });
        
        // Simulate AI processing delay
        setTimeout(async () => {
          // In a real implementation, this would be where we'd get the result from Replicate API
          const mockRenderedUrl = render.originalImageUrl.replace('/uploads/', '/uploads/rendered_');
          await storage.updateRender(render.id, { 
            status: 'completed',
            renderedImageUrl: mockRenderedUrl
          });
        }, 3000);
      }, 1000);
      
    } catch (error: any) {
      console.error("Render creation error:", error);
      res.status(500).json({ message: error.message || "Failed to create render" });
    }
  });

  // Update user's subscription plan
  app.post('/api/subscription', isAuthenticated, async (req, res) => {
    try {
      const { planType } = req.body;
      if (!planType || !['free', 'premium'].includes(planType)) {
        return res.status(400).json({ message: "Invalid plan type" });
      }
      
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Update user's plan
      const updatedUser = await storage.updateUser(userId, { planType });
      
      // For premium, create a subscription record
      if (planType === 'premium') {
        // Get any existing active subscription
        const existingSubscription = await storage.getUserActiveSubscription(userId);
        
        if (existingSubscription) {
          // Update existing subscription
          await storage.updateSubscription(existingSubscription.id, {
            isActive: true
          });
        } else {
          // Create new subscription
          const endDate = new Date();
          endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription
          
          await storage.createSubscription({
            userId,
            planType,
            endDate,
            isActive: true,
            paymentId: `mock_payment_${Date.now()}`
          });
        }
      }
      
      res.json({ success: true, user: updatedUser });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to update subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Need to import express here to avoid circular dependencies
import express from "express";
