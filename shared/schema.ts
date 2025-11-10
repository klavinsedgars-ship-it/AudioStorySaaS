import { sql } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  credits: integer("credits").notNull().default(3), // Free trial: 3 credits
  totalStories: integer("total_stories").notNull().default(0),
  isAdmin: varchar("is_admin", { length: 5 }).notNull().default('false'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Stories table
export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  heroName: varchar("hero_name").notNull(),
  additionalNames: text("additional_names").array().notNull().default(sql`ARRAY[]::text[]`),
  generationType: varchar("generation_type", { length: 10 }).notNull(), // 'theme' or 'custom'
  theme: varchar("theme"),
  customPromptText: text("custom_prompt_text"),
  storyText: text("story_text").notNull(),
  audioPath: varchar("audio_path"),
  language: varchar("language", { length: 5 }).notNull().default('en'),
  imageUrl: text("image_url"), // Path to generated illustration
  status: varchar("status", { length: 20 }).notNull().default('pending'), // 'pending', 'gen_audio', 'gen_image', 'complete', 'failed_audio', 'failed_image'
  isFavorite: varchar("is_favorite", { length: 5 }).notNull().default('false'),
  createdAt: timestamp("created_at").defaultNow(),
  generationAttempt: integer("generation_attempt").notNull().default(1),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

// Shared Stories table
export const sharedStories = pgTable("shared_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id").notNull().references(() => stories.id, { onDelete: 'cascade' }),
  shareToken: varchar("share_token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSharedStorySchema = createInsertSchema(sharedStories).omit({
  id: true,
  createdAt: true,
});

export type InsertSharedStory = z.infer<typeof insertSharedStorySchema>;
export type SharedStory = typeof sharedStories.$inferSelect;

// Payment tracking for idempotency
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey(), // payment_intent_id from Stripe
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  creditsAdded: integer("credits_added").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;

// Language configuration
export interface LanguageOption {
  name: string;
  code: string;
  country: string;
  elevenLabsVoiceId: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    name: "English",
    code: "en",
    country: "US",
    elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel
  },
  {
    name: "Latviešu",
    code: "lv",
    country: "LV",
    elevenLabsVoiceId: "TX3LPaxmHKxFdv7VOQHJ" // Liam
  },
  {
    name: "Español",
    code: "es",
    country: "ES",
    elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL" // Bella (multilingual)
  },
  {
    name: "Français",
    code: "fr",
    country: "FR",
    elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL" // Bella (multilingual)
  }
];

export const STORY_THEMES = [
  "Space Adventure",
  "Under the Sea",
  "Dinosaurs",
  "Magical Forest",
  "Farm Friends",
  "Pirate Treasure Hunt",
  "Princess Castle",
  "Jungle Safari",
  "Arctic Animals",
  "Superhero Mission",
  "Dragon Quest",
  "Fairy Garden",
  "Robot Workshop",
  "Ocean Treasure",
  "Time Travel Adventure"
];

export const CREDIT_PACKAGES = [
  { credits: 5, price: 4.99, popular: false },
  { credits: 15, price: 12.99, popular: true },
  { credits: 30, price: 19.99, popular: false },
];
