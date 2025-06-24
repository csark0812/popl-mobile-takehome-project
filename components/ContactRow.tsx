import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

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
      style={styles.contactButton}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${icon} ${label}`}
    >
      <View style={styles.contactRowContent}>
        <IconButton
          icon={icon}
          size={16}
          iconColor={theme.colors.onSurfaceVariant}
          style={styles.contactIcon}
        />
        <Text style={styles.contactText}>{label}</Text>
        <IconButton
          icon="chevron-right"
          size={16}
          iconColor={theme.colors.onSurfaceVariant}
          style={styles.chevronIcon}
        />
      </View>
    </Pressable>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    contactButton: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 8,
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    contactRowContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 32,
    },
    contactIcon: {
      margin: 0,
      marginRight: 4,
    },
    contactText: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      flex: 1,
    },
    chevronIcon: {
      margin: 0,
    },
  });

export default memo(ContactRow);
