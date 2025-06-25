import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface SkeletonItemProps {
  width: number | string;
  height: number;
  borderRadius?: number;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({
  width,
  height,
  borderRadius = 12,
}) => {
  const theme = useTheme();

  const styles = createStyles(theme);

  return (
    <View
      style={[
        styles.skeletonBase,
        { width: width as any, height, borderRadius },
      ]}
    />
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    skeletonBase: {
      backgroundColor: theme.colors.surfaceVariant,
    },
  });

export default SkeletonItem;
