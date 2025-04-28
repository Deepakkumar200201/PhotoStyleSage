import { users, type User, type InsertUser, renders, type Render, type InsertRender, subscriptions, type Subscription, type InsertSubscription } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;
  
  // Render operations
  createRender(render: InsertRender): Promise<Render>;
  getRender(id: number): Promise<Render | undefined>;
  getUserRenders(userId: number): Promise<Render[]>;
  updateRender(id: number, data: Partial<Render>): Promise<Render | undefined>;
  
  // Subscription operations
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getUserActiveSubscription(userId: number): Promise<Subscription | undefined>;
  updateSubscription(id: number, data: Partial<Subscription>): Promise<Subscription | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private renders: Map<number, Render>;
  private subscriptions: Map<number, Subscription>;
  sessionStore: session.SessionStore;
  private userIdCounter: number;
  private renderIdCounter: number;
  private subscriptionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.renders = new Map();
    this.subscriptions = new Map();
    this.userIdCounter = 1;
    this.renderIdCounter = 1;
    this.subscriptionIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Render methods
  async createRender(insertRender: InsertRender): Promise<Render> {
    const id = this.renderIdCounter++;
    const now = new Date();
    const render: Render = {
      ...insertRender,
      id,
      createdAt: now
    };
    this.renders.set(id, render);
    return render;
  }

  async getRender(id: number): Promise<Render | undefined> {
    return this.renders.get(id);
  }

  async getUserRenders(userId: number): Promise<Render[]> {
    return Array.from(this.renders.values())
      .filter(render => render.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateRender(id: number, data: Partial<Render>): Promise<Render | undefined> {
    const render = await this.getRender(id);
    if (!render) return undefined;
    
    const updatedRender = { ...render, ...data };
    this.renders.set(id, updatedRender);
    return updatedRender;
  }

  // Subscription methods
  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionIdCounter++;
    const now = new Date();
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      startDate: now
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async getUserActiveSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values())
      .find(sub => sub.userId === userId && sub.isActive);
  }

  async updateSubscription(id: number, data: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...data };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
}

export const storage = new MemStorage();
