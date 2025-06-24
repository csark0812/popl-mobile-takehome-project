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
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    backdrop: 'rgba(0,0,0,0.5)',
    onSurface: '#1A1A1A',
    elevation: {
      level0: 'transparent',
      level1: 'rgba(0,0,0,0.05)',
      level2: 'rgba(0,0,0,0.08)',
      level3: 'rgba(0,0,0,0.11)',
      level4: 'rgba(0,0,0,0.12)',
      level5: 'rgba(0,0,0,0.14)',
    },
  },
  fonts,
  animation: { scale: 1.0 },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  mode: 'adaptive',
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64B5F6',
    background: '#121212',
    surface: '#1E1E1E',
    backdrop: 'rgba(0,0,0,0.5)',
    onSurface: '#F5F5F5',
    elevation: {
      level0: 'transparent',
      level1: 'rgba(0,0,0,0.15)',
      level2: 'rgba(0,0,0,0.18)',
      level3: 'rgba(0,0,0,0.21)',
      level4: 'rgba(0,0,0,0.22)',
      level5: 'rgba(0,0,0,0.24)',
    },
  },
  fonts,
  animation: { scale: 1.0 },
};
