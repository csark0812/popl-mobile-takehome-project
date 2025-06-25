import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import SkeletonItem from './SkeletonItem';

const LeadCardSkeleton: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card style={styles.card} mode="elevated" elevation={1}>
      <Card.Content style={styles.content}>
        {/* Avatar and Contact Actions Row */}
        <View style={styles.primarySection}>
          <SkeletonItem width={56} height={56} borderRadius={28} />
          <View style={styles.contactActions}>
            <SkeletonItem width={36} height={36} borderRadius={18} />
            <SkeletonItem width={36} height={36} borderRadius={18} />
          </View>
        </View>
        {/* Name, Title and Company Row */}
        <View style={styles.infoSection}>
          <SkeletonItem width="70%" height={24} borderRadius={6} />
          <View style={styles.spacer} />
          <SkeletonItem width="90%" height={16} borderRadius={4} />
          <View style={styles.smallSpacer} />
          <SkeletonItem width="60%" height={16} borderRadius={4} />
        </View>
        {/* Tags Section */}
        <View style={styles.sectionDivider} />
        <View style={styles.tagsSection}>
          <View style={styles.tagsRow}>
            <SkeletonItem width={60} height={24} borderRadius={12} />
            <SkeletonItem width={80} height={24} borderRadius={12} />
            <SkeletonItem width={50} height={24} borderRadius={12} />
          </View>
        </View>
      </Card.Content>
    </Card>
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
    contactActions: {
      flexDirection: 'row',
      gap: 8,
    },
    infoSection: {
      marginLeft: 4,
    },
    spacer: {
      height: 8,
    },
    smallSpacer: {
      height: 4,
    },
    sectionDivider: {
      height: 16,
    },
    tagsSection: {
      marginTop: 8,
    },
    tagsRow: {
      flexDirection: 'row',
      gap: 8,
    },
  });

export default LeadCardSkeleton;
