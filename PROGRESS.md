# FenrirAI Portfolio - Build Progress

This document tracks what was done in each section, learnings, and decisions made during implementation.

---

## Section 1: Project Foundation

### What Was Built
- **Project initialization**: Vite + React 18 + TypeScript via `bun create vite`
- **Dependencies installed**:
  - Styling: Tailwind CSS v4, PostCSS, `tailwindcss-animate`
  - UI: Radix primitives (Dialog, Collapsible, Tabs, ScrollArea, etc.)
  - Animation: Framer Motion
  - State: TanStack Query
  - Forms: React Hook Form + Zod
  - Backend: Supabase client
  - Icons: Lucide React
- **Configuration**:
  - Tailwind v4 with CSS-first theme configuration
  - Path aliases (`@/`) in Vite and TypeScript
  - Dark theme colors (#0a0a0a bg, #4ade80 accent)
  - Custom fonts (Playfair Display, Inter)
- **Project structure**: `components/`, `pages/`, `hooks/`, `lib/`, `types/`
- **Type definitions**: Full Supabase database types matching schema

### Learnings
1. **Tailwind CSS v4 breaking change**: The PostCSS plugin moved to `@tailwindcss/postcss`. The error message is clear, but worth remembering.
2. **Tailwind v4 theme syntax**: Uses CSS `@theme { }` block instead of `tailwind.config.js`. More intuitive for CSS-first workflows.
3. **Bun needs explicit path**: After fresh install, use `~/.bun/bin/bun` until shell is reloaded.

### Technical Decisions
- Used CSS-first Tailwind v4 configuration over JS config for simplicity
- Defined all Supabase types upfront to catch schema mismatches early
- Created `.env.example` for easy onboarding

---

## Section 2: UI Components

### What Was Built
Core shadcn/ui-style components wrapping Radix primitives:
- **Button** - CVA variants (default, destructive, outline, secondary, ghost, link)
- **Card** - Glass-morphism ready (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Input** - Form input with focus ring
- **Textarea** - Multi-line input for JD analyzer
- **Badge** - Status indicators (default, secondary, destructive, outline, success, warning)
- **Label** - Form labels
- **Separator** - Horizontal/vertical dividers
- **ScrollArea** - Custom scrollbar wrapper
- **Dialog** - Modal with overlay and close button
- **Collapsible** - Expandable panels for experience section
- **Avatar** - Profile images with fallback
- **Tooltip** - Hover information

### Learnings
1. **Component pattern**: shadcn/ui components use `forwardRef` + `cn()` utility for className merging. This enables composition.
2. **CVA for variants**: `class-variance-authority` provides type-safe variant props. Cleaner than conditional classnames.
3. **Radix re-exports**: Some components (Collapsible) are thin wrappers that just re-export Radix. No styling needed.

### Technical Decisions
- Used serif font for CardTitle to match design system (Playfair Display)
- Added `success` and `warning` Badge variants for skills matrix
- Dialog uses animate-in/out from Tailwind for smooth transitions

---

## Section 3: Public Site - Layout & Hero

### What Was Built
- **Layout.tsx** - Main wrapper with flex column structure (main + footer)
- **Footer.tsx** - Social links (GitHub, LinkedIn, Twitter, Email) with hover states
- **Hero.tsx** - Main landing section with:
  - Animated status badge (actively_looking/open/not_looking)
  - Pulsing dot indicator for "actively looking" status
  - Large serif name (Playfair Display)
  - Title and tagline
  - Company pills with subtle glow-on-hover effect
  - "Ask AI About Me" CTA button
  - Framer Motion staggered animations on load
- **Home.tsx** - Updated to use Layout + Hero with placeholder data

### Learnings
1. **Framer Motion stagger pattern**: Use `transition={{ delay: 0.1 * index }}` for staggered child animations. Simple and effective.
2. **CSS pulsing indicator**: Combine `animate-ping` (expanding) with a solid inner dot for professional status indicators.
3. **Glass-morphism subtle borders**: `border-border bg-card/50` creates subtle depth without overwhelming the dark theme.

### Technical Decisions
- Status badge uses conditional ping animation only for "actively_looking"
- Company pills have `glow-accent` class for subtle green glow on hover
- Placeholder data in Home.tsx clearly marked for Section 7 replacement
- Footer social links use Lucide icons with `size-5` for consistency

### Visual Verification
Screenshot captured showing dark theme working correctly with all elements rendering as designed.

---

## Section 4: Public Site - Content Sections

### What Was Built
- **Experience.tsx** - Work history cards with:
  - Job title, company, date range
  - "Current" badge for active roles
  - Bullet points for responsibilities
  - "Proudest achievement" highlighted section (green background)
  - Expandable "AI Context" panel with honest reflections (why joined/left, challenges, lessons learned, etc.)
  - Framer Motion animations on scroll
- **Skills.tsx** - Three-column skills matrix:
  - **Strong** (green) - "I can hit the ground running"
  - **Moderate** (yellow) - "Competent with some ramp-up"
  - **Growth Areas** (gray/blue) - "Learning or want to learn"
  - Tooltip on hover showing evidence, honest notes, years of experience
  - Self-rating displayed as (X/10)
- **Home.tsx** - Updated with realistic placeholder data demonstrating all features

### Learnings
1. **Framer Motion + Radix Collapsible**: AnimatePresence can cause React hook warnings when combined with Radix. Works visually but logs dev warnings.
2. **Honest placeholder data**: Writing realistic "AI Context" content (why_joined, why_left, honest_notes) helps validate the UX before real data.
3. **whileInView animation**: Using `viewport={{ once: true }}` prevents re-animation on scroll, which feels more professional.

### Technical Decisions
- Experience cards sorted by: current first, then display_order
- AI Context is hidden by default - opt-in transparency
- Skills grouped client-side by category for flexibility
- TooltipProvider wraps entire Skills section for performance

### Visual Verification
Full-page screenshot shows:
- Glass morphism cards with subtle green glow
- Proper spacing and typography hierarchy
- Responsive 3-column grid for skills

---

## Section 5: Interactive Features

### What Was Built
- **JDAnalyzer.tsx** - Job description fit assessment:
  - Two-column layout: input (left), results (right)
  - Textarea for pasting job descriptions
  - Loading state with spinner
  - Results card showing:
    - Match score percentage (large number)
    - Recommendation badge (Good Fit / Worth Considering / Not Ideal)
    - Color-coded recommendation (green/yellow/red)
    - Strengths list with green checkmarks
    - Gaps/Concerns list with yellow warning icons
    - Honest summary quote
  - Placeholder analysis function with keyword matching for demo
- **ChatDrawer.tsx** - AI chat interface:
  - Slide-in drawer from right (Framer Motion spring animation)
  - Semi-transparent backdrop
  - Header with "Ask AI About Me" title
  - Welcome message explaining honest approach
  - Suggested questions as clickable pills
  - Message list with user/AI avatars
  - Loading state during AI response
  - Input field with send button
  - Placeholder response function with honest answers

### Learnings
1. **AnimatePresence mode="wait"**: Ensures exit animation completes before enter animation for smooth transitions between loading/results states.
2. **Placeholder functions are valuable**: Writing realistic placeholder logic (keyword matching, honest responses) validates the UX before API integration.
3. **Spring animations feel natural**: `type: 'spring', damping: 25, stiffness: 300` creates a smooth drawer slide effect.

### Technical Decisions
- JD Analyzer uses simple keyword matching for demo - will be replaced by Claude API in Section 7
- Chat drawer uses session state (not persisted) - will add Supabase persistence later
- Suggested questions disappear after first message to reduce clutter
- Results show self-ratings (e.g., "6/10") to maintain honesty context

### Visual Verification
Screenshots captured showing:
- Chat drawer with honest weakness response
- JD Analyzer with 65% match, "Worth Considering" recommendation, and honest gaps

---

## Section 6: Admin Panel

### What Was Built
- **useAuth.ts** - Authentication hook wrapping Supabase Auth:
  - Tracks session state (user, isAuthenticated, loading)
  - Handles session changes via `onAuthStateChange`
  - Provides signIn, signOut, signUp methods
  - Proper cleanup on unmount

- **ProtectedRoute.tsx** - Route guard with demo mode:
  - Redirects unauthenticated users to /admin/login
  - **Demo mode**: Bypasses auth when Supabase credentials missing
  - Loading spinner during auth check

- **Login.tsx** - Admin login page:
  - Email/password form with Zod validation
  - Error display for failed logins
  - Redirect to admin panel on success
  - Clean dark theme styling

- **AdminLayout.tsx** - Admin dashboard shell:
  - Sidebar navigation (Profile, Experience, Skills, Gaps, FAQ)
  - Active route highlighting
  - Sign out button
  - Content area with `<Outlet />` for nested routes

- **Profile.tsx** - Profile management form:
  - Basic Info: Name, title, email, tagline
  - Your Story: Career narrative, looking for, not looking for
  - Job Preferences: Target titles, company stages, salary range, availability, location, remote preference
  - Social Links: GitHub, LinkedIn, Twitter
  - React Hook Form + Zod validation
  - Placeholder data for demo

- **ExperienceAdmin.tsx** - Experience CRUD:
  - List view with cards showing company, title, dates
  - Add/Edit dialog with full form:
    - Basic info (company, title, dates, is_current)
    - Public content (bullet points)
    - AI Context section (why joined/left, contributions, challenges, lessons, etc.)
  - Delete with confirmation
  - "Current" badge for active roles

- **SkillsAdmin.tsx** - Skills management:
  - List view organized by category (Technical, Framework, Tool, etc.)
  - Add/Edit dialog with:
    - Skill name, category dropdown
    - Self-rating slider (1-10)
    - Evidence, honest notes, years experience
  - Visual rating display in list
  - "Actively learning" badge

- **GapsAdmin.tsx** - Gaps & weaknesses management:
  - Explainer card about why documenting gaps builds trust
  - List view with gap type badges
  - Add/Edit dialog with:
    - Gap type (Technical, Soft Skill, Domain, Experience)
    - Description, why it's a gap
    - Interest in learning checkbox

- **FaqAdmin.tsx** - FAQ responses:
  - Two sections: Common Questions (starred), Other Questions
  - Add/Edit dialog with question, answer, is_common checkbox
  - Card layout showing question title and answer preview

- **App.tsx** - Updated routing:
  - Public: `/` (Home)
  - Admin login: `/admin/login`
  - Protected admin routes: `/admin/*` with nested routes

- **supabase.ts** - Graceful degradation:
  - Uses placeholder URL/key when env vars missing
  - Exports `isMissingCredentials` flag for demo mode detection
  - Console warning when credentials missing

### Learnings
1. **Demo mode pattern**: Exporting `isMissingCredentials` from Supabase client allows ProtectedRoute to bypass auth for local development without credentials. Enables full UI testing.
2. **Placeholder URLs for Supabase**: Supabase client throws if URL is empty string. Using `'https://placeholder.supabase.co'` prevents initialization errors.
3. **React Hook Form + checkboxes**: Native checkbox with `{...register('field')}` works correctly for boolean fields. No special handling needed.
4. **Nested routes with Outlet**: React Router's `<Outlet />` in AdminLayout cleanly renders child routes while preserving sidebar.

### Technical Decisions
- Used local state for all admin forms (not TanStack Query yet) - will wire to Supabase in Section 7
- Demo mode shows all admin features without requiring Supabase setup
- Forms pre-filled with realistic placeholder data for testing
- AI Context fields in ExperienceAdmin mirror the exact Supabase schema (why_joined, why_left, actual_contributions, etc.)
- Confirmation dialogs use native `confirm()` for simplicity - could upgrade to Radix AlertDialog later

### Visual Verification
Admin panel screenshot shows working sidebar, profile form, and all sections accessible in demo mode.

---

## Section 7: Supabase Integration

### What Was Built
- **useProfile.ts** - Profile data hook:
  - `useProfile()` - Fetches candidate profile with TanStack Query
  - `useUpdateProfile()` - Mutation for profile updates
  - Placeholder data for demo mode when Supabase not configured

- **useExperiences.ts** - Experience data hook:
  - `useExperiences()` - Fetches work history
  - `useCreateExperience()`, `useUpdateExperience()`, `useDeleteExperience()` - CRUD mutations
  - Rich placeholder data with AI context fields

- **useSkills.ts** - Skills data hook:
  - `useSkills()` - Fetches skills ordered by self_rating
  - CRUD mutations for skill management
  - Placeholder data across all strength levels

- **useGaps.ts** - Gaps/weaknesses data hook:
  - `useGaps()` - Fetches documented gaps
  - CRUD mutations
  - Honest placeholder gaps (K8s, public speaking, ML)

- **useFaqs.ts** - FAQ responses hook:
  - `useFaqs()` - Fetches pre-written answers
  - CRUD mutations
  - Common questions (salary, why left, relocation)

- **useChat.ts** - AI chat integration:
  - Session-based message tracking
  - Calls `/chat` Edge Function when Supabase configured
  - Keyword-based placeholder responses for demo mode

- **useJDAnalyzer.ts** - JD analysis hook:
  - `analyze()` function for job description analysis
  - Calls `/analyze-jd` Edge Function when Supabase configured
  - Keyword matching for demo mode (detects React, TypeScript, K8s, ML, etc.)

- **Home.tsx** - Updated to use data hooks:
  - Loading state while data fetches
  - Profile data feeds Hero component
  - Companies extracted from experiences
  - Skills grouped by self_rating (not category)

- **Skills.tsx** - Updated categorization:
  - `getStrengthCategory()` derives display category from self_rating
  - Strong: 7-10, Moderate: 5-6, Growth: 1-4

- **SkillsAdmin.tsx** - Updated for new data model:
  - Category is now skill type (Language, Framework, DevOps, etc.)
  - Strength level derived from self_rating
  - UI groups by strength, displays category in labels

### Learnings
1. **Supabase client typing issues**: The Database types weren't matching insert/update parameters. Using `(supabase as any)` for mutations avoids type errors while maintaining safety at the data level.

2. **Self-rating based categorization**: The database stores `category` as skill type, not strength level. Display categorization must be derived from `self_rating` at render time.

3. **Demo mode consistency**: Every hook checks `isMissingCredentials` and returns placeholder data. This enables full UI testing without any backend configuration.

4. **TanStack Query patterns**:
   - `useQuery` for reads with automatic caching
   - `useMutation` with `onSuccess` to invalidate queries after writes
   - 5-minute stale time reduces unnecessary refetches

### Technical Decisions
- Used `(supabase as any)` for mutations rather than fighting complex generic types
- Chat uses session-based state (not persisted to DB in demo mode)
- JD analyzer has sophisticated keyword matching for realistic demo experience
- Placeholder data is realistic and demonstrates the "honest" philosophy
- All hooks return typed data with proper null handling

### Integration Notes
When Supabase is configured (env vars set):
- Profile fetched from `candidate_profile` table (single row)
- Experiences ordered by `display_order`
- Skills ordered by `self_rating` descending
- Chat calls `/chat` Edge Function with session_id
- JD Analyzer calls `/analyze-jd` Edge Function

Demo mode (no Supabase):
- All hooks return static placeholder data
- Simulated API delays for realistic UX
- Console warning about missing credentials

---

## Section 8: Deploy

### What Was Built
- **vercel.json** - Vercel configuration:
  - Framework preset: Vite
  - Build command: `bun run build`
  - Output directory: `dist`
  - SPA rewrites for client-side routing

### Deployment Steps

1. **Initialize Git repository** (if not done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Brutally Honest Portfolio"
   ```

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

3. **Configure Environment Variables** in Vercel Dashboard:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

4. **Supabase Edge Functions** (optional):
   - Deploy Edge Functions to your Supabase project
   - Set `ANTHROPIC_API_KEY` in Supabase secrets
   - The functions handle `/chat` and `/analyze-jd` endpoints

### Local Testing Before Deploy
```bash
# Build
bun run build

# Preview production build
bun run preview
```

### Notes
- App works in demo mode without Supabase (uses placeholder data)
- Supabase Edge Functions require separate deployment
- Custom domain can be configured in Vercel dashboard
