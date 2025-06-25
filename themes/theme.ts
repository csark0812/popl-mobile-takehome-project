import { Platform } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from 'react-native-paper';
import { MD3Typescale } from 'react-native-paper/lib/typescript/types';
import androidFonts from './fonts.android';
import iosFonts from './fonts.ios';

const fonts = (Platform.OS === 'ios' ? iosFonts : androidFonts) as MD3Typescale;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  dark: false,
  mode: 'adaptive',
  roundness: 6,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4A90E2', // Professional blue - trustworthy, modern
    secondary: '#FF8A65', // Warm coral accent for contrast
    tertiary: '#7FB3D3', // Lighter blue companion
    background: '#FEFEFE', // Clean white
    surface: '#F8FAFC', // Subtle blue-gray tint
    surfaceVariant: '#EBF3FD', // Light blue tint
    backdrop: 'rgba(74,144,226,0.4)', // Primary with transparency
    onSurface: '#1E293B', // Deep slate text
    onSurfaceVariant: '#475569', // Medium slate
    outline: '#CBD5E1', // Soft blue-gray outline
    elevation: {
      level0: 'transparent',
      level1: 'rgba(74,144,226,0.06)', // Subtle blue shadows
      level2: 'rgba(74,144,226,0.09)',
      level3: 'rgba(74,144,226,0.12)',
      level4: 'rgba(74,144,226,0.14)',
      level5: 'rgba(74,144,226,0.16)',
    },
  },
  fonts,
  animation: { scale: 1.0 },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  mode: 'adaptive',
  roundness: 6,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60A5FA', // Brighter blue for dark mode contrast
    secondary: '#FFAB91', // Warm peach accent
    tertiary: '#93C5FD', // Light blue companion
    background: '#0F172A', // Deep slate background
    surface: '#1E293B', // Rich dark slate surface
    surfaceVariant: '#334155', // Medium slate variant
    backdrop: 'rgba(96,165,250,0.4)', // Primary with transparency
    onSurface: '#F1F5F9', // Soft light slate text
    onSurfaceVariant: '#CBD5E1', // Medium light slate
    outline: '#475569', // Muted slate outline
    elevation: {
      level0: 'transparent',
      level1: 'rgba(96,165,250,0.08)', // Subtle blue glow
      level2: 'rgba(96,165,250,0.12)',
      level3: 'rgba(96,165,250,0.16)',
      level4: 'rgba(96,165,250,0.18)',
      level5: 'rgba(96,165,250,0.20)',
    },
  },
  fonts,
  animation: { scale: 1.0 },
};
