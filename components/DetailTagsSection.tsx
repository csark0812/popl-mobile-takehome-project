import DetailTags from '@components/DetailTags';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
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

  return (
    <View style={styles.container}>
      <Text
        style={[
          theme.fonts.labelSmall,
          styles.sectionLabel,
          { color: theme.colors.onSurfaceVariant },
        ]}
      >
        TAGS
      </Text>

      <DetailTags
        tags={tags}
        leadId={leadId}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  addButton: {
    margin: 0,
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
