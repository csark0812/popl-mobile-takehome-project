import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import ActionBarIcon from './ActionBarIcon';

export type ContactRowProps = {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
  onCopy?: () => void;
  accessibilityLabel?: string;
};

const ContactRow: React.FC<ContactRowProps> = ({
  icon,
  label,
  value,
  onPress,
  onCopy,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.contactButton}>
      <View style={styles.touchable}>
        <View style={styles.contactRowContent}>
          <Icon source={icon} size={18} color={theme.colors.primary} />
          <View style={styles.textContainer}>
            <Text
              style={styles.labelText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {label}
            </Text>
            <Text
              style={styles.valueText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {value}
            </Text>
          </View>
          {onCopy && (
            <ActionBarIcon
              icon="content-copy"
              size={16}
              onPress={onCopy}
              accessibilityLabel={`Copy ${label}`}
              style={styles.copyButton}
              type="light"
            />
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    contactButton: {
      borderRadius: 8,
      overflow: 'hidden' as const,
    },
    touchable: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      minHeight: 44, // Accessibility touch target
    },
    contactRowContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 12,
    },
    textContainer: {
      flex: 1,
    },
    labelText: {
      ...theme.fonts.labelSmall,
      fontWeight: '600',
      color: theme.colors.onSurfaceVariant,
      textTransform: 'uppercase',
      lineHeight: 16,
    },
    valueText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: theme.colors.onSurface,
      lineHeight: 20,
      marginTop: 2,
    },
    copyButton: {
      margin: 0,
    },
  });

export default memo(ContactRow);
