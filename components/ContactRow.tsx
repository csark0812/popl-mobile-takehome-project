import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';

export type ContactRowProps = {
  icon: string;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

const ContactRow: React.FC<ContactRowProps> = ({
  icon,
  label,
  onPress,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.contactButton,
        pressed && styles.contactButtonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${icon} ${label}`}
      android_ripple={{
        color: theme.colors.primary,
        borderless: false,
        radius: 200,
      }}
    >
      <View style={styles.contactRowContent}>
        <Icon source={icon} size={18} color={theme.colors.primary} />
        <Text style={styles.contactText} numberOfLines={1} ellipsizeMode="tail">
          {label}
        </Text>
        <Icon
          source="chevron-right"
          size={16}
          color={theme.colors.onSurfaceVariant}
        />
      </View>
    </Pressable>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    contactButton: {
      backgroundColor: theme.colors.surfaceContainerHighest,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      minHeight: 44, // Accessibility touch target
      borderWidth: 1,
      borderColor: theme.colors.outlineVariant,
    },
    contactButtonPressed: {
      backgroundColor: theme.colors.surfaceContainerHigh,
      transform: [{ scale: 0.98 }],
    },
    contactRowContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    contactText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurface,
      flex: 1,
      lineHeight: 20,
    },
  });

export default memo(ContactRow);
