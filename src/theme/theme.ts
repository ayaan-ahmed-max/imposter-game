import { colors } from './colors';
import { fontFamily, fontSize } from './typography';

export const theme = {
  colors,
  fontFamily,
  fontSize,
} as const;

export type Theme = typeof theme;
