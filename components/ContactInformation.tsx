import ContactRow from '@components/ContactRow';
import LeadDetailCard from '@components/LeadDetailCard';
import { Lead } from '@types';
import React, { useCallback } from 'react';
import { Alert, Clipboard, Linking, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

type ContactInformationProps = {
  lead: Lead;
};

const ContactInformation: React.FC<ContactInformationProps> = ({ lead }) => {
  const theme = useTheme();

  const handleEmailPress = useCallback(() => {
    if (lead.email) {
      Linking.openURL(`mailto:${lead.email}`);
    }
  }, [lead.email]);

  const handlePhonePress = useCallback(() => {
    if (lead.phone) {
      const phoneNumber = lead.phone.replace(/[^\d+]/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, [lead.phone]);

  const handleCopyEmail = useCallback(() => {
    if (lead.email) {
      Clipboard.setString(lead.email);
      Alert.alert('Copied', 'Email address copied to clipboard');
    }
  }, [lead.email]);

  const handleCopyPhone = useCallback(() => {
    if (lead.phone) {
      Clipboard.setString(lead.phone);
      Alert.alert('Copied', 'Phone number copied to clipboard');
    }
  }, [lead.phone]);

  return (
    <LeadDetailCard title="Contact Information">
      <View style={styles.contactContainer}>
        <ContactRow
          icon="email"
          label="Email"
          value={lead.email}
          onPress={handleEmailPress}
          onCopy={handleCopyEmail}
          accessibilityLabel={`Email ${lead.email}, tap to send email`}
        />
        {lead.phone && (
          <>
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            />
            <ContactRow
              icon="phone"
              label="Phone"
              value={lead.phone}
              onPress={handlePhonePress}
              onCopy={handleCopyPhone}
              accessibilityLabel={`Phone ${lead.phone}, tap to call`}
            />
          </>
        )}
      </View>
    </LeadDetailCard>
  );
};

const styles = StyleSheet.create({
  contactContainer: {
    gap: 0,
  },
  divider: {
    height: 1,
    marginVertical: 8,
    opacity: 0.5,
  },
});

export default ContactInformation;
