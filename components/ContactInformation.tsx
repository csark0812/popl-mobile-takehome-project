import ContactRow from '@components/ContactRow';
import LeadDetailCard from '@components/LeadDetailCard';
import { Lead } from '@types';
import React, { useCallback } from 'react';
import { Alert, Clipboard, Linking, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

type ContactInformationProps = {
  lead: Lead;
};

const ContactInformation: React.FC<ContactInformationProps> = ({ lead }) => {
  const theme = useTheme();

  const hasContactInfo = lead.email || lead.phone;

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

  const handleEditPress = useCallback(() => {
    // TODO: Navigate to edit lead screen
    Alert.alert('Edit Contact', 'Navigate to edit lead functionality');
  }, []);

  return (
    <LeadDetailCard title="Contact Information">
      {hasContactInfo ? (
        <View style={styles.contactContainer}>
          {lead.email && (
            <ContactRow
              icon="email"
              label="Email"
              value={lead.email}
              onPress={handleEmailPress}
              onCopy={handleCopyEmail}
              accessibilityLabel={`Email ${lead.email}, tap to send email`}
            />
          )}
          {lead.email && lead.phone && (
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            />
          )}
          {lead.phone && (
            <ContactRow
              icon="phone"
              label="Phone"
              value={lead.phone}
              onPress={handlePhonePress}
              onCopy={handleCopyPhone}
              accessibilityLabel={`Phone ${lead.phone}, tap to call`}
            />
          )}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text
            variant="bodyMedium"
            style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
          >
            No contact information available
          </Text>
          <Button
            mode="outlined"
            onPress={handleEditPress}
            style={styles.editButton}
            contentStyle={styles.editButtonContent}
          >
            Edit Contact Info
          </Button>
        </View>
      )}
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
  },
  editButton: {
    marginTop: 4,
  },
  editButtonContent: {
    paddingHorizontal: 8,
  },
});

export default ContactInformation;
