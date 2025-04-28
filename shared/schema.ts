import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  planType: text("plan_type").notNull().default("free"),
  rendersRemaining: integer("renders_remaining").notNull().default(3),
  createdAt: timestamp("created_at").defaultNow(),
});

// Design style options
export const ROOM_TYPES = ["living-room", "bedroom", "kitchen", "bathroom", "office", "dining-room"] as const;
export type RoomType = typeof ROOM_TYPES[number];

export const DESIGN_STYLES = ["modern", "minimalist", "scandinavian", "boho"] as const;
export const PREMIUM_DESIGN_STYLES = ["industrial", "mid-century", "traditional", "coastal"] as const;
export type DesignStyle = typeof DESIGN_STYLES[number] | typeof PREMIUM_DESIGN_STYLES[number];

// Renders model to track render history
export const renders = pgTable("renders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  originalImageUrl: text("original_image_url").notNull(),
  renderedImageUrl: text("rendered_image_url"),
  roomType: text("room_type").notNull(),
  designStyle: text("design_style").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  isPremiumQuality: boolean("is_premium_quality").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription plans
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planType: text("plan_type").notNull(), // free, premium
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  paymentId: text("payment_id"),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  planType: true,
  rendersRemaining: true,
});

export const insertRenderSchema = createInsertSchema(renders).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  startDate: true,
});

// Extended types
export const roomTypeSchema = z.enum(ROOM_TYPES);
export const designStyleSchema = z.enum([...DESIGN_STYLES, ...PREMIUM_DESIGN_STYLES]);

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRender = z.infer<typeof insertRenderSchema>;
export type Render = typeof renders.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
