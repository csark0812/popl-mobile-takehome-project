import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Popover, { PopoverRef } from './Popover';

interface AddNewTagPopoverProps {
  onSubmit: (tag: string) => void;
}

export interface AddNewTagPopoverRef {
  show: () => void;
  hide: () => void;
}

// Mock recent tags data
const RECENT_TAGS = [
  { name: 'Hot Lead' },
  { name: 'Follow Up' },
  { name: 'Interested' },
  { name: 'Meeting' },
  { name: 'Cold Lead' },
  { name: 'Qualified' },
];

const AddNewTagPopover = forwardRef<AddNewTagPopoverRef, AddNewTagPopoverProps>(
  ({ onSubmit }, ref) => {
    const theme = useTheme();
    const [tagText, setTagText] = useState('');

    const inputFocusScale = useSharedValue(1);
    const textInputRef = useRef<TextInput>(null);
    const popoverRef = useRef<PopoverRef>(null);

    const handleDismiss = () => {
      setTagText('');
    };

    useImperativeHandle(ref, () => ({
      show: () => {
        popoverRef.current?.show();
        // Focus input after animation
        setTimeout(() => textInputRef.current?.focus(), 200);
      },
      hide: () => {
        popoverRef.current?.hide();
      },
    }));

    const animatedInputStyle = useAnimatedStyle(() => ({
      transform: [{ scale: inputFocusScale.value }],
    }));

    const handleSubmit = () => {
      const trimmedTag = tagText.trim();
      if (trimmedTag) {
        Vibration.vibrate(50);
        onSubmit(trimmedTag);
        popoverRef.current?.hide();
      }
    };

    const handleRecentTagPress = (tag: any) => {
      Vibration.vibrate(40);
      setTagText(tag.name);
    };

    const handleInputFocus = () => {
      inputFocusScale.value = withSpring(1.01, { damping: 25, stiffness: 200 });
    };

    const handleInputBlur = () => {
      inputFocusScale.value = withSpring(1, { damping: 25, stiffness: 200 });
    };

    const renderPreview = () => (
      <View style={styles.previewContainer}>
        <Text
          style={[
            styles.previewLabel,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Preview
        </Text>
        <View
          style={[styles.previewTag, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.previewText}>{tagText || 'Your tag'}</Text>
        </View>
      </View>
    );

    return (
      <Popover ref={popoverRef} onDismiss={handleDismiss}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Create Tag
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Add a label to organize your leads
            </Text>
          </View>
          <IconButton
            icon="close"
            size={20}
            onPress={() => popoverRef.current?.hide()}
            style={styles.closeButton}
          />
        </View>

        {/* Recent Tags */}
        {RECENT_TAGS.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Recent
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.recentTags}>
                {RECENT_TAGS.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRecentTagPress(tag)}
                    style={styles.recentTagChip}
                  >
                    <View
                      style={[
                        styles.recentTag,
                        {
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: theme.colors.outline,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.recentTagText,
                          { color: theme.colors.onSurfaceVariant },
                        ]}
                      >
                        {tag.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Input Section */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
          >
            Tag Name
          </Text>
          <Animated.View style={[animatedInputStyle, styles.inputWrapper]}>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: theme.colors.primary,
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
            >
              <TextInput
                ref={textInputRef}
                style={[
                  styles.textInput,
                  { color: theme.colors.onSurface, flex: 1 },
                ]}
                placeholder="Enter tag name"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                value={tagText}
                onChangeText={setTagText}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                maxLength={20}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>
          </Animated.View>
        </View>

        {/* Preview */}
        {renderPreview()}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => popoverRef.current?.hide()}
            style={[styles.actionButton, styles.cancelButton]}
            labelStyle={{ color: theme.colors.onSurfaceVariant }}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!tagText.trim()}
            style={[styles.actionButton, styles.submitButton]}
          >
            Create Tag
          </Button>
        </View>
      </Popover>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  closeButton: {
    margin: 0,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  recentTags: {
    flexDirection: 'row',
    gap: 8,
  },
  recentTagChip: {
    marginRight: 8,
  },
  recentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  recentTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 8,
  },
  textInput: {
    fontSize: 16,
    paddingVertical: 12,
    fontWeight: '500',
  },
  previewContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  previewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  previewText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  submitButton: {
    // backgroundColor handled by theme
  },
});

AddNewTagPopover.displayName = 'AddNewTagPopover';

export default AddNewTagPopover;
