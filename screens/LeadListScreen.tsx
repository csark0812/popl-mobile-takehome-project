import ActionBarIcon from '@components/ActionBarIcon';
import { FilterState } from '@components/FilterPopover';
import LeadCard from '@components/LeadCard';
import LeadCardSkeleton from '@components/LeadCardSkeleton';
import ScrollHeader from '@components/ScrollHeader';
import SearchAndFilters, {
  SearchAndFiltersRef,
} from '@components/SearchAndFilters';
import SettingsPopover, {
  SettingsPopoverRef,
} from '@components/SettingsPopover';
import StickyHeader from '@components/StickyHeader';
import { useLeads } from '@hooks/api';
import { useDebounce } from '@hooks/useDebounce';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigationPageContext } from 'context/NavigationPageContext';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FAB, List, useTheme } from 'react-native-paper';
import Animated, {
  FadeInDown,
  FadeOutUp,
  LinearTransition,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadList'>;

export default function LeadListScreen({ navigation }: Props) {
  const { data: leads, isLoading, isError, refetch, isRefetching } = useLeads();
  const theme = useTheme();

  const settingsPopoverRef = useRef<SettingsPopoverRef>(null);
  const searchAndFiltersRef = useRef<SearchAndFiltersRef>(null);
  const { stickyHeaderHeight } = useNavigationPageContext();
  // Search and filter state
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<FilterState>({ sortBy: 'name' });
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Debounce search value to improve performance
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const { bottom } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Focus search input when search becomes active
  useEffect(() => {
    if (isSearchActive) {
      // Use a small delay to ensure the component is rendered
      setTimeout(() => {
        searchAndFiltersRef.current?.focus();
      }, 100);
    }
  }, [isSearchActive]);

  // Filter and sort leads based on search and filters
  const filteredAndSortedLeads = useMemo(() => {
    if (!leads) return [];

    let filtered = leads;

    // Apply search filter
    if (debouncedSearchValue.trim()) {
      const searchLower = debouncedSearchValue.toLowerCase().trim();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
          (lead.title && lead.title.toLowerCase().includes(searchLower)) ||
          (lead.tags &&
            lead.tags.some((tag) => tag.toLowerCase().includes(searchLower))),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'createdAt') {
        // Sort by createdAt, fallback to name if createdAt is not available
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Most recent first
      }
      return 0;
    });

    return filtered;
  }, [leads, debouncedSearchValue, filters]);

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollHeader
          scrollY={scrollY}
          renderRight={() => (
            <ActionBarIcon
              icon="cog"
              onPress={() => settingsPopoverRef.current?.show()}
              accessibilityLabel="Settings"
              type="light"
            />
          )}
        />
        <View style={{ paddingTop: 20 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <LeadCardSkeleton key={`skeleton-${index}`} />
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollHeader
          scrollY={scrollY}
          renderRight={() => (
            <ActionBarIcon
              icon="cog"
              onPress={() => settingsPopoverRef.current?.show()}
              accessibilityLabel="Settings"
              type="light"
            />
          )}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <List.Item
            title="Error loading leads"
            description="Unable to load your leads. Please check your connection and try again."
            titleStyle={{ textAlign: 'center' }}
            descriptionStyle={{ textAlign: 'center' }}
          />
          <FAB
            icon="refresh"
            onPress={() => refetch()}
            style={{ marginTop: 16 }}
            label="Try Again"
          />
        </View>
        <SettingsPopover ref={settingsPopoverRef} />
      </View>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollHeader
          scrollY={scrollY}
          renderRight={() => (
            <ActionBarIcon
              icon="cog"
              onPress={() => settingsPopoverRef.current?.show()}
              accessibilityLabel="Settings"
              type="light"
            />
          )}
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <List.Item
            title="No leads yet"
            description="Get started by creating your first lead to begin tracking your sales opportunities."
            titleStyle={{ textAlign: 'center' }}
            descriptionStyle={{ textAlign: 'center' }}
          />
          <FAB
            icon="plus"
            onPress={() => navigation.navigate('NewLead')}
            style={{
              marginTop: 16,
            }}
            label="Create Lead"
          />
        </View>
        <SettingsPopover ref={settingsPopoverRef} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StickyHeader
        alwaysShow={isSearchActive}
        scrollY={scrollY}
        style={isSearchActive ? { display: 'none' } : undefined}
        renderRight={() => (
          <View style={styles.headerActions}>
            <ActionBarIcon
              icon="magnify"
              onPress={() => setIsSearchActive(true)}
              accessibilityLabel="Search"
              type="dark"
            />
            <ActionBarIcon
              icon="cog"
              onPress={() => settingsPopoverRef.current?.show()}
              accessibilityLabel="Settings"
              type="dark"
            />
          </View>
        )}
      >
        {isSearchActive && (
          <Animated.View
            entering={FadeInDown.duration(300).springify()}
            exiting={FadeOutUp.duration(200)}
            style={{
              flex: 1,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.15,
              shadowRadius: 2,
              margin: 8,
            }}
          >
            <SearchAndFilters
              showBlurButton={true}
              ref={searchAndFiltersRef}
              searchValue={searchValue}
              onSearchChangeText={setSearchValue}
              filters={filters}
              onFiltersChange={setFilters}
              onClearIconPress={() => {
                setIsSearchActive(false);
              }}
              onBlur={() => {
                if (!searchValue.trim()) {
                  setIsSearchActive(false);
                }
              }}
            />
          </Animated.View>
        )}
      </StickyHeader>
      <Animated.FlatList
        renderScrollComponent={(props) => (
          <KeyboardAwareScrollView
            {...props}
            contentContainerStyle={[
              { paddingBottom: bottom },
              props.contentContainerStyle,
            ]}
          />
        )}
        data={filteredAndSortedLeads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <LeadCard {...item} />}
        itemLayoutAnimation={LinearTransition.springify()
          .damping(80)
          .stiffness(200)}
        ListEmptyComponent={
          <View
            style={{
              paddingVertical: 48,
              paddingHorizontal: 24,
              alignItems: 'center',
            }}
          >
            <List.Item
              title="No leads found"
              description={
                debouncedSearchValue.trim()
                  ? `No leads match "${debouncedSearchValue.trim()}"`
                  : 'No leads match your current filters'
              }
              titleStyle={{ textAlign: 'center' }}
              descriptionStyle={{ textAlign: 'center' }}
            />
          </View>
        }
        ListHeaderComponent={
          !isSearchActive ? (
            <ScrollHeader
              scrollY={scrollY}
              renderRight={() => (
                <ActionBarIcon
                  icon="cog"
                  onPress={() => settingsPopoverRef.current?.show()}
                  accessibilityLabel="Settings"
                  type="light"
                />
              )}
            >
              <View
                style={{
                  flex: 1,
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                  paddingBottom: 8,
                }}
              >
                <SearchAndFilters
                  searchValue={searchValue}
                  onFocus={() => setIsSearchActive(true)}
                  onSearchChangeText={setSearchValue}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </View>
            </ScrollHeader>
          ) : (
            <Animated.View style={{ height: stickyHeaderHeight }} />
          )
        }
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={theme.colors.onBackground}
            colors={[theme.colors.primary]}
          />
        }
      />

      <FAB
        icon="plus"
        onPress={() => navigation.navigate('NewLead')}
        style={{ position: 'absolute', right: 24, bottom: 40 }}
      />

      <SettingsPopover ref={settingsPopoverRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
});
