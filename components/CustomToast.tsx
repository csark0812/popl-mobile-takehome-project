import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconButton, MD3Theme, useTheme } from 'react-native-paper';
import { BaseToastProps } from 'react-native-toast-message';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const CustomToast = {
  success: ({ text1, text2 }: CustomToastProps) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
      <View style={[styles.container, styles.successContainer]}>
        <IconButton
          icon="check-circle"
          size={20}
          iconColor={theme.colors.primary}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          {text1 && (
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    );
  },

  error: ({ text1, text2 }: CustomToastProps) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
      <View style={[styles.container, styles.errorContainer]}>
        <IconButton
          icon="alert-circle"
          size={20}
          iconColor={theme.colors.error}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          {text1 && (
            <Text style={[styles.title, { color: theme.colors.error }]}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    );
  },

  notify: ({ text1, text2 }: CustomToastProps) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
      <View style={[styles.container, styles.notifyContainer]}>
        <IconButton
          icon="information"
          size={20}
          iconColor={theme.colors.secondary}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          {text1 && (
            <Text style={[styles.title, { color: theme.colors.secondary }]}>
              {text1}
            </Text>
          )}
          {text2 && (
            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
              {text2}
            </Text>
          )}
        </View>
      </View>
    );
  },
};

const createStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '90%',
      minHeight: 60,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: theme.roundness,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginHorizontal: '5%',
    },
    successContainer: {
      backgroundColor: theme.colors.surface,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    errorContainer: {
      backgroundColor: theme.colors.surface,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error,
    },
    notifyContainer: {
      backgroundColor: theme.colors.surface,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.secondary,
    },
    icon: {
      margin: 0,
      marginRight: 8,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 12,
      opacity: 0.7,
    },
  });

export default CustomToast;
