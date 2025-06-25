import React, { useCallback, useRef } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Surface, Text, useTheme } from 'react-native-paper';
import AddNewTagPopover, { AddNewTagPopoverRef } from './AddNewTagPopover';

interface DetailTagsProps {
  tags: string[];
  leadId: string;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tagIndex: number) => void;
}

const DetailTags: React.FC<DetailTagsProps> = ({
  tags,
  leadId,
  onAddTag,
  onRemoveTag,
}) => {
  const theme = useTheme();
  const tagPopoverRef = useRef<AddNewTagPopoverRef>(null);

  const handleAddTag = useCallback(
    (tag: string) => {
      if (!tags.includes(tag)) {
        onAddTag?.(tag);
      } else {
        Alert.alert('Duplicate Tag', 'This tag already exists for this lead.');
      }
    },
    [tags, onAddTag],
  );

  const handleRemoveTag = useCallback(
    (index: number) => {
      Alert.alert(
        'Remove Tag',
        `Are you sure you want to remove "${tags[index]}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => onRemoveTag?.(index),
          },
        ],
      );
    },
    [tags, onRemoveTag],
  );

  const showAddTagPopover = () => {
    tagPopoverRef.current?.show();
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagsWrapper}>
        {tags.map((tag, index) => (
          <Surface
            key={`${leadId}-tag-${index}`}
            style={[
              styles.tagContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            elevation={0}
          >
            <Text
              style={[styles.tagText, { color: theme.colors.onSurfaceVariant }]}
            >
              {tag}
            </Text>
            <IconButton
              icon="close"
              size={14}
              onPress={() => handleRemoveTag(index)}
              iconColor={theme.colors.onSurfaceVariant}
              style={styles.removeButton}
            />
          </Surface>
        ))}

        <TouchableOpacity
          style={[styles.addButton, { borderColor: theme.colors.primary }]}
          onPress={showAddTagPopover}
          activeOpacity={0.7}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
            + Add Tag
          </Text>
        </TouchableOpacity>
      </View>

      <AddNewTagPopover ref={tagPopoverRef} onSubmit={handleAddTag} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderRadius: 100,
    paddingLeft: 8,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  removeButton: {
    margin: 0,
  },
  addButton: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  addButtonText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default DetailTags;
