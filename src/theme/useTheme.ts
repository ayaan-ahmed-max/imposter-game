import { theme } from './theme';

// No context/provider yet — static single theme. A Provider can be
// slotted in later without touching call sites, since this stays a hook.
export function useTheme() {
  return theme;
}
