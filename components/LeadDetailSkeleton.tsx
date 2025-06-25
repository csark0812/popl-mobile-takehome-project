import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Surface, useTheme } from 'react-native-paper';
import SkeletonItem from './SkeletonItem';

const LeadDetailSkeleton: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        {/* Hero Section Skeleton */}
        <Surface style={styles.heroSection}>
          <View style={styles.header}>
            {/* Avatar */}
            <SkeletonItem width={72} height={72} borderRadius={36} />

            <View style={styles.heroInfo}>
              {/* Name */}
              <SkeletonItem width="80%" height={28} borderRadius={6} />
              <View style={styles.spacer} />

              {/* Temperature and Date Row */}
              <View style={styles.temperatureDateRow}>
                <SkeletonItem width={60} height={24} borderRadius={12} />
                <SkeletonItem width={120} height={16} borderRadius={4} />
              </View>
            </View>
          </View>

          <View style={styles.mediumSpacer} />

          {/* Company and Position */}
          <SkeletonItem width="90%" height={20} borderRadius={5} />
          <View style={styles.smallSpacer} />
          <SkeletonItem width="70%" height={16} borderRadius={4} />
        </Surface>

        {/* Action Buttons Skeleton */}
        <View style={styles.actionButtons}>
          <SkeletonItem width="30%" height={48} borderRadius={8} />
          <SkeletonItem width="30%" height={48} borderRadius={8} />
          <SkeletonItem width="30%" height={48} borderRadius={8} />
        </View>

        {/* About This Lead Section Skeleton */}
        <Card style={styles.card}>
          <Card.Content>
            {/* Section Title */}
            <SkeletonItem width={120} height={20} borderRadius={5} />
            <View style={styles.mediumSpacer} />

            {/* Tags */}
            <View style={styles.tagsContainer}>
              <SkeletonItem width={70} height={32} borderRadius={16} />
              <SkeletonItem width={90} height={32} borderRadius={16} />
              <SkeletonItem width={60} height={32} borderRadius={16} />
              <SkeletonItem width={40} height={32} borderRadius={16} />
            </View>

            <View style={styles.largeSpacer} />

            {/* Notes Section */}
            <SkeletonItem width={80} height={20} borderRadius={5} />
            <View style={styles.mediumSpacer} />
            <SkeletonItem width="100%" height={100} borderRadius={8} />
          </Card.Content>
        </Card>

        {/* Contact Information Section Skeleton */}
        <Card style={styles.card}>
          <Card.Content>
            {/* Section Title */}
            <SkeletonItem width={140} height={20} borderRadius={5} />
            <View style={styles.mediumSpacer} />

            {/* Phone Row */}
            <View style={styles.contactRow}>
              <SkeletonItem width={24} height={24} borderRadius={12} />
              <View style={styles.contactInfo}>
                <SkeletonItem width={80} height={16} borderRadius={4} />
                <View style={styles.smallSpacer} />
                <SkeletonItem width={150} height={20} borderRadius={5} />
              </View>
            </View>

            <View style={styles.mediumSpacer} />

            {/* Email Row */}
            <View style={styles.contactRow}>
              <SkeletonItem width={24} height={24} borderRadius={12} />
              <View style={styles.contactInfo}>
                <SkeletonItem width={60} height={16} borderRadius={4} />
                <View style={styles.smallSpacer} />
                <SkeletonItem width={200} height={20} borderRadius={5} />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Delete Button Skeleton */}
        <View style={styles.deleteButtonContainer}>
          <SkeletonItem width="100%" height={48} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
    },
    heroSection: {
      paddingVertical: 24,
      paddingHorizontal: 16,
      marginBottom: 24,
      borderRadius: 12,
      elevation: 0,
      backgroundColor: theme.colors.surface,
    },
    header: {
      flexDirection: 'row',
    },
    heroInfo: {
      flex: 1,
      marginLeft: 20,
      justifyContent: 'center',
    },
    temperatureDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    actionButtons: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 24,
      gap: 12,
    },
    card: {
      marginBottom: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    contactInfo: {
      flex: 1,
    },
    deleteButtonContainer: {
      marginBottom: 16,
    },
    spacer: {
      height: 8,
    },
    smallSpacer: {
      height: 4,
    },
    mediumSpacer: {
      height: 12,
    },
    largeSpacer: {
      height: 20,
    },
  });

export default LeadDetailSkeleton;
