import { useSessionStore } from '@hooks/sessionStore';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Vibration, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import Popover, { PopoverRef } from './Popover';

interface SettingsPopoverProps {}

export interface SettingsPopoverRef {
  show: () => void;
  hide: () => void;
}

const themeIcons = {
  light: 'white-balance-sunny', // sun
  dark: 'weather-night', // moon
  device: 'cellphone', // phone
};

const themeLabels = {
  light: 'Light Theme',
  dark: 'Dark Theme',
  device: 'Device Theme',
};

const SettingsPopover = forwardRef<SettingsPopoverRef, SettingsPopoverProps>(
  (_, ref) => {
    const theme = useTheme();
    const currentTheme = useSessionStore((s) => s.theme);
    const setTheme = useSessionStore((s) => s.setTheme);
    const signOut = useSessionStore((s) => s.signOut);

    const popoverRef = useRef<PopoverRef>(null);

    const handleDismiss = () => {
      // Nothing to reset for settings
    };

    useImperativeHandle(ref, () => ({
      show: () => {
        popoverRef.current?.show();
      },
      hide: () => {
        popoverRef.current?.hide();
      },
    }));

    const handleThemeChange = () => {
      Vibration.vibrate(40);
      if (currentTheme === 'light') setTheme('dark');
      else if (currentTheme === 'dark') setTheme('device');
      else setTheme('light');
    };

    const handleLogout = () => {
      Vibration.vibrate(50);
      signOut();
      popoverRef.current?.hide();
    };

    return (
      <Popover ref={popoverRef} onDismiss={handleDismiss}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Settings
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Manage your preferences
            </Text>
          </View>
          <IconButton
            icon="close"
            size={20}
            onPress={() => popoverRef.current?.hide()}
            style={styles.closeButton}
          />
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleThemeChange}
            style={[
              styles.settingsItem,
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <View style={styles.settingsItemContent}>
              <IconButton
                icon={themeIcons[currentTheme]}
                size={24}
                style={styles.settingsIcon}
              />
              <View style={styles.settingsText}>
                <Text
                  style={[
                    styles.settingsItemTitle,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  Change Theme
                </Text>
                <Text
                  style={[
                    styles.settingsItemSubtitle,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {themeLabels[currentTheme]}
                </Text>
              </View>
              <IconButton
                icon="chevron-right"
                size={20}
                style={styles.chevronIcon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={[
              styles.settingsItem,
              {
                backgroundColor: theme.colors.errorContainer,
                borderColor: theme.colors.error,
              },
            ]}
          >
            <View style={styles.settingsItemContent}>
              <IconButton
                icon="logout"
                size={24}
                style={styles.settingsIcon}
                iconColor={theme.colors.error}
              />
              <View style={styles.settingsText}>
                <Text
                  style={[
                    styles.settingsItemTitle,
                    { color: theme.colors.error },
                  ]}
                >
                  Sign Out
                </Text>
                <Text
                  style={[
                    styles.settingsItemSubtitle,
                    { color: theme.colors.onErrorContainer },
                  ]}
                >
                  Log out of your account
                </Text>
              </View>
              <IconButton
                icon="chevron-right"
                size={20}
                style={styles.chevronIcon}
                iconColor={theme.colors.error}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Popover>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  closeButton: {
    margin: 0,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingsItem: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  settingsIcon: {
    margin: 0,
  },
  settingsText: {
    flex: 1,
    paddingLeft: 8,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  chevronIcon: {
    margin: 0,
  },
});

SettingsPopover.displayName = 'SettingsPopover';

export default SettingsPopover;
