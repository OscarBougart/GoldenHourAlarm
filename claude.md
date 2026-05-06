# CLAUDE.md — Universal App Factory Template

Read this fully before making any changes. Never deviate without being explicitly asked.

## What this app is

<!-- APP-SPECIFIC: Replace this section per app -->
**App Name:** [APP_NAME]
**One-liner:** [What it does in one sentence]
**Core user action:** [The single most important thing the user does]

## Design principles

- **Speed above all** — no loading spinners for local data. Open app → ready in one tap.
- **Dark first** — never render a white background. Light mode is opt-in.
- **Large tap targets** — minimum 48×48pt.
- **One-handed use** — primary actions bottom-aligned. No reaching to top corners.

## Tech stack

| Concern | Library |
|---------|---------|
| Framework | Expo SDK 54 (managed workflow) |
| Navigation | Expo Router v6 (file-based, `app/` directory) |
| State | Zustand |
| Local DB | expo-sqlite + drizzle-orm (offline-first) |
| Backend | Supabase (auth, Edge Functions for AI, Postgres when needed) |
| Styling | `StyleSheet.create()` — no CSS-in-JS |
| Icons | `@expo/vector-icons` (Ionicons) |
| Haptics | expo-haptics |
| Search | Fuse.js (fuzzy) |
| Animations | react-native-reanimated + gesture-handler |
| AI | Anthropic API via Supabase Edge Function |
| IDs | uuid + react-native-get-random-values |

Never introduce a new library without asking first.

## Design tokens

All tokens live in `constants/`. Never hardcode values.

| File | Exports |
|------|---------|
| `colors.ts` | `BG_PRIMARY`, `BG_CARD`, `BG_ELEVATED`, `BORDER`, `TEXT_PRIMARY`, `TEXT_SECONDARY`, `TEXT_MUTED`, `GREEN`, `RED`, accent colors |
| `typography.ts` | `FONT_SIZE.XS/SM/MD/LG/XL`, `FONT_WEIGHT.NORMAL/BOLD` |
| `spacing.ts` | `SPACE.XS/SM/MD/LG/XL/2XL`, `RADIUS.SM/MD/LG` |

## Folder structure

```
app/              → Expo Router screens (file-based routing)
  (tabs)/         → Tab navigator screens
  _layout.tsx     → Root layout with providers
components/       → Reusable UI components
constants/        → Design tokens (colors, typography, spacing)
hooks/            → Custom React hooks
lib/              → Utility libraries (supabase client, etc.)
services/         → External API integrations
src/              → Theme system, accent colors
store/            → Zustand stores
utils/            → Pure helper functions
```

## Key screens & routes

<!-- APP-SPECIFIC: Replace with your app's routes -->

| Route | Purpose |
|-------|---------|
| `/(tabs)/index` | Main screen |
| `/(tabs)/settings` | App settings |

## Coding rules

- TypeScript strict — no `any`, no missing types.
- Functional components + hooks only.
- One default export per file.
- `Pressable` only — never `TouchableOpacity`.
- `StyleSheet.create()` for all static styles — colors included.
- All colors from `COLORS` in `constants/colors.ts`. Never hardcode hex strings.
- All spacing from `constants/spacing.ts`.
- Haptic feedback on: save, delete, favourite toggle, tab press.
- Accessibility labels on every interactive element.

## Naming conventions

| Thing | Convention |
|-------|-----------|
| Components | `PascalCase.tsx` |
| Hooks | `useCamelCase.ts` |
| Stores | `camelCaseStore.ts` |
| Constants | `SCREAMING_SNAKE_CASE` |
| DB tables | `snake_case` |

## Supabase patterns

- Client setup in `lib/supabase.ts`.
- AI calls go through Supabase Edge Functions — never expose API keys client-side.
- Auth via `@supabase/supabase-js` with `expo-secure-store` for token persistence.
- Offline-first: local SQLite is the source of truth, Supabase syncs when online.

## Monetization

- In-app purchases via RevenueCat.
- Freemium pattern: core features free, premium behind paywall.
- Subscription screen at `app/subscription/`.
