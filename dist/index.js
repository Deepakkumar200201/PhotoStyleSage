// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var MemStorage = class {
  users;
  renders;
  subscriptions;
  sessionStore;
  userIdCounter;
  renderIdCounter;
  subscriptionIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.renders = /* @__PURE__ */ new Map();
    this.subscriptions = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.renderIdCounter = 1;
    this.subscriptionIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // Clear expired sessions every 24h
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const user = {
      ...insertUser,
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  async updateUser(id, data) {
    const user = await this.getUser(id);
    if (!user) return void 0;
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Render methods
  async createRender(insertRender) {
    const id = this.renderIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const render = {
      ...insertRender,
      id,
      createdAt: now
    };
    this.renders.set(id, render);
    return render;
  }
  async getRender(id) {
    return this.renders.get(id);
  }
  async getUserRenders(userId) {
    return Array.from(this.renders.values()).filter((render) => render.userId === userId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async updateRender(id, data) {
    const render = await this.getRender(id);
    if (!render) return void 0;
    const updatedRender = { ...render, ...data };
    this.renders.set(id, updatedRender);
    return updatedRender;
  }
  // Subscription methods
  async createSubscription(insertSubscription) {
    const id = this.subscriptionIdCounter++;
    const now = /* @__PURE__ */ new Date();
    const subscription = {
      ...insertSubscription,
      id,
      startDate: now
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }
  async getUserActiveSubscription(userId) {
    return Array.from(this.subscriptions.values()).find((sub) => sub.userId === userId && sub.isActive);
  }
  async updateSubscription(id, data) {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return void 0;
    const updatedSubscription = { ...subscription, ...data };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
};
var storage = new MemStorage();

// server/routes.ts
import multer from "multer";
import path from "path";
import fs from "fs";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  planType: text("plan_type").notNull().default("free"),
  rendersRemaining: integer("renders_remaining").notNull().default(3),
  createdAt: timestamp("created_at").defaultNow()
});
var ROOM_TYPES = ["living-room", "bedroom", "kitchen", "bathroom", "office", "dining-room"];
var DESIGN_STYLES = ["modern", "minimalist", "scandinavian", "boho"];
var PREMIUM_DESIGN_STYLES = ["industrial", "mid-century", "traditional", "coastal"];
var renders = pgTable("renders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  originalImageUrl: text("original_image_url").notNull(),
  renderedImageUrl: text("rendered_image_url"),
  roomType: text("room_type").notNull(),
  designStyle: text("design_style").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  // pending, processing, completed, failed
  isPremiumQuality: boolean("is_premium_quality").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planType: text("plan_type").notNull(),
  // free, premium
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  paymentId: text("payment_id")
});
var insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  planType: true,
  rendersRemaining: true
});
var insertRenderSchema = createInsertSchema(renders).omit({
  id: true,
  createdAt: true
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  startDate: true
});
var roomTypeSchema = z.enum(ROOM_TYPES);
var designStyleSchema = z.enum([...DESIGN_STYLES, ...PREMIUM_DESIGN_STYLES]);

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { z as z2 } from "zod";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
var loginSchema = z2.object({
  email: z2.string().email("Please enter a valid email address"),
  password: z2.string().min(6, "Password must be at least 6 characters")
});
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "roomrevive-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1e3
      // 30 days
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !await comparePasswords(password, user.password)) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.format()
        });
      }
      const { email, password } = validationResult.data;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      const user = await storage.createUser({
        email,
        password: await hashPassword(password),
        planType: "free",
        rendersRemaining: 3
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password: password2, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// server/routes.ts
import express from "express";
var uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
var upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG and PNG image files are allowed"));
    }
  }
});
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
var getBaseUrl = (req) => {
  const host = req.get("host");
  const protocol = req.protocol;
  return `${protocol}://${host}`;
};
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.use("/uploads", express.static(uploadsDir));
  app2.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app2.get("/api/renders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const renders2 = await storage.getUserRenders(userId);
      res.json(renders2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch renders" });
    }
  });
  app2.get("/api/renders/:id", isAuthenticated, async (req, res) => {
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
  app2.post("/api/renders/upload", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const baseUrl = getBaseUrl(req);
      const imageUrl = `${baseUrl}/uploads/${file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to upload image" });
    }
  });
  app2.post("/api/renders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.planType === "free" && user.rendersRemaining <= 0) {
        return res.status(403).json({
          message: "You've used all your free renders. Upgrade to premium for unlimited renders."
        });
      }
      const parseResult = insertRenderSchema.safeParse({
        ...req.body,
        userId
      });
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid input", errors: parseResult.error.format() });
      }
      const isPremiumQuality = user.planType === "premium";
      const renderData = {
        ...parseResult.data,
        isPremiumQuality,
        status: "pending"
      };
      const render = await storage.createRender(renderData);
      if (user.planType === "free") {
        await storage.updateUser(userId, {
          rendersRemaining: user.rendersRemaining - 1
        });
      }
      res.status(201).json(render);
      setTimeout(async () => {
        await storage.updateRender(render.id, { status: "processing" });
        setTimeout(async () => {
          const mockRenderedUrl = render.originalImageUrl.replace("/uploads/", "/uploads/rendered_");
          await storage.updateRender(render.id, {
            status: "completed",
            renderedImageUrl: mockRenderedUrl
          });
        }, 3e3);
      }, 1e3);
    } catch (error) {
      console.error("Render creation error:", error);
      res.status(500).json({ message: error.message || "Failed to create render" });
    }
  });
  app2.post("/api/subscription", isAuthenticated, async (req, res) => {
    try {
      const { planType } = req.body;
      if (!planType || !["free", "premium"].includes(planType)) {
        return res.status(400).json({ message: "Invalid plan type" });
      }
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const updatedUser = await storage.updateUser(userId, { planType });
      if (planType === "premium") {
        const existingSubscription = await storage.getUserActiveSubscription(userId);
        if (existingSubscription) {
          await storage.updateSubscription(existingSubscription.id, {
            isActive: true
          });
        } else {
          const endDate = /* @__PURE__ */ new Date();
          endDate.setFullYear(endDate.getFullYear() + 1);
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
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to update subscription" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
