# FenrirAI Portfolio - Engineering Principles

## Core Philosophy

- **KISS** - No unnecessary abstractions, flat structures, direct API calls
- **Component-first** - Build UI components before connecting to Supabase
- **Type safety** - Define TypeScript types matching the Supabase schema
- **Progressive enhancement** - Static content works, then add interactivity
- **Mobile-first** - Design for mobile, enhance for desktop

## Workflow

1. **Explore** - Understand existing code before changes
2. **Plan** - Break down tasks into small, testable pieces
3. **Code** - Implement with minimal abstraction
4. **Test** - Verify in browser before moving on

## Build Phases

When building from scratch, follow this order:

1. **Foundation** - Vite + React 18, install deps, configure Tailwind v4, define TypeScript types
2. **UI Components** - Build shadcn/ui style primitives (Button, Card, Input, etc.)
3. **Layout & Hero** - Header, Footer, Layout wrapper, Hero section with animated text
4. **Content Sections** - Experience timeline, Skills grid with strength indicators
5. **Interactive Features** - Chat drawer, JD Analyzer with file upload
6. **Admin Panel** - Auth flow, CRUD forms for all content types
7. **Supabase Integration** - Connect hooks to real data, add demo mode fallbacks
8. **Deploy** - Vercel config, environment variables, test production build

## Code Guidelines

- Use semantic HTML (proper headings, landmarks, ARIA labels)
- Error boundaries for graceful degradation when API calls fail
- Loading states for every async operation
- Avoid backwards-compatibility hacks - delete unused code
- No feature flags or premature abstractions

## Demo Mode Pattern

When Supabase credentials are missing, the app gracefully falls back to demo mode:

- Export `isMissingCredentials` from Supabase client
- Every hook checks this flag and returns placeholder data
- Use placeholder URL to prevent Supabase client initialization errors
- Console warning when credentials missing

## TanStack Query Patterns

- `useQuery` for reads with automatic caching
- `useMutation` with `onSuccess` to invalidate queries after writes
- 5-minute stale time reduces unnecessary refetches
- Use `(supabase as any)` for mutations to avoid complex generic type issues

## Component Patterns

- shadcn/ui style: `forwardRef` + `cn()` utility for className merging
- CVA (class-variance-authority) for type-safe variant props
- Radix thin wrappers can just re-export primitives

## Animation Patterns

- Framer Motion stagger: `transition={{ delay: 0.1 * index }}`
- `viewport={{ once: true }}` prevents re-animation on scroll
- `AnimatePresence mode="wait"` for loading/results transitions
- Spring animation: `type: 'spring', damping: 25, stiffness: 300`

## Tailwind v4 Notes

- PostCSS plugin is `@tailwindcss/postcss`
- Theme uses CSS `@theme { }` block, not tailwind.config.js

## Skills Data Model

- Database `category` = skill type (Language, Framework, DevOps)
- Display strength derived from `self_rating`: Strong 7-10, Moderate 5-6, Growth 1-4
