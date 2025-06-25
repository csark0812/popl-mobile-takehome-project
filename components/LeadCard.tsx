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
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
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
  image,
}) => {
  const theme = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Use the press scale hook
  const { animatedStyle, handlePressIn, handlePressOut } = usePressScale({
    pressScale: 0.98,
    duration: 150,
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
      entering={FadeIn}
      exiting={FadeOut}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`Lead ${name}${title ? `, ${title}` : ''}${company ? `, from ${company}` : ''}, ${email}`}
      accessibilityHint="Tap to view lead details"
      style={[styles.card, animatedStyle]}
      mode="elevated"
      elevation={1}
    >
      <Card.Content style={styles.content}>
        {/* Avatar and Contact Actions Row */}
        <View style={styles.primarySection}>
          {typeof image === 'string' && image ? (
            <Avatar.Image
              size={56}
              source={{ uri: image }}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Text
              size={56}
              label={initials}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
          )}

          {/* Contact Actions */}
          <View style={styles.contactActions}>
            <IconButton
              icon="email"
              size={18}
              iconColor={theme.colors.primary}
              style={styles.contactIcon}
              onPress={handleEmailPress}
              accessibilityLabel={`Send email to ${name}`}
            />
            {phone && (
              <IconButton
                icon="phone"
                size={18}
                iconColor={theme.colors.primary}
                style={styles.contactIcon}
                onPress={handlePhonePress}
                accessibilityLabel={`Call ${name}`}
              />
            )}
          </View>
        </View>

        {/* Name, Title and Company Row */}
        <View style={styles.infoSection}>
          <Text
            style={[theme.fonts.titleLarge, styles.name]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {name}
          </Text>

          {title && (
            <Text
              style={[theme.fonts.bodyMedium, styles.title]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          )}

          {company && (
            <Text
              style={styles.companyText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {company}
            </Text>
          )}
        </View>

        {/* Tags Section */}
        {tags && tags.length > 0 && (
          <>
            <Divider style={styles.sectionDivider} />
            <View style={styles.tagsSection}>
              <Tags tags={tags} leadId={id} />
            </View>
          </>
        )}
      </Card.Content>
    </AnimatedCard>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginVertical: 6,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
    },
    content: {
      paddingVertical: 12,
    },
    primarySection: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    avatar: {
      backgroundColor: theme.colors.primary,
    },
    avatarLabel: {
      color: theme.colors.onPrimary,
      fontWeight: '600',
      fontSize: 20,
    },
    infoSection: {
      marginLeft: 4,
    },
    name: {
      color: theme.colors.onSurface,
      fontWeight: '600',
      lineHeight: 28,
      marginBottom: 4,
    },
    metaInfoRow: {
      marginLeft: 52, // Avatar size (40) + margin (12)
      marginTop: 4,
    },
    title: {
      color: theme.colors.onSurfaceVariant,
      lineHeight: 20,
      marginBottom: 4,
    },
    companyText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    sectionDivider: {
      marginVertical: 12,
      backgroundColor: theme.colors.outlineVariant,
      opacity: 0.8,
    },
    tagsSection: {
      marginBottom: 4,
    },
    contactActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    contactIcon: {
      backgroundColor: `${theme.colors.surfaceVariant}80`, // 50% transparency
      margin: 0,
    },
  });

export default memo(LeadCard);
