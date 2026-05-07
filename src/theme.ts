import { COLORS } from '@/constants/colors';

export interface ThemeColors {
  bgPrimary:     string;
  bgCard:        string;
  bgElevated:    string;
  textPrimary:   string;
  textSecondary: string;
  textMuted:     string;
  border:        string;
  accent:        string;
  accentDim:     string;
}

export const WARM_THEME: ThemeColors = {
  bgPrimary:     COLORS.BG_PRIMARY,
  bgCard:        COLORS.BG_CARD,
  bgElevated:    COLORS.BG_ELEVATED,
  textPrimary:   COLORS.TEXT_PRIMARY,
  textSecondary: COLORS.TEXT_SECONDARY,
  textMuted:     COLORS.TEXT_MUTED,
  border:        COLORS.BORDER,
  accent:        COLORS.ACCENT,
  accentDim:     COLORS.ACCENT_DIM,
};

export function useTheme(): ThemeColors {
  return WARM_THEME;
}
