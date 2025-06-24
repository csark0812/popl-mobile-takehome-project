import { usePressScale } from '@hooks/usePressScale';
import { Lead } from '@types';
import * as MailComposer from 'expo-mail-composer';
import * as SMS from 'expo-sms';
import React from 'react';
import { Alert, Linking, StyleSheet, View } from 'react-native';
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

    try {
      await Linking.openURL(`tel:${lead.phone}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to make phone call');
    }
  };

  const handleText = async () => {
    if (!lead.phone) return;

    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync([lead.phone], `Hi ${lead.name}, `);
      } else {
        Alert.alert('Error', 'SMS is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to send text message');
    }
  };

  const handleEmail = async () => {
    if (!lead.email) return;

    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (isAvailable) {
        await MailComposer.composeAsync({
          recipients: [lead.email],
          subject: `Following up - ${lead.name}`,
          body: `Hi ${lead.name},\n\n`,
        });
      } else {
        // Fallback to native mailto link
        await Linking.openURL(`mailto:${lead.email}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to send email');
    }
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
        labelStyle={{ color: 'white' }}
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
        labelStyle={{ color: 'white' }}
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
        labelStyle={{ color: 'white' }}
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
  },
  buttonContent: {
    paddingVertical: 12,
  },
});
