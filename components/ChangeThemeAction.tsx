import { useSessionStore } from '@hooks/sessionStore';
import type { ComponentProps } from 'react';
import React from 'react';
import { Appbar } from 'react-native-paper';

const themeIcons = {
  light: 'white-balance-sunny', // sun
  dark: 'weather-night', // moon
  device: 'cellphone', // phone
};

// Accept all Appbar.Action props except icon, onPress, and accessibilityLabel
export default function ChangeThemeAction(
  props: Omit<
    ComponentProps<typeof Appbar.Action>,
    'icon' | 'onPress' | 'accessibilityLabel'
  >,
) {
  const theme = useSessionStore((s) => s.theme);
  const setTheme = useSessionStore((s) => s.setTheme);

  const handleToggle = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('device');
    else setTheme('light');
  };

  return (
    <Appbar.Action
      icon={themeIcons[theme]}
      onPress={handleToggle}
      accessibilityLabel="Change theme"
      {...props}
    />
  );
}
