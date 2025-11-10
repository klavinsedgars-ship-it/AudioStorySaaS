import { db } from "./db";
import type { UpsertUser, User, InsertStory, Story } from "@shared/schema";
import { users, stories, payments } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  upsertUser(user: UpsertUser): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserCredits(userId: string, newCredits: number): Promise<void>;
  createStory(story: InsertStory): Promise<Story>;
  updateStoryAudio(storyId: string, audioUrl: string): Promise<void>;
  getUserStories(userId: string): Promise<Story[]>;
  checkPaymentProcessed(paymentId: string): Promise<boolean>;
  recordPayment(paymentId: string, userId: string, creditsAdded: number): Promise<void>;
}

export class DbStorage implements IStorage {
  async upsertUser(user: UpsertUser): Promise<User> {
    const existingUser = user.email ? await this.getUserByEmail(user.email) : null;

    if (existingUser) {
      return existingUser;
    }

    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserCredits(userId: string, newCredits: number): Promise<void> {
    await db.update(users).set({ credits: newCredits }).where(eq(users.id, userId));
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await db.insert(stories).values(story).returning();
    
    const user = await this.getUserById(story.userId);
    if (user) {
      await db.update(users)
        .set({ totalStories: user.totalStories + 1 })
        .where(eq(users.id, story.userId));
    }
    
    return newStory;
  }

  async updateStoryAudio(storyId: string, audioUrl: string): Promise<void> {
    await db.update(stories).set({ audioUrl }).where(eq(stories.id, storyId));
  }

  async getUserStories(userId: string): Promise<Story[]> {
    return db.select().from(stories).where(eq(stories.userId, userId)).orderBy(desc(stories.createdAt));
  }

  async checkPaymentProcessed(paymentId: string): Promise<boolean> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId));
    return !!payment;
  }

  async recordPayment(paymentId: string, userId: string, creditsAdded: number): Promise<void> {
    await db.insert(payments).values({
      id: paymentId,
      userId,
      creditsAdded,
    });
  }
}

export const storage = new DbStorage();
