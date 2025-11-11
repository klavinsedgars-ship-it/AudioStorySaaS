# Multilingual Audio Story SaaS

## Overview

This is a full-stack SaaS application that generates personalized, multilingual audio bedtime stories for children. Parents can create stories featuring their child as the main character, with additional characters like siblings, friends, or pets. The app supports multiple languages (English, Spanish, French, Latvian) and uses a credit-based monetization system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Wouter for routing instead of React Router.

**UI Component Library**: Shadcn/ui with Radix UI primitives, styled with TailwindCSS following the "new-york" style preset. Components use class-variance-authority for variant management.

**Design System**: 
- Typography: Inter (primary) and Quicksand (accent for story-themed headings) via Google Fonts
- Color scheme: Neutral-based with purple/pink gradients for branding
- Layout: Apple Human Interface Guidelines foundation with Material Design elements for data sections
- Responsive grid systems: Mobile-first with breakpoints at md (768px) and lg

**State Management**:
- React Context for global state (Language and User contexts)
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks

**Key Pages**:
- Landing: Unauthenticated marketing page
- Creator: Story generation workflow with two-column desktop layout
  - Left Column: Form controls (hero name, additional names, theme/custom mode toggles, theme grid, generate button)
  - Right Column: StorybookPreview component (sticky) showing empty/loading/success states
  - Mobile: Single-column responsive layout that stacks vertically
  - StorybookPreview Component: Book-styled preview with parchment background, serif font for story text, Quicksand font for titles, subtle spine effect
- Bookshelf: User's story library with favorite/share functionality
- Dashboard: User statistics and payment history
- Admin: User and payment management (admin-only)
- Buy Credits: Credit package purchasing with Stripe integration
- Shared Story: Public story viewing via share tokens

**Internationalization**: 
- Custom translation hook (`useTranslation`) with translation dictionaries
- Global language selector in navbar
- Geo-IP detection for default language setting (design intent, not implemented)
- Language context persisted in localStorage

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**Database**: 
- Neon Postgres (serverless) via @neondatabase/serverless
- Drizzle ORM for type-safe database operations
- Schema includes: users, stories, payments, shared_stories, sessions tables

**Authentication**: 
- Replit Auth via OpenID Connect (OIDC) using openid-client and Passport.js
- Session management with express-session and PostgreSQL session store (connect-pg-simple)
- Session-based authentication with secure cookies

**Storage Strategy**:
- Database: User profiles, story metadata, payment records
- Object Storage: Audio files (MP3s) stored in Replit Object Storage with API-served endpoints
- Audio serving: `/api/audio/:storyId` (authenticated), `/api/shared-audio/:token` (public)

**API Design**:
- RESTful endpoints under `/api/*`
- Authentication endpoints: `/api/login`, `/api/logout`, `/api/auth/user`
- Story management: `/api/stories/*`, `/api/shared/*`
- Payment: `/api/create-payment-intent`, `/api/payment-history`, `/api/webhook/stripe`
- Admin: `/api/admin/users`, `/api/admin/payments`

**Business Logic**:
- Credit system: Free trial (3 credits), one-time purchase packages
- Text-first approval workflow: Generate story text preview (free), then create audio (1 credit)
- Story uniqueness: Backend ensures varied story generation each time
- Rate limiting: In-memory rate limit (10 generations/hour per user)

**Error Handling**:
- Zod validation for request payloads
- Custom error responses with appropriate HTTP status codes
- Unauthorized error detection helpers on client

### AI Integration Strategy

**Text Generation (Two-Step Generate-then-Edit Process)**: 
- **Step 1 - Generate Draft**: OpenAI API (gpt-4o-mini, temp 0.9) creates initial story using language-specific Master Prompts
  - Latvian Master Prompt: Comprehensive prompt in Latvian with specific grammar rules and structure
  - English Master Prompt: Equivalent prompt for English and other languages
  - Random plot element injection for story uniqueness
  - System role enforces clean story output without prefaces
- **Step 2 - Edit & Fix**: OpenAI API (gpt-4o, temp 0.3) corrects grammar and naturalness with superior quality
  - Uses powerful gpt-4o model for professional-grade editing (upgraded from gpt-4o-mini for better grammatical quality)
  - Latvian Editor Prompt: Professional Latvian language editor that fixes grammar errors, awkward phrasing, incorrect word choices
  - English Editor Prompt: Equivalent editor for English and other languages
  - System role ensures only corrected story text is returned
- Final corrected text sent to user for approval before audio generation
- Supports theme-based or custom prompt modes
- Language-aware story generation with native-quality grammar
- Model strategy: Fast gpt-4o-mini for creative drafting, powerful gpt-4o for final polish

**Audio Generation**:
- ElevenLabs API for text-to-speech conversion
- Model: **Eleven v3 (Alpha)** - Most expressive model with superior multilingual support
- Voice configuration per language:
  - Latvian: Liam voice (TX3LPaxmHKxFdv7VOQHJ)
  - English: Rachel voice (21m00Tcm4TlvDq8ikWAM)
  - Spanish/French: Bella voice (EXAVITQu4vr4xnSDxMaL)
- MP3 format audio files stored in Replit Object Storage
- HTTP range request support for streaming and seeking

**Illustration Generation**:
- OpenAI DALL-E 3 for story illustrations
- Two-step process: gpt-4o-mini creates concise art prompt, then DALL-E 3 generates 1024x1024 PNG image
- Images stored in Replit Object Storage alongside audio files
- Served via `/api/audio/:storyId?asset=image` endpoint

### Async Generation Pipeline

**Architecture**: Fire-and-forget in-process background jobs with sequential execution pattern

**Status Flow**:
- Initial: `pending` (story created, credit deducted, background jobs launched)
- Audio Phase: `gen_audio` (audio generation in progress)
- Illustration Phase: `gen_image` (audio complete, illustration in progress)
- Success: `complete` (both audio and illustration complete)
- Failure States: `failed_audio` (audio failed, illustration skipped), `failed_image` (audio succeeded, illustration failed)

**Sequential Execution**:
- Background jobs run sequentially: audio first, then illustration
- Illustration only starts if audio succeeds
- Both jobs return boolean success indicators
- Status transitions are deterministic and preserve failure states

**Retry Logic**:
- Audio: 3 attempts with exponential backoff (500ms, 1500ms, 3000ms)
- Illustration: 2 attempts with exponential backoff (1000ms, 3000ms)

**Frontend Integration**:
- Creator redirects to StoryLoading page immediately after story creation
- StoryLoading polls `/api/story/status/:storyId` every 2.5 seconds
- Exponential backoff after 30 seconds for reduced server load
- 5-minute timeout for generation process
- Displays magical loading animations with progress indicators
- Redirects to Bookshelf when complete or failed

**Error Handling**:
- Credits deducted immediately when story creation begins
- Credits preserved on audio/illustration failure (not refunded)
- Failed stories remain visible in Bookshelf with status indicators
- Users can retry from failed stories (future feature)

### Payment Processing

**Provider**: Stripe (using API version 2025-10-29.clover)

**Flow**:
- Credit packages defined in schema (5 credits/$4.99, 15 credits/$11.99, 50 credits/$29.99)
- Payment Intent creation redirects to Stripe Checkout
- Webhook handler processes successful payments and adds credits
- Payment deduplication via processed payment ID tracking

**Security**: 
- Webhook signature verification using raw body parsing
- Payment history tracking per user

## External Dependencies

### Third-Party APIs
- **OpenAI API**: Story text generation (requires `OPENAI_API_KEY`)
- **ElevenLabs API**: Text-to-speech audio generation (requires `ELEVENLABS_API_KEY`)
- **Stripe**: Payment processing (requires `STRIPE_SECRET_KEY`)

### Database & Infrastructure
- **Neon Postgres**: Serverless PostgreSQL database (requires `DATABASE_URL`)
- **Replit App Storage**: Object storage for MP3 audio files
- **Replit Auth**: OIDC authentication provider (requires `ISSUER_URL`, `REPL_ID`)

### Session Management
- Session secret for cookie signing (requires `SESSION_SECRET`)
- PostgreSQL session store for server-side session persistence

### Development Tools
- Vite for frontend build and development server
- Drizzle Kit for database migrations
- ESBuild for backend bundling
- TypeScript for type safety across stack

### Frontend Libraries
- React Query for server state
- Wouter for client-side routing
- Radix UI for accessible component primitives
- Framer Motion for animations (imported but usage TBD)
- date-fns for date formatting
- zod for runtime validation

### Styling & UI
- TailwindCSS with PostCSS
- Custom design tokens via CSS variables
- Google Fonts (Inter, Quicksand)