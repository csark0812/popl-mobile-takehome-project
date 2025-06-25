import * as MailComposer from 'expo-mail-composer';
import * as SMS from 'expo-sms';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * Initiates a phone call to the specified phone number
 * @param phoneNumber - The phone number to call
 */
export const callPhoneNumber = async (phoneNumber: string): Promise<void> => {
  if (!phoneNumber) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'No phone number provided',
    });
    return;
  }

  try {
    await Linking.openURL(`tel:${phoneNumber}`);
    Toast.show({
      type: 'success',
      text1: 'Calling',
      text2: `Initiating call to ${phoneNumber}`,
    });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Unable to make phone call',
    });
  }
};

/**
 * Opens SMS app to send a text message to the specified phone number
 * @param phoneNumber - The phone number to text
 * @param message - Optional initial message text
 */
export const sendText = async (
  phoneNumber: string,
  message?: string,
): Promise<void> => {
  if (!phoneNumber) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'No phone number provided',
    });
    return;
  }

  try {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync([phoneNumber], message || '');
      Toast.show({
        type: 'success',
        text1: 'Message Ready',
        text2: 'SMS composer opened successfully',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'SMS is not available on this device',
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Unable to send text message',
    });
  }
};

/**
 * Opens email composer to send an email to the specified email address
 * @param email - The email address to send to
 * @param subject - Optional email subject
 * @param body - Optional email body
 */
export const composeEmail = async (
  email: string,
  subject?: string,
  body?: string,
): Promise<void> => {
  if (!email) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'No email address provided',
    });
    return;
  }

  try {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: [email],
        subject: subject || '',
        body: body || '',
      });
      Toast.show({
        type: 'success',
        text1: 'Email Ready',
        text2: 'Email composer opened successfully',
      });
    } else {
      // Fallback to native mailto link
      await Linking.openURL(`mailto:${email}`);
      Toast.show({
        type: 'notify',
        text1: 'Email Opened',
        text2: 'Using default email client',
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Unable to send email',
    });
  }
};
