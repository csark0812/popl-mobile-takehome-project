import { usePressScale } from '@hooks/usePressScale';
import { Lead } from '@types';
import { callPhoneNumber, composeEmail, sendText } from '@utils/contact';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import Animated from 'react-native-reanimated';

interface ActionButtonsProps {
  lead: Lead;
  style?: any;
}

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function ActionButtons({ lead, style }: ActionButtonsProps) {
  const theme = useTheme();

  // Press scale animations for each button
  const {
    animatedStyle: callAnimatedStyle,
    handlePressIn: callPressIn,
    handlePressOut: callPressOut,
  } = usePressScale({
    pressScale: 0.95,
    duration: 150,
  });

  const {
    animatedStyle: textAnimatedStyle,
    handlePressIn: textPressIn,
    handlePressOut: textPressOut,
  } = usePressScale({
    pressScale: 0.95,
    duration: 150,
  });

  const {
    animatedStyle: emailAnimatedStyle,
    handlePressIn: emailPressIn,
    handlePressOut: emailPressOut,
  } = usePressScale({
    pressScale: 0.95,
    duration: 150,
  });

  const handleCall = async () => {
    if (!lead.phone) return;
    await callPhoneNumber(lead.phone);
  };

  const handleText = async () => {
    if (!lead.phone) return;
    await sendText(lead.phone, `Hi ${lead.name}, `);
  };

  const handleEmail = async () => {
    if (!lead.email) return;
    await composeEmail(
      lead.email,
      `Following up - ${lead.name}`,
      `Hi ${lead.name},\n\n`,
    );
  };

  // Only render buttons for available contact methods
  const availableActions = [];

  if (lead.phone) {
    availableActions.push(
      <AnimatedButton
        key="call"
        mode="contained"
        icon="phone"
        onPress={handleCall}
        onPressIn={callPressIn}
        onPressOut={callPressOut}
        style={[
          styles.actionButton,
          callAnimatedStyle,
          { backgroundColor: theme.colors.primary },
        ]}
        labelStyle={[styles.buttonLabel, { color: theme.colors.onPrimary }]}
        contentStyle={styles.buttonContent}
        accessibilityLabel={`Call ${lead.name}`}
        accessibilityHint="Opens phone app to call this lead"
      >
        Call
      </AnimatedButton>,
    );

    availableActions.push(
      <AnimatedButton
        key="text"
        mode="contained"
        icon="message"
        onPress={handleText}
        onPressIn={textPressIn}
        onPressOut={textPressOut}
        style={[
          styles.actionButton,
          textAnimatedStyle,
          { backgroundColor: theme.colors.secondary },
        ]}
        labelStyle={[styles.buttonLabel, { color: theme.colors.onSecondary }]}
        contentStyle={styles.buttonContent}
        accessibilityLabel={`Text ${lead.name}`}
        accessibilityHint="Opens SMS app to send text message to this lead"
      >
        Text
      </AnimatedButton>,
    );
  }

  if (lead.email) {
    availableActions.push(
      <AnimatedButton
        key="email"
        mode="contained"
        icon="email"
        onPress={handleEmail}
        onPressIn={emailPressIn}
        onPressOut={emailPressOut}
        style={[
          styles.actionButton,
          emailAnimatedStyle,
          { backgroundColor: theme.colors.tertiary },
        ]}
        labelStyle={[styles.buttonLabel, { color: theme.colors.onTertiary }]}
        contentStyle={styles.buttonContent}
        accessibilityLabel={`Email ${lead.name}`}
        accessibilityHint="Opens email app to send email to this lead"
      >
        Email
      </AnimatedButton>,
    );
  }

  // Don't render anything if no contact methods are available
  if (availableActions.length === 0) {
    return null;
  }

  return <View style={[styles.actionButtons, style]}>{availableActions}</View>;
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    // Shadow for Android
    elevation: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
