/**
 * Design tokens — spacing
 *
 * Single source of truth for all spacing values (padding, margin, gap).
 *
 * Usage:
 *   import { SPACE } from '@/constants/spacing';
 *   padding: SPACE.LG
 */

export const SPACE = {
  XS:  4,
  SM:  8,
  MD:  12,
  LG:  16,
  XL:  24,
  '2XL': 32,
} as const;

/**
 * Border radius tokens
 */
export const RADIUS = {
  SM:  8,  // pills, badges
  MD:  12, // cards
  LG:  16, // bottom sheets, modals
  FAB: 16, // floating action button
} as const;
