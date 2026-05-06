/**
 * Design tokens — colors
 *
 * Single source of truth for every color in the app.
 * Change values here; every screen and component updates automatically.
 * Never hardcode hex strings anywhere else.
 *
 * Usage:
 *   import { COLORS } from '@/constants/colors';
 *   backgroundColor: COLORS.BG_PRIMARY
 */

export const COLORS = {
  // ─── Backgrounds ───────────────────────────────────────────────────────────
  BG_PRIMARY:  '#111111', // main background
  BG_CARD:     '#1A1A1A', // card / surface
  BG_ELEVATED: '#222222', // modals, bottom sheets

  // ─── Accent ────────────────────────────────────────────────────────────────
  // Change these two per app — everything else stays the same
  ACCENT:     '#EF9F27', // primary accent: active state, CTAs, highlights
  ACCENT_DIM: '#2A1A00', // accent badge / tinted background

  // ─── Semantic — red ────────────────────────────────────────────────────────
  // Use for: errors, destructive actions, urgent alerts
  RED:     '#E24B4A',
  RED_DIM: '#2A0A0A',

  // ─── Semantic — green ──────────────────────────────────────────────────────
  // Use for: success, confirmed, safe
  GREEN:     '#1D9E75',
  GREEN_DIM: '#0A1F10',

  // ─── Text ──────────────────────────────────────────────────────────────────
  TEXT_PRIMARY:   '#F0EBE0', // main readable text
  TEXT_SECONDARY: '#888888', // muted / metadata
  TEXT_MUTED:     '#444444', // placeholder, disabled

  // ─── Borders & dividers ────────────────────────────────────────────────────
  BORDER: '#2A2A2A',
} as const;

export type ColorKey = keyof typeof COLORS;
