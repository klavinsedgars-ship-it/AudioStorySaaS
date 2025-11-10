# Design Guidelines: Multilingual Audio Story SaaS

## Design Approach

**System Foundation:** Apple Human Interface Guidelines with Material Design elements for data-rich sections
**Rationale:** Clean, efficient SaaS patterns with warm, approachable aesthetics suitable for parent-facing children's content. Balance professional credibility with emotional connection.

**Key Design Principles:**
- Clarity over cleverness - parents are often tired, make actions obvious
- Playful professionalism - SaaS reliability with gentle, story-themed touches
- Progressive disclosure - complex features revealed as needed
- Immediate feedback - always show credit status and action confirmation

---

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts) - clean, readable SaaS standard
- Accent: Quicksand (via Google Fonts) - friendly roundedness for story-related headings

**Hierarchy:**
- Page Titles: Quicksand, 2.5rem (text-4xl), font-bold
- Section Headers: Inter, 1.875rem (text-3xl), font-semibold
- Card/Component Titles: Inter, 1.25rem (text-xl), font-medium
- Body Text: Inter, 1rem (text-base), font-normal, leading-relaxed
- Small Text/Labels: Inter, 0.875rem (text-sm), font-medium
- Credits/Status: Inter, 0.875rem (text-sm), font-bold (prominent visibility)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16, 24
- Micro spacing (gaps, padding): 2, 4
- Component internal: 4, 8
- Component margins: 8, 12, 16
- Section spacing: 16, 24

**Container Strategy:**
- Max width: max-w-7xl for full pages, max-w-4xl for focused workflows
- Padding: px-4 on mobile, px-8 on desktop
- Vertical rhythm: py-12 (mobile), py-16 (desktop) for sections

**Grid Systems:**
- Dashboard/Bookshelf: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Creator workflow: Single column (max-w-2xl) for focus
- Pricing tiers: grid-cols-1 md:grid-cols-3

---

## Component Library

### Navigation
**Global Navbar:**
- Fixed top position with subtle shadow
- Height: h-16
- Left: Logo (Quicksand font, text-xl)
- Center: Main navigation links (Create Story, My Stories, Buy Credits)
- Right: Language selector (dropdown with flag emojis) + Credit display badge + User menu
- Mobile: Hamburger menu, stacked layout

### Story Creator (Main Workflow)

**Container Layout:**
- Centered card (max-w-2xl) with generous padding (p-8)
- Subtle elevation (shadow-lg)
- Border radius: rounded-2xl

**Form Structure:**
1. **Hero Name Input** (prominent, first field)
   - Large text input (text-lg, h-12)
   - Clear label above
   
2. **Additional Names Section**
   - Smaller inputs (h-10) in vertical stack
   - "+" Add button (outlined style, rounded-lg)
   - Each name with remove icon (subtle X)

3. **Generation Mode Toggle**
   - Two large buttons side-by-side (grid-cols-2, gap-4)
   - Active state: solid fill with icon
   - Inactive: outline with muted appearance
   - Minimum height: h-24 (easy tap targets)

4. **Theme Selection** (when mode = theme)
   - Grid of theme cards (grid-cols-2 md:grid-cols-3, gap-4)
   - Each card: 
     - Rounded corners (rounded-xl)
     - Icon at top
     - Theme name centered
     - Hover: subtle elevation increase
     - Selected: border emphasis

5. **Custom Prompt** (when mode = custom)
   - Large textarea (min-h-32)
   - Character counter below
   - Helpful placeholder text

6. **Action Buttons**
   - "Generate Preview" (prominent, w-full, h-12)
   - Disabled state when inputs incomplete

**Story Preview Panel:**
- Appears below form after generation
- Card with distinct treatment (rounded-xl, p-6)
- Story text in larger, comfortable reading size (text-lg, leading-loose)
- Two action buttons:
  - "Try Again (Free)" - outline style
  - "Create Audio & Save (1 Credit)" - solid, prominent
- Spacing between buttons: gap-4

### Bookshelf (Story Library)

**Layout:**
- Masonry grid for varied story card heights
- Cards with elevation (shadow-md, hover:shadow-xl)
- Each card contains:
  - Story title (generated from hero name + theme)
  - Timestamp (text-sm, muted)
  - Audio player (custom design with:
    - Play/pause button (large, circular)
    - Progress bar
    - Time display
    - Volume control)
  - Language badge (subtle, top-right)
  - Character names list (small pills/tags)

### Credit Purchase Page

**Hero Section:**
- Centered headline (text-5xl, Quicksand)
- Subtext explaining credit system
- Current credit count (large, prominent badge)

**Pricing Cards:**
- Three-column grid (responsive to single on mobile)
- Each card (rounded-2xl, p-8):
  - Credit amount (text-6xl, bold)
  - Price (text-4xl)
  - Features list with checkmarks
  - "Buy Now" button (w-full, h-12)
  - Popular tier: elevated with "Best Value" badge

### Authentication States

**Logged Out Landing:**
- Centered hero with:
  - Large headline (text-5xl, Quicksand)
  - Descriptive subtitle (text-xl, max-w-2xl)
  - "Login with Replit" button (prominent, h-14, rounded-xl)
  - Feature highlights below (3-column grid)

**Login Button:**
- Rounded-xl, h-12, px-8
- Icon + text combination
- Prominent placement

### Feedback Components

**Loading States:**
- Spinner with descriptive text ("Generating your story...")
- Positioned in-place, replacing action button

**Success Messages:**
- Toast notifications (top-right)
- Auto-dismiss after 4 seconds
- Icon + message + close button

**Error States:**
- Inline below failed action
- Icon + error text
- Clear "Try Again" action

**Credit Display:**
- Always visible in navbar
- Badge style with number
- Warning state when credits < 3 (different visual treatment)

### Language Selector

**Dropdown Design:**
- Flag emoji + language name
- Positioned in navbar
- Smooth dropdown animation
- Current language highlighted
- Click outside to close

---

## Animations

**Minimal, Purposeful Only:**
- Page transitions: Subtle fade (200ms)
- Card hovers: Scale 1.02, shadow increase (150ms)
- Button states: No animations, instant feedback
- Story preview reveal: Slide down with fade (300ms)
- Toast notifications: Slide in from top-right (250ms)

**Avoid:** Loading spinners beyond 2 seconds, complex scroll-based animations, decorative motion

---

## Images

**Hero Image (Landing Page):**
- Large, warm illustration showing parent and child reading together
- Positioned as background with overlay for text legibility
- Style: Soft, illustrative (not photographic) to match story theme
- Placement: Full viewport height hero section

**Theme Icons:**
- Simple, line-based icons for each theme (Space = rocket, Sea = fish, etc.)
- Consistent stroke weight
- Size: 48x48px minimum for clarity

**Empty States:**
- Bookshelf when no stories: Friendly illustration with "Create your first story" prompt
- Centered, max-w-md

**No Background Patterns:** Keep UI clean and performance-optimized

---

## Accessibility Implementation

- All interactive elements minimum 44x44px (h-11 or larger)
- Form labels always visible (not placeholder-only)
- Focus states: Distinct outline (ring-2 ring-offset-2)
- Audio players: Fully keyboard navigable
- Language selector: Keyboard accessible dropdown
- Credit count: Announced by screen readers
- Error messages: Associated with form fields via aria-describedby