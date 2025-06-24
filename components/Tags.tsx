import React from 'react';
import { StyleSheet, View } from 'react-native';
import Tag from './Tag';

interface TagsProps {
  tags: string[];
  leadId: string;
}

const Tags: React.FC<TagsProps> = ({ tags, leadId }) => {
  const MAX_VISIBLE_TAGS = 2;

  // Clean and filter tags
  const cleanTags =
    tags?.filter((tag) => tag && tag.trim() !== '').map((tag) => tag.trim()) ||
    [];

  // Don't render anything if no tags
  if (cleanTags.length === 0) {
    return null;
  }

  const hasMoreTags = cleanTags.length > MAX_VISIBLE_TAGS;
  const remainingCount = cleanTags.length - MAX_VISIBLE_TAGS;

  // Create display data including the "+x" tag if needed
  const getDisplayData = () => {
    const visibleTags = cleanTags.slice(0, MAX_VISIBLE_TAGS);

    if (hasMoreTags) {
      return [...visibleTags, `+${remainingCount}`];
    }

    return visibleTags;
  };

  const displayData = getDisplayData();

  return (
    <View style={styles.container}>
      <View style={styles.tagsWrapper}>
        {displayData.map((tag, index) => (
          <View key={`${leadId}-tag-${index}-${tag}`}>
            <Tag label={tag} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default Tags;
