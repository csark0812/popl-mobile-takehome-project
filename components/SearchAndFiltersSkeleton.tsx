import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import SkeletonItem from './SkeletonItem';

const SearchAndFiltersSkeleton: React.FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {/* Search bar skeleton */}
        <View style={styles.searchbar}>
          <SkeletonItem width="100%" height={56} borderRadius={28} />
        </View>

        {/* Filter button skeleton */}
        <SkeletonItem width={40} height={40} borderRadius={20} />
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    searchbar: {
      flex: 1,
    },
  });

export default SearchAndFiltersSkeleton;
