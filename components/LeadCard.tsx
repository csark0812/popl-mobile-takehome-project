import { usePressScale } from '@hooks/usePressScale';
import { RootStackParamList } from '@navigation/index';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Lead } from '@types';
import React, { memo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import {
  Avatar,
  Card,
  Divider,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import ContactRow from './ContactRow';
import Tags from './Tags';

export type LeadCardProps = Lead;

const AnimatedCard = Animated.createAnimatedComponent(Card);

const LeadCard: React.FC<LeadCardProps> = ({
  id,
  name,
  email,
  company,
  title,
  phone,
  tags,
}) => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Use the press scale hook
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale({
    pressScale: 0.97,
    duration: 100,
  });

  // Generate avatar initials
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle card press
  const handlePress = () => {
    navigation.navigate('LeadDetail', { leadId: id });
  };

  // Handle email action
  const handleEmailPress = () => {
    Linking.openURL(`mailto:${email}`);
  };

  // Handle phone action
  const handlePhonePress = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const initials = getInitials(name);
  const styles = createStyles(theme);

  return (
    <AnimatedCard
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Lead ${name}${title ? `, ${title}` : ''}${company ? `, from ${company}` : ''}, ${email}`}
      accessibilityHint="Tap to view lead details"
      style={[styles.card, animatedStyle]}
      mode="elevated"
    >
      {/* Header with Avatar, Name, Title, Company, and Actions */}
      <View style={styles.header}>
        <View style={styles.leadInfo}>
          <Avatar.Text
            size={56}
            label={initials}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />

          <View style={styles.nameCompanySection}>
            <Text
              style={[theme.fonts.titleLarge, styles.name]}
              numberOfLines={1}
            >
              {name}
            </Text>

            {title && (
              <Text
                style={[theme.fonts.bodyMedium, styles.title]}
                numberOfLines={1}
              >
                {title}
              </Text>
            )}

            {company && (
              <View style={styles.companyBadge}>
                <Text
                  style={[theme.fonts.labelMedium, styles.companyText]}
                  numberOfLines={1}
                >
                  {company}
                </Text>
              </View>
            )}
          </View>
        </View>

        <IconButton
          icon="chevron-right"
          size={20}
          iconColor={theme.colors.onSurfaceVariant}
          style={styles.chevron}
        />
      </View>

      {/* Tags Section */}
      <Tags tags={tags || []} leadId={id} />

      {/* Divider for visual separation */}
      <Divider style={styles.divider} />

      {/* Contact Information */}
      <View style={styles.contactSection}>
        <ContactRow
          icon="email"
          label={email}
          onPress={handleEmailPress}
          accessibilityLabel={`Send email to ${name}`}
        />

        {phone && (
          <ContactRow
            icon="phone"
            label={phone}
            onPress={handlePhonePress}
            accessibilityLabel={`Call ${name}`}
          />
        )}
      </View>
    </AnimatedCard>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 20,
      marginVertical: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      elevation: 3,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 24,
      paddingHorizontal: 24,
      paddingBottom: 16,
    },
    leadInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    avatar: {
      backgroundColor: theme.colors.primary,
      marginRight: 16,
    },
    avatarLabel: {
      color: 'white',
      fontWeight: '700',
      fontSize: 20,
    },
    nameCompanySection: {
      flex: 1,
      justifyContent: 'center',
    },
    name: {
      color: theme.colors.onSurface,
      fontWeight: '600',
      marginBottom: 2,
      lineHeight: 28,
    },
    title: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: 4,
      lineHeight: 20,
    },
    companyBadge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.colors.secondaryContainer,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    companyText: {
      color: theme.colors.onSecondaryContainer,
      fontWeight: '500',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    chevron: {
      margin: 0,
    },
    divider: {
      marginHorizontal: 24,
      marginVertical: 12,
      backgroundColor: theme.colors.outline,
      opacity: 0.3,
    },
    contactSection: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      gap: 8,
    },
  });

export default memo(LeadCard);
