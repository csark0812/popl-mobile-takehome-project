import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, List, Text, useTheme } from 'react-native-paper';
import Popover, { PopoverRef } from './Popover';

export type SortOrder = 'name' | 'createdAt';

export interface FilterState {
  sortBy: SortOrder;
}

interface FilterPopoverProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onDismiss?: () => void;
}

export interface FilterPopoverRef {
  show: () => void;
  hide: () => void;
}

const FilterPopover = forwardRef<FilterPopoverRef, FilterPopoverProps>(
  ({ filters, onFiltersChange, onDismiss }, ref) => {
    const theme = useTheme();
    const popoverRef = useRef<PopoverRef>(null);

    useImperativeHandle(ref, () => ({
      show: () => {
        popoverRef.current?.show();
      },
      hide: () => {
        popoverRef.current?.hide();
      },
    }));

    const handleSortChange = (sortBy: SortOrder) => {
      onFiltersChange({ ...filters, sortBy });
      popoverRef.current?.hide();
    };

    const styles = createStyles(theme);

    return (
      <Popover ref={popoverRef} maxWidth={320} onDismiss={onDismiss}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[theme.fonts.titleMedium, styles.title]}>
              Sort Leads
            </Text>
            <Text style={[theme.fonts.bodySmall, styles.subtitle]}>
              Choose how to order your leads
            </Text>
          </View>
          <IconButton
            icon="close"
            size={20}
            onPress={() => popoverRef.current?.hide()}
            style={styles.closeButton}
          />
        </View>

        {/* Sort Options */}
        <View style={styles.section}>
          <List.Item
            title="Name (A-Z)"
            description="Sort alphabetically by lead name"
            left={(props) => (
              <List.Icon {...props} icon="sort-alphabetical-ascending" />
            )}
            right={(props) =>
              filters.sortBy === 'name' ? (
                <List.Icon
                  {...props}
                  icon="check"
                  color={theme.colors.primary}
                />
              ) : null
            }
            onPress={() => handleSortChange('name')}
            style={styles.listItem}
          />
          <List.Item
            title="Date Created"
            description="Sort by when the lead was added"
            left={(props) => <List.Icon {...props} icon="calendar" />}
            right={(props) =>
              filters.sortBy === 'createdAt' ? (
                <List.Icon
                  {...props}
                  icon="check"
                  color={theme.colors.primary}
                />
              ) : null
            }
            onPress={() => handleSortChange('createdAt')}
            style={styles.listItem}
          />
        </View>
      </Popover>
    );
  },
);

const createStyles = (theme: any) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    headerLeft: {
      flex: 1,
      marginRight: 10,
    },
    title: {
      color: theme.colors.onSurface,
      marginBottom: 5,
    },
    subtitle: {
      color: theme.colors.onSurfaceVariant,
    },
    closeButton: {
      margin: 0,
    },
    section: {
      paddingVertical: 10,
    },
    listItem: {
      paddingHorizontal: 18,
      paddingVertical: 7,
    },
  });

FilterPopover.displayName = 'FilterPopover';

export default FilterPopover;
