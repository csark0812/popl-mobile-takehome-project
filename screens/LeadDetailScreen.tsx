import AboutThisLead from '@components/AboutThisLead';
import ActionBarIcon from '@components/ActionBarIcon';
import ActionButtons from '@components/ActionButtons';
import ContactInformation from '@components/ContactInformation';
import DetailsHeroSection from '@components/DetailsHeroSection';
import LeadDetailSkeleton from '@components/LeadDetailSkeleton';
import LoadingOverlay, { LoadingOverlayRef } from '@components/LoadingOverlay';
import ScrollHeader from '@components/ScrollHeader';
import StickyHeader from '@components/StickyHeader';
import { useDeleteLead, useLead, useUpdateLead } from '@hooks/api';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Card, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'LeadDetail'>;

const { width } = Dimensions.get('window');
const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedCard = Animated.createAnimatedComponent(Card);

export default function LeadDetailScreen({ route, navigation }: Props) {
  const { leadId } = route.params;
  const { data: lead, isLoading, isError, refetch } = useLead(leadId);
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const loadingOverlayRef = useRef<LoadingOverlayRef>(null);

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
    navigation.navigate('EditLead', { leadId });
  }, [navigation, leadId]);

  const handleShare = useCallback(() => {
    Alert.alert('Share Lead', 'Share functionality would open share dialog');
  }, []);

  const handleDeleteLead = useCallback(() => {
    Alert.alert(
      'Delete Lead',
      'Are you sure you want to delete this lead? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            loadingOverlayRef.current?.show('Deleting lead...');
            deleteLead.mutate(leadId, {
              onSuccess: () => {
                loadingOverlayRef.current?.hide();
                navigation.goBack();
              },
              onError: (error) => {
                loadingOverlayRef.current?.hide();
                Alert.alert(
                  'Error',
                  'Failed to delete lead. Please try again.',
                  [{ text: 'OK' }],
                );
              },
            });
          },
        },
      ],
    );
  }, [deleteLead, leadId, navigation]);

  // Tag handlers
  const handleAddTag = useCallback(
    (newTag: string) => {
      if (!lead) return;

      const currentTags = lead.tags || [];
      if (currentTags.includes(newTag)) {
        Alert.alert('Duplicate Tag', 'This tag already exists for this lead.');
        return;
      }

      const updatedTags = [...currentTags, newTag];
      updateLead.mutate({
        id: lead.id,
        data: { tags: updatedTags },
      });
    },
    [lead, updateLead],
  );

  const handleRemoveTag = useCallback(
    (tagIndex: number) => {
      if (!lead) return;

      const currentTags = lead.tags || [];
      const tagToRemove = currentTags[tagIndex];

      Alert.alert(
        'Remove Tag',
        `Are you sure you want to remove "${tagToRemove}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              const updatedTags = currentTags.filter(
                (_, index) => index !== tagIndex,
              );
              updateLead.mutate({
                id: lead.id,
                data: { tags: updatedTags },
              });
            },
          },
        ],
      );
    },
    [lead, updateLead],
  );

  // Note handler
  const handleUpdateNote = useCallback(
    (note: string) => {
      if (!lead) return;

      updateLead.mutate({
        id: lead.id,
        data: { notes: note.trim() || null },
      });
    },
    [lead, updateLead],
  );

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
  const renderLightHeaderActions = () => (
    <ActionBarIcon icon="pencil" onPress={handleEdit} type="light" />
  );

  const renderDarkHeaderActions = () => (
    <ActionBarIcon icon="pencil" onPress={handleEdit} type="dark" />
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollHeader
          scrollY={scrollY}
          renderRight={renderLightHeaderActions}
        />
        <View
          style={[
            styles.centerContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <LeadDetailSkeleton />
        </View>
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
      <StickyHeader scrollY={scrollY} renderRight={renderDarkHeaderActions} />

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
        contentContainerStyle={[{ paddingBottom: bottom }]}
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
        <ScrollHeader
          scrollY={scrollY}
          renderRight={renderLightHeaderActions}
        />

        <View style={{ paddingHorizontal: 16 }}>
          {/* Hero Section */}
          <DetailsHeroSection lead={lead} />

          {/* Quick Actions */}
          <ActionButtons lead={lead} />

          {/* About This Lead Section */}
          <AboutThisLead
            lead={lead}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onUpdateNote={handleUpdateNote}
          />

          {/* Contact Information */}
          <ContactInformation lead={lead} />

          {/* Delete Button */}
          <View style={styles.deleteButtonContainer}>
            <Button
              mode="outlined"
              onPress={handleDeleteLead}
              icon="delete"
              style={[styles.deleteButton, { borderColor: theme.colors.error }]}
              textColor={theme.colors.error}
              buttonColor="transparent"
            >
              Delete Lead
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <LoadingOverlay ref={loadingOverlayRef} />
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
  deleteButtonContainer: {
    marginBottom: 16,
  },
  deleteButton: {
    borderRadius: 8,
    borderWidth: 1,
  },
});
