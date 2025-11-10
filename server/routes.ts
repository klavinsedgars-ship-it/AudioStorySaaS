import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { fromError } from "zod-validation-error";
import { LANGUAGE_OPTIONS, CREDIT_PACKAGES } from "@shared/schema";
import Stripe from "stripe";
import { Client } from "@replit/object-storage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

// Singleton Object Storage client
const objectStorageClient = new Client({ bucketId: process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID });

// Rate limiting - simple in-memory implementation
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_GENERATIONS_PER_HOUR = 10;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }

  if (userLimit.count >= MAX_GENERATIONS_PER_HOUR) {
    return false;
  }

  userLimit.count++;
  return true;
}

async function generateStoryText(
  heroName: string,
  additionalNames: string[],
  language: string,
  theme: string | null,
  customPrompt: string | null
): Promise<string> {
  const langName = LANGUAGE_OPTIONS.find((l) => l.code === language)?.name || "English";

  let systemPrompt = `You are a creative bedtime story writer for children ages 3-8. Create engaging, calming stories in ${langName} that are appropriate for bedtime. Stories should be 200-300 words, use simple language, have a gentle pace, and end peacefully to help children fall asleep.`;

  let userPrompt = "";

  if (theme) {
    userPrompt = `Write a bedtime story about ${heroName}`;
    if (additionalNames.length > 0) {
      userPrompt += ` and their friends ${additionalNames.join(", ")}`;
    }
    userPrompt += ` on a ${theme} adventure. Make it calming and perfect for bedtime.`;
  } else if (customPrompt) {
    userPrompt = `Write a bedtime story about ${heroName}`;
    if (additionalNames.length > 0) {
      userPrompt += ` and their friends ${additionalNames.join(", ")}`;
    }
    userPrompt += `. Story idea: ${customPrompt}. Make it calming and perfect for bedtime.`;
  }

  userPrompt += `\n\nIMPORTANT: Write the entire story in ${langName}. Add variety - make each story unique and different from previous ones about this theme.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function generateAudioFromText(text: string, language: string): Promise<ArrayBuffer> {
  const voiceId =
    LANGUAGE_OPTIONS.find((l) => l.code === language)?.elevenLabsVoiceId ||
    "21m00Tcm4TlvDq8ikWAM";

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_v3",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error: ${error}`);
  }

  return response.arrayBuffer();
}

async function uploadAudioToStorage(audioBuffer: ArrayBuffer, filename: string): Promise<string> {
  const privateDir = process.env.PRIVATE_OBJECT_DIR || ".private";
  const fullPath = `${privateDir}/${filename}`;
  
  const buffer = Buffer.from(audioBuffer);
  await objectStorageClient.uploadFromBytes(fullPath, buffer);
  
  return fullPath;
}

async function streamAudioFile(audioPath: string, req: any, res: any, isPublic: boolean = false) {
  try {
    const { ok, value, error } = await objectStorageClient.downloadAsBytes(audioPath);
    
    if (!ok) {
      console.error("Failed to download audio from storage:", error);
      return res.status(404).send("Audio file not found");
    }
    
    const buffer = value[0];
    const fileSize = buffer.length;
    
    const range = req.headers.range;
    const cacheControl = isPublic ? "public, max-age=31536000" : "private, max-age=31536000";
    
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      let start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      // Validate range values
      if (isNaN(start) || isNaN(end)) {
        res.writeHead(416, {
          "Content-Range": `bytes */${fileSize}`,
        });
        return res.end();
      }
      
      // Clamp values to valid range
      start = Math.max(0, start);
      end = Math.min(end, fileSize - 1);
      
      // Check if range is satisfiable
      if (start >= fileSize || start > end) {
        res.writeHead(416, {
          "Content-Range": `bytes */${fileSize}`,
        });
        return res.end();
      }
      
      const chunkSize = end - start + 1;
      
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
        "Cache-Control": cacheControl,
      });
      
      res.end(buffer.slice(start, end + 1));
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes",
        "Cache-Control": cacheControl,
      });
      
      res.end(buffer);
    }
  } catch (error: any) {
    console.error("Audio streaming error:", error);
    res.status(404).send("Audio file not found");
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Get current user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const user = await storage.getUserById(userId);
    
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.json(user);
  });

  // Generate story text (free preview)
  app.post("/api/generate-story-text", isAuthenticated, async (req: any, res) => {

    const schema = z.object({
      heroName: z.string().min(1),
      additionalNames: z.array(z.string()).default([]),
      language: z.string().min(2).max(5),
      generationType: z.enum(["theme", "custom"]),
      theme: z.string().nullable(),
      customPrompt: z.string().nullable(),
    });

    try {
      const validated = schema.parse(req.body);
      const userId = req.user.claims.sub;

      // Rate limiting
      if (!checkRateLimit(userId)) {
        return res.status(429).send("Rate limit exceeded. Please try again later.");
      }

      const storyText = await generateStoryText(
        validated.heroName,
        validated.additionalNames,
        validated.language,
        validated.theme,
        validated.customPrompt
      );

      res.json({ storyText });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).send(fromError(error).toString());
      }
      console.error("Story generation error:", error);
      res.status(500).send(error.message || "Failed to generate story");
    }
  });

  // Generate audio and save story (costs 1 credit)
  app.post("/api/generate-story-audio", isAuthenticated, async (req: any, res) => {

    const schema = z.object({
      storyText: z.string().min(1),
      language: z.string().min(2).max(5),
      heroName: z.string().min(1),
      additionalNames: z.array(z.string()).default([]),
      theme: z.string().nullable(),
      customPromptText: z.string().nullable(),
    });

    try {
      const validated = schema.parse(req.body);
      const userId = req.user.claims.sub;

      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }

      if (user.credits < 1) {
        return res.status(400).send("Insufficient credits");
      }

      // Create story in database first (without audio)
      const story = await storage.createStory({
        userId: user.id,
        heroName: validated.heroName,
        additionalNames: validated.additionalNames.filter((n) => n.trim()),
        generationType: validated.theme ? "theme" : "custom",
        theme: validated.theme,
        customPromptText: validated.customPromptText,
        storyText: validated.storyText,
        language: validated.language,
        audioPath: null,
        generationAttempt: 1,
      });

      // Generate audio
      const audioBuffer = await generateAudioFromText(validated.storyText, validated.language);

      // Upload to object storage
      const filename = `story-${story.id}-${Date.now()}.mp3`;
      const audioPath = await uploadAudioToStorage(audioBuffer, filename);

      // Update story with audio path
      await storage.updateStoryAudio(story.id, audioPath);

      // Deduct credit
      await storage.updateUserCredits(user.id, user.credits - 1);

      res.json({ success: true, storyId: story.id });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).send(fromError(error).toString());
      }
      console.error("Audio generation error:", error);
      res.status(500).send(error.message || "Failed to generate audio");
    }
  });

  // Get user's stories
  app.get("/api/stories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stories = await storage.getUserStories(userId);
      res.json(stories);
    } catch (error: any) {
      console.error("Get stories error:", error);
      res.status(500).send("Failed to fetch stories");
    }
  });

  // Serve audio for user's story (authenticated, owner-only)
  app.get("/api/audio/:storyId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { storyId } = req.params;
      
      const story = await storage.getStory(storyId);
      
      if (!story) {
        return res.status(404).send("Story not found");
      }
      
      if (story.userId !== userId) {
        return res.status(403).send("Unauthorized access to story");
      }
      
      if (!story.audioPath) {
        return res.status(404).send("Audio not available for this story");
      }
      
      await streamAudioFile(story.audioPath, req, res, false);
    } catch (error: any) {
      console.error("Audio serve error:", error);
      res.status(500).send("Failed to serve audio");
    }
  });

  // Serve audio for shared story (public, token-based)
  app.get("/api/shared-audio/:token", async (req: any, res) => {
    try {
      const { token } = req.params;
      
      const story = await storage.getSharedStory(token);
      
      if (!story) {
        return res.status(404).send("Shared story not found");
      }
      
      if (!story.audioPath) {
        return res.status(404).send("Audio not available for this story");
      }
      
      await streamAudioFile(story.audioPath, req, res, true);
    } catch (error: any) {
      console.error("Shared audio serve error:", error);
      res.status(500).send("Failed to serve audio");
    }
  });

  // Toggle favorite
  app.post("/api/stories/:storyId/favorite", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { storyId } = req.params;
      await storage.toggleFavorite(storyId, userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Toggle favorite error:", error);
      res.status(500).send(error.message || "Failed to toggle favorite");
    }
  });

  // Share story
  app.post("/api/stories/:storyId/share", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { storyId } = req.params;
      const shareToken = await storage.shareStory(storyId, userId);
      res.json({ shareToken });
    } catch (error: any) {
      console.error("Share story error:", error);
      res.status(500).send(error.message || "Failed to share story");
    }
  });

  // Unshare story
  app.delete("/api/stories/:storyId/share", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { storyId } = req.params;
      await storage.unshareStory(storyId, userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Unshare story error:", error);
      res.status(500).send(error.message || "Failed to unshare story");
    }
  });

  // Get shared story (public, no auth required)
  app.get("/api/shared/:shareToken", async (req, res) => {
    try {
      const { shareToken } = req.params;
      const story = await storage.getSharedStory(shareToken);
      if (!story) {
        return res.status(404).send("Story not found");
      }
      res.json(story);
    } catch (error: any) {
      console.error("Get shared story error:", error);
      res.status(500).send("Failed to fetch shared story");
    }
  });

  // Get user payment history
  app.get("/api/payment-history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getUserPaymentHistory(userId);
      res.json(history);
    } catch (error: any) {
      console.error("Get payment history error:", error);
      res.status(500).send("Failed to fetch payment history");
    }
  });

  // Admin middleware
  const isAdmin = async (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }
    const user = await storage.getUserById(req.user.claims.sub);
    if (!user || user.isAdmin !== 'true') {
      return res.status(403).send("Admin access required");
    }
    next();
  };

  // Admin: Get all users
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      console.error("Get all users error:", error);
      res.status(500).send("Failed to fetch users");
    }
  });

  // Admin: Get all payments
  app.get("/api/admin/payments", isAuthenticated, isAdmin, async (req: any, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error: any) {
      console.error("Get all payments error:", error);
      res.status(500).send("Failed to fetch payments");
    }
  });

  // Create Stripe payment intent
  app.post("/api/create-payment-intent", isAuthenticated, async (req: any, res) => {

    const schema = z.object({
      amount: z.number().positive(),
    });

    try {
      const { amount } = schema.parse(req.body);
      const userId = req.user.claims.sub;

      const pkg = CREDIT_PACKAGES.find((p) => p.price === amount);
      if (!pkg) {
        return res.status(400).send("Invalid package");
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${pkg.credits} Story Credits`,
                description: `Generate ${pkg.credits} personalized audio bedtime stories`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.REPL_HOME || "http://localhost:5000"}/bookshelf?payment=success`,
        cancel_url: `${process.env.REPL_HOME || "http://localhost:5000"}/buy-credits?payment=cancelled`,
        metadata: {
          userId: userId,
          credits: pkg.credits.toString(),
        },
      });

      res.json({ checkoutUrl: session.url });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).send(fromError(error).toString());
      }
      console.error("Payment intent error:", error);
      res.status(500).send("Failed to create payment session");
    }
  });

  // Stripe webhook
  app.post("/api/stripe-webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      return res.status(400).send("Missing signature");
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const credits = parseInt(session.metadata?.credits || "0");
        const paymentIntentId = session.payment_intent as string;

        if (!userId || !credits || !paymentIntentId) {
          console.error("Missing metadata in webhook");
          return res.status(400).send("Missing metadata");
        }

        // Check for duplicate processing
        const alreadyProcessed = await storage.checkPaymentProcessed(paymentIntentId);
        if (alreadyProcessed) {
          console.log("Payment already processed:", paymentIntentId);
          return res.json({ received: true });
        }

        // Add credits to user
        const user = await storage.getUserById(userId);
        if (user) {
          await storage.updateUserCredits(user.id, user.credits + credits);
          await storage.recordPayment(paymentIntentId, userId, credits);
          console.log(`Added ${credits} credits to user ${userId}`);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
