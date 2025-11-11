import { db } from "./db";
import type { UpsertUser, User, InsertStory, Story, InsertSharedStory, SharedStory } from "@shared/schema";
import { users, stories, payments, sharedStories } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  upsertUser(user: UpsertUser): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserCredits(userId: string, newCredits: number): Promise<void>;
  createStory(story: InsertStory): Promise<Story>;
  updateStoryAudio(storyId: string, audioPath: string): Promise<void>;
  addStoryImageUrl(storyId: string, imageUrl: string): Promise<void>;
  updateStoryStatus(storyId: string, status: string): Promise<void>;
  getStory(storyId: string): Promise<Story | undefined>;
  getUserStories(userId: string): Promise<Story[]>;
  toggleFavorite(storyId: string, userId: string): Promise<void>;
  shareStory(storyId: string, userId: string): Promise<string>;
  unshareStory(storyId: string, userId: string): Promise<void>;
  getSharedStory(shareToken: string): Promise<(Story & { sharedAt: Date }) | null>;
  getUserPaymentHistory(userId: string): Promise<any[]>;
  getAllUsers(): Promise<User[]>;
  getAllPayments(): Promise<any[]>;
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

  async updateStoryAudio(storyId: string, audioPath: string): Promise<void> {
    await db.update(stories).set({ audioPath }).where(eq(stories.id, storyId));
  }

  async addStoryImageUrl(storyId: string, imageUrl: string): Promise<void> {
    await db.execute(sql`
      UPDATE ${stories} 
      SET ${stories.imageUrls} = array_append(${stories.imageUrls}, ${imageUrl})
      WHERE ${stories.id} = ${storyId}
    `);
  }

  async updateStoryStatus(storyId: string, status: string): Promise<void> {
    await db.update(stories).set({ status }).where(eq(stories.id, storyId));
  }

  async getStory(storyId: string): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, storyId));
    return story;
  }

  async getUserStories(userId: string): Promise<Story[]> {
    return db.select().from(stories).where(eq(stories.userId, userId)).orderBy(desc(stories.createdAt));
  }

  async toggleFavorite(storyId: string, userId: string): Promise<void> {
    const [story] = await db.select().from(stories).where(eq(stories.id, storyId));
    if (!story || story.userId !== userId) {
      throw new Error("Story not found or unauthorized");
    }
    const newFavoriteStatus = story.isFavorite === 'true' ? 'false' : 'true';
    await db.update(stories).set({ isFavorite: newFavoriteStatus }).where(eq(stories.id, storyId));
  }

  async shareStory(storyId: string, userId: string): Promise<string> {
    const [story] = await db.select().from(stories).where(eq(stories.id, storyId));
    if (!story || story.userId !== userId) {
      throw new Error("Story not found or unauthorized");
    }
    
    // Check if already shared
    const [existing] = await db.select().from(sharedStories).where(eq(sharedStories.storyId, storyId));
    if (existing) {
      return existing.shareToken;
    }
    
    // Create new share
    const shareToken = nanoid(12);
    await db.insert(sharedStories).values({ storyId, shareToken });
    return shareToken;
  }

  async unshareStory(storyId: string, userId: string): Promise<void> {
    const [story] = await db.select().from(stories).where(eq(stories.id, storyId));
    if (!story || story.userId !== userId) {
      throw new Error("Story not found or unauthorized");
    }
    await db.delete(sharedStories).where(eq(sharedStories.storyId, storyId));
  }

  async getSharedStory(shareToken: string): Promise<(Story & { sharedAt: Date }) | null> {
    const [shared] = await db.select().from(sharedStories).where(eq(sharedStories.shareToken, shareToken));
    if (!shared) {
      return null;
    }
    
    const [story] = await db.select().from(stories).where(eq(stories.id, shared.storyId));
    if (!story) {
      return null;
    }
    
    return {
      ...story,
      sharedAt: shared.createdAt!,
    };
  }

  async getUserPaymentHistory(userId: string): Promise<any[]> {
    return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllPayments(): Promise<any[]> {
    return db.select().from(payments).orderBy(desc(payments.createdAt));
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
