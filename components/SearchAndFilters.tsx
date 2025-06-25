import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { IconButton, Searchbar, useTheme } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import FilterPopover, { FilterPopoverRef, FilterState } from './FilterPopover';

interface SearchAndFiltersProps {
  searchValue: string;
  onSearchChangeText: (text: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClearIconPress?: () => void;
}

export interface SearchAndFiltersRef {
  focus: () => void;
}

const SearchAndFilters = forwardRef<SearchAndFiltersRef, SearchAndFiltersProps>(
  (
    {
      searchValue,
      onSearchChangeText,
      filters,
      onFiltersChange,
      onFocus,
      onBlur,
      onClearIconPress,
    },
    ref,
  ) => {
    const theme = useTheme();
    const filterPopoverRef = useRef<FilterPopoverRef>(null);
    const searchbarRef = useRef<any>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [shouldRefocusAfterFilter, setShouldRefocusAfterFilter] =
      useState(false);
    const isProgrammaticFocusChange = useRef(false);

    useImperativeHandle(ref, () => ({
      focus: () => {
        searchbarRef.current?.focus();
      },
    }));

    const handleFocus = () => {
      setIsFocused(true);
      if (!isProgrammaticFocusChange.current) {
        onFocus?.();
      }
      isProgrammaticFocusChange.current = false;
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (!isProgrammaticFocusChange.current) {
        onBlur?.();
      }
      isProgrammaticFocusChange.current = false;
    };

    const handleFilterPress = () => {
      if (isFocused) {
        Keyboard.dismiss();
        isProgrammaticFocusChange.current = true;
        setShouldRefocusAfterFilter(true);
      } else {
        setShouldRefocusAfterFilter(false);
      }
      filterPopoverRef.current?.show();
    };

    const handleFilterDismiss = () => {
      if (shouldRefocusAfterFilter) {
        setTimeout(() => {
          isProgrammaticFocusChange.current = true;
          searchbarRef.current?.focus();
        }, 100);
        setShouldRefocusAfterFilter(false);
      }
    };

    const styles = createStyles(theme);

    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.container}
      >
        <View style={styles.searchContainer}>
          <Searchbar
            ref={searchbarRef}
            placeholder="Search leads..."
            onChangeText={onSearchChangeText}
            value={searchValue}
            style={styles.searchbar}
            inputStyle={styles.searchInput}
            iconColor={theme.colors.onSurfaceVariant}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClearIconPress={onClearIconPress}
          />
          <IconButton
            icon="tune"
            size={24}
            iconColor={theme.colors.onSurfaceVariant}
            style={styles.filterButton}
            onPress={handleFilterPress}
            accessibilityLabel="Open filters"
            accessibilityHint="Tap to change sorting options"
          />
        </View>

        <FilterPopover
          ref={filterPopoverRef}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onDismiss={handleFilterDismiss}
        />
      </Animated.View>
    );
  },
);

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    searchbar: {
      flex: 1,
      elevation: 0,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 28,
    },
    searchInput: {
      color: theme.colors.onSurface,
      minHeight: 30,
    },
    filterButton: {
      backgroundColor: theme.colors.surfaceVariant,
      margin: 0,
    },
  });

export default SearchAndFilters;
