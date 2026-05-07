/**
 * Design tokens — typography
 *
 * Single source of truth for font sizes and weights.
 *
 * Usage:
 *   import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography';
 *   fontSize: FONT_SIZE.LG
 */

export const FONT_SIZE = {
  '2XL': 28, // countdown hero
  XL:  20,   // screen titles
  LG:  16,   // card titles
  MD:  14,   // body
  SM:  12,   // metadata, timestamps
  XS:  10,   // labels, pills
} as const;

export const FONT_WEIGHT = {
  BLACK:  '800' as const,
  BOLD:   '600' as const,
  MEDIUM: '500' as const,
  NORMAL: '400' as const,
} as const;
