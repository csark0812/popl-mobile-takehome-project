import { Lead } from '@types';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Avatar, Surface, Text, useTheme } from 'react-native-paper';
import CompanyAndPosition from './CompanyAndPosition';
import TemperatureTag from './TemperatureTag';

interface DetailsHeroSectionProps {
  lead: Lead;
  style?: StyleProp<ViewStyle>;
}

export default function DetailsHeroSection({
  lead,
  style,
}: DetailsHeroSectionProps) {
  const theme = useTheme();

  // Generate avatar initials
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLeadTemperature = (): 'hot' | 'warm' | 'cold' => {
    if (!lead?.tags) return 'cold';
    const hotTags = ['hot', 'priority', 'urgent'];
    const warmTags = ['warm', 'interested', 'follow-up'];

    const hasHotTag = lead.tags.some((tag) =>
      hotTags.some((hotTag) => tag.toLowerCase().includes(hotTag)),
    );
    const hasWarmTag = lead.tags.some((tag) =>
      warmTags.some((warmTag) => tag.toLowerCase().includes(warmTag)),
    );

    return hasHotTag ? 'hot' : hasWarmTag ? 'warm' : 'cold';
  };

  const getTemperatureColor = (temperature: 'hot' | 'warm' | 'cold') => {
    switch (temperature) {
      case 'hot':
        return '#FF5722';
      case 'warm':
        return '#FF9800';
      case 'cold':
        return '#2196F3';
    }
  };

  const temperature = getLeadTemperature();
  const temperatureColor = getTemperatureColor(temperature);
  const initials = getInitials(lead.name);

  return (
    <Surface
      style={[
        styles.heroSection,
        { backgroundColor: theme.colors.surface },
        style,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {lead.image ? (
            <Avatar.Image
              size={72}
              source={{ uri: lead.image }}
              style={[{ backgroundColor: temperatureColor }]}
            />
          ) : (
            <Avatar.Text
              size={72}
              label={initials}
              style={[{ backgroundColor: temperatureColor }]}
              labelStyle={styles.avatarLabel}
            />
          )}
        </View>

        <View style={styles.heroInfo}>
          <Text
            style={[
              theme.fonts.headlineSmall,
              styles.leadName,
              { color: theme.colors.onSurface },
            ]}
          >
            {lead.name}
          </Text>

          {/* Temperature and Date Row */}
          <View style={styles.temperatureDateRow}>
            <TemperatureTag
              temperature={temperature}
              color={temperatureColor}
            />
            {lead.createdAt && (
              <Text
                style={[
                  theme.fonts.bodySmall,
                  styles.createdDate,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Added {new Date(lead.createdAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Company Information */}
      <CompanyAndPosition company={lead.company} title={lead.title} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
  },
  heroSection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 0,
    gap: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 20,
  },

  avatarLabel: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  heroInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  leadName: {
    fontWeight: '700',
    marginBottom: 8,
  },
  temperatureDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  createdDate: {
    opacity: 0.7,
  },
});
