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
  audioUrl: varchar("audio_url"),
  language: varchar("language", { length: 5 }).notNull().default('en'),
  createdAt: timestamp("created_at").defaultNow(),
  generationAttempt: integer("generation_attempt").notNull().default(1),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
});

export type InsertStory = z.infer<typeof insertStorySchema>;
export type Story = typeof stories.$inferSelect;

// Payment tracking for idempotency
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey(), // payment_intent_id from Stripe
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  creditsAdded: integer("credits_added").notNull(),
  processed: timestamp("processed").defaultNow(),
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
    elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel (multilingual)
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
  "Farm Friends"
];

export const CREDIT_PACKAGES = [
  { credits: 5, price: 4.99, popular: false },
  { credits: 15, price: 12.99, popular: true },
  { credits: 30, price: 19.99, popular: false },
];
