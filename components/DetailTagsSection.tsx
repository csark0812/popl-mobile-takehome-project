import DetailTags from '@components/DetailTags';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import AddNewTagPopover, { AddNewTagPopoverRef } from './AddNewTagPopover';

interface DetailTagsSectionProps {
  tags?: string[];
  leadId: string;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tagIndex: number) => void;
}

export default function DetailTagsSection({
  tags = [],
  leadId,
  onAddTag,
  onRemoveTag,
}: DetailTagsSectionProps) {
  const theme = useTheme();
  const tagPopoverRef = useRef<AddNewTagPopoverRef>(null);

  const handleAddFirstTag = () => {
    tagPopoverRef.current?.show();
  };

  return (
    <View style={styles.container}>
      <Text style={[theme.fonts.titleMedium, styles.sectionTitle]}>Tags</Text>
      {tags.length > 0 ? (
        <DetailTags
          tags={tags}
          leadId={leadId}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
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
            No tags added yet
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
            Add tags to organize and categorize this lead
          </Text>
          <Button
            mode="outlined"
            icon="tag-plus"
            onPress={handleAddFirstTag}
            style={{ marginTop: 12 }}
          >
            Add Tag
          </Button>
        </View>
      )}

      <AddNewTagPopover ref={tagPopoverRef} onSubmit={onAddTag} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
