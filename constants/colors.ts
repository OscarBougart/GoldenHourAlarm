export const COLORS = {
  // ─── Amber backgrounds ─────────────────────────────────────────────────────
  BG_PRIMARY:  '#E8820C', // main amber background
  BG_CARD:     '#D4720A', // slightly darker amber — cards sit on top
  BG_ELEVATED: '#C5640A', // deeper amber — elevated / pressed surfaces

  // ─── White overlays for interactive states ─────────────────────────────────
  ACCENT:     '#FFFFFF',
  ACCENT_DIM: 'rgba(255,255,255,0.15)',

  // ─── Text ──────────────────────────────────────────────────────────────────
  TEXT_PRIMARY:   '#FFFFFF',
  TEXT_SECONDARY: 'rgba(255,255,255,0.72)',
  TEXT_MUTED:     'rgba(255,255,255,0.42)',

  // ─── Borders ───────────────────────────────────────────────────────────────
  BORDER: 'rgba(255,255,255,0.22)',

  // ─── Semantic ──────────────────────────────────────────────────────────────
  RED:   '#FF6B6B',
  GREEN: '#2ECC71',

  // ─── Amber shades ──────────────────────────────────────────────────────────
  AMBER_LIGHT: '#F5A623',
  AMBER_DARK:  '#C1640A',
  AMBER_DEEP:  '#A85508',
} as const;

export type ColorKey = keyof typeof COLORS;
