import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

interface ActionBarIconProps {
  icon: string;
  onPress: () => void;
  type?: 'dark' | 'light';
  size?: number;
  accessibilityLabel?: string;
  style?: any;
}

const ActionBarIcon: React.FC<ActionBarIconProps> = ({
  icon,
  onPress,
  type = 'dark',
  size = 20,
  accessibilityLabel,
  style,
}) => {
  const theme = useTheme();

  const isDark = type === 'dark';

  return (
    <IconButton
      icon={icon}
      size={size}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      iconColor={isDark ? theme.colors.onPrimary : theme.colors.primary}
      style={[
        styles.base,
        isDark ? styles.dark : styles.light,
        {
          backgroundColor: isDark
            ? theme.colors.primary
            : theme.colors.surfaceVariant,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    margin: 0,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  light: {
    // No shadow for light variant
  },
});

export default ActionBarIcon;
