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
  XL: 20, // screen titles
  LG: 16, // card titles, drink names
  MD: 14, // body, ingredients
  SM: 12, // metadata, timestamps, tags
  XS: 10, // labels, category pills
} as const;

export const FONT_WEIGHT = {
  BOLD:   '500' as const,
  NORMAL: '400' as const,
} as const;
