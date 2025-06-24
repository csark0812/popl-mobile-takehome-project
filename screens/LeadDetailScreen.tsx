import ActionButtons from '@components/ActionButtons';
import DetailsHeroSection from '@components/DetailsHeroSection';
import DetailTagsSection from '@components/DetailTagsSection';
import ScrollHeader from '@components/ScrollHeader';
import StickyHeader from '@components/StickyHeader';
import { useLead } from '@hooks/api';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  FAB,
  IconButton,
  List,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadDetail'>;

const { width } = Dimensions.get('window');
const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function LeadDetailScreen({ route, navigation }: Props) {
  const { leadId } = route.params;
  const { data: lead, isLoading, isError, refetch } = useLead(leadId);
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const scrollY = useSharedValue(0);

  // Quick actions handlers
  const handleCall = useCallback(() => {
    if (lead?.phone) {
      const phoneNumber = lead.phone.replace(/[^\d+]/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert(
        'No Phone Number',
        "This lead doesn't have a phone number on file.",
      );
    }
  }, [lead?.phone]);

  const handleEmail = useCallback(() => {
    if (lead?.email) {
      Linking.openURL(`mailto:${lead.email}`);
    }
  }, [lead?.email]);

  const handleEdit = useCallback(() => {
    Alert.alert(
      'Edit Lead',
      'Edit functionality would navigate to edit screen',
    );
  }, []);

  const handleShare = useCallback(() => {
    Alert.alert('Share Lead', 'Share functionality would open share dialog');
  }, []);

  const handleAddNote = useCallback(() => {
    Alert.alert('Add Note', 'Note functionality would open note editor');
  }, []);

  // Tag handlers
  const handleAddTag = useCallback((newTag: string) => {
    Alert.alert('Add Tag', `Tag "${newTag}" would be added to the lead`);
  }, []);

  const handleRemoveTag = useCallback((tagIndex: number) => {
    Alert.alert('Remove Tag', `Tag at index ${tagIndex} would be removed`);
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Scroll handler
  const handleScroll = useCallback(
    (event: any) => {
      scrollY.value = event.nativeEvent.contentOffset.y;
    },
    [scrollY],
  );

  // Render header actions
  const renderHeaderActions = () => (
    <View style={{ flexDirection: 'row' }}>
      <IconButton
        icon="pencil"
        size={24}
        onPress={handleEdit}
        iconColor={theme.colors.onSurface}
      />
      <IconButton
        icon="share"
        size={24}
        onPress={handleShare}
        iconColor={theme.colors.onSurface}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={[
            theme.fonts.bodyLarge,
            { marginTop: 16, color: theme.colors.onSurface },
          ]}
        >
          Loading lead details...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text
          style={[
            theme.fonts.titleMedium,
            { color: theme.colors.error, textAlign: 'center' },
          ]}
        >
          Unable to load lead details
        </Text>
        <Button
          mode="contained"
          onPress={() => refetch()}
          style={{ marginTop: 16 }}
        >
          Try Again
        </Button>
      </View>
    );
  }

  if (!lead) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text
          style={[
            theme.fonts.titleMedium,
            { color: theme.colors.onSurface, textAlign: 'center' },
          ]}
        >
          Lead not found
        </Text>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={{ marginTop: 16 }}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const primaryAction = lead.phone ? 'call' : 'email';

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StickyHeader scrollY={scrollY} renderRight={renderHeaderActions} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[{ paddingBottom: bottom + 80 }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <ScrollHeader scrollY={scrollY} renderRight={renderHeaderActions} />

        {/* Hero Section */}
        <DetailsHeroSection lead={lead} style={{ marginHorizontal: 16 }} />

        {/* Quick Actions */}
        <ActionButtons lead={lead} />

        {/* Tags Section */}
        <DetailTagsSection
          tags={lead.tags}
          leadId={lead.id}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />

        {/* Contact Information */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text style={[theme.fonts.titleMedium, styles.sectionTitle]}>
              Contact Information
            </Text>
            <List.Item
              title="Email"
              description={lead.email}
              left={(props) => <List.Icon {...props} icon="email" />}
              right={(props) => (
                <IconButton {...props} icon="content-copy" onPress={() => {}} />
              )}
            />
            {lead.phone && (
              <>
                <Divider />
                <List.Item
                  title="Phone"
                  description={lead.phone}
                  left={(props) => <List.Icon {...props} icon="phone" />}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="content-copy"
                      onPress={() => {}}
                    />
                  )}
                />
              </>
            )}
          </Card.Content>
        </Card>

        {/* Notes Section */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text style={[theme.fonts.titleMedium, styles.sectionTitle]}>
              Notes
            </Text>
            {lead.notes ? (
              <Text
                style={[
                  theme.fonts.bodyMedium,
                  { color: theme.colors.onSurface },
                ]}
              >
                {lead.notes}
              </Text>
            ) : (
              <View style={styles.emptyState}>
                <Text
                  style={[
                    theme.fonts.bodyMedium,
                    {
                      color: theme.colors.onSurfaceVariant,
                      textAlign: 'center',
                    },
                  ]}
                >
                  No notes added yet
                </Text>
                <Button
                  mode="outlined"
                  icon="note-plus"
                  onPress={handleAddNote}
                  style={{ marginTop: 12 }}
                >
                  Add Note
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Activity Timeline Placeholder */}
        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text style={[theme.fonts.titleMedium, styles.sectionTitle]}>
              Recent Activity
            </Text>
            <View style={styles.emptyState}>
              <Text
                style={[
                  theme.fonts.bodyMedium,
                  { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
                ]}
              >
                No recent activity
              </Text>
              <Text
                style={[
                  theme.fonts.bodySmall,
                  {
                    color: theme.colors.onSurfaceVariant,
                    textAlign: 'center',
                    marginTop: 8,
                  },
                ]}
              >
                Activities like calls, emails, and meetings will appear here
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon={primaryAction === 'call' ? 'phone' : 'email'}
        onPress={primaryAction === 'call' ? handleCall : handleEmail}
        style={[
          styles.fab,
          {
            bottom: bottom + 24,
            backgroundColor:
              primaryAction === 'call' ? '#4CAF50' : theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  fab: {
    position: 'absolute',
    right: 24,
  },
});
