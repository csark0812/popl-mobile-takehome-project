import { useColorScheme } from 'react-native';
import { useSessionStore } from './sessionStore';

/**
 * Returns the selected color scheme: 'light', 'dark', or the device's scheme if set to 'device'.
 */
export function useSelectedColorScheme(): 'light' | 'dark' {
  const theme = useSessionStore((state) => state.theme);
  const deviceScheme = useColorScheme();

  if (theme === 'device') {
    // Fallback to 'light' if deviceScheme is null
    return deviceScheme ?? 'light';
  }
  return theme;
}
