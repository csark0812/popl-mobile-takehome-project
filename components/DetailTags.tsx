import React, { useCallback, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Surface, Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import AddNewTagPopover, { AddNewTagPopoverRef } from './AddNewTagPopover';

interface DetailTagsProps {
  tags: string[];
  leadId: string;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tagIndex: number) => void;
}

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

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
      }
    },
    [tags, onAddTag],
  );

  const handleRemoveTag = useCallback(
    (index: number) => {
      onRemoveTag?.(index);
    },
    [onRemoveTag],
  );

  const showAddTagPopover = () => {
    tagPopoverRef.current?.show();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.tagsWrapper} layout={Layout}>
        {tags.map((tag, index) => (
          <AnimatedSurface
            key={`${leadId}-tag-${index}`}
            style={[
              styles.tagContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
            elevation={0}
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout}
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
          </AnimatedSurface>
        ))}

        <AnimatedTouchableOpacity
          style={[styles.addButton, { borderColor: theme.colors.primary }]}
          onPress={showAddTagPopover}
          activeOpacity={0.7}
          entering={FadeIn}
          layout={Layout}
        >
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
            + Add Tag
          </Text>
        </AnimatedTouchableOpacity>
      </Animated.View>

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
