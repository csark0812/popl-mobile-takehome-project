import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface NotesSectionProps {
  notes?: string;
  onUpdateNote?: (note: string) => void;
}

export default function NotesSection({
  notes,
  onUpdateNote,
}: NotesSectionProps) {
  const theme = useTheme();
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState(notes || '');
  const textInputRef = useRef<any>(null);

  // Reanimated shared values
  const editingProgress = useSharedValue(0);

  const hasNoteChanged = editedNote !== (notes || '');
  const hasNotes = notes && notes.trim().length > 0;

  useEffect(() => {
    editingProgress.value = withTiming(isEditingNote ? 1 : 0, {
      duration: 200,
    });
  }, [isEditingNote]);

  useEffect(() => {
    if (isEditingNote && textInputRef.current) {
      // Small delay to ensure the input is fully rendered
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [isEditingNote]);

  const handleEditNote = () => {
    setIsEditingNote(true);
  };

  const handleSaveNote = () => {
    if (onUpdateNote) {
      onUpdateNote(editedNote);
    }
    setIsEditingNote(false);
  };

  const handleCancelEdit = () => {
    setEditedNote(notes || '');
    setIsEditingNote(false);
  };

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        editingProgress.value,
        [0, 1],
        [theme.colors.outline, theme.colors.primary],
      ),
      backgroundColor: interpolateColor(
        editingProgress.value,
        [0, 1],
        ['transparent', `${theme.colors.primary}08`],
      ),
      borderWidth: withTiming(isEditingNote ? 2 : 0, { duration: 200 }),
    };
  });

  const animatedActionsStyle = useAnimatedStyle(() => {
    return {
      opacity: editingProgress.value,
      transform: [
        {
          translateY: withTiming(isEditingNote ? 0 : -10, { duration: 200 }),
        },
      ],
    };
  });

  const animatedEmptyEditStyle = useAnimatedStyle(() => {
    return {
      opacity: editingProgress.value,
      transform: [
        {
          translateY: withTiming(isEditingNote ? 0 : -20, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <View>
      <View style={styles.notesHeader}>
        <Text
          style={[
            theme.fonts.labelSmall,
            styles.subsectionLabel,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          NOTES
        </Text>
        {hasNotes && !isEditingNote && (
          <IconButton
            icon="pencil"
            size={16}
            iconColor={theme.colors.primary}
            onPress={handleEditNote}
            style={styles.editButton}
          />
        )}
      </View>

      {hasNotes ? (
        <View>
          <Animated.View
            style={[styles.textInputContainer, animatedContainerStyle]}
          >
            <TextInput
              ref={textInputRef}
              mode="outlined"
              multiline
              value={editedNote}
              onChangeText={setEditedNote}
              editable={isEditingNote}
              style={[
                styles.textInput,
                !isEditingNote && styles.disabledTextInput,
              ]}
              contentStyle={[
                !isEditingNote && { color: theme.colors.onSurface },
              ]}
              outlineStyle={styles.textInputOutline}
            />
          </Animated.View>

          {isEditingNote && (
            <Animated.View style={[styles.editActions, animatedActionsStyle]}>
              <Button
                mode="text"
                onPress={handleCancelEdit}
                textColor={theme.colors.onSurfaceVariant}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveNote}
                disabled={!hasNoteChanged}
                style={styles.saveButton}
              >
                Save Changes
              </Button>
            </Animated.View>
          )}
        </View>
      ) : (
        <View>
          {!isEditingNote && (
            <View style={styles.emptyState}>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  { borderColor: theme.colors.primary },
                ]}
                onPress={handleEditNote}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.addButtonText,
                    { color: theme.colors.primary },
                  ]}
                >
                  + Add Note
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isEditingNote && (
            <Animated.View
              style={[styles.editContainer, animatedEmptyEditStyle]}
            >
              <TextInput
                mode="outlined"
                multiline
                value={editedNote}
                onChangeText={setEditedNote}
                style={styles.textInput}
                placeholder="Add your notes here..."
                autoFocus
              />
              <View style={styles.editActions}>
                <Button
                  mode="text"
                  onPress={handleCancelEdit}
                  textColor={theme.colors.onSurfaceVariant}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveNote}
                  disabled={editedNote.trim().length === 0}
                  style={styles.saveButton}
                >
                  Save Note
                </Button>
              </View>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  subsectionLabel: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    gap: 4,
  },
  editButton: {
    width: 24,
    margin: 0,
    height: 24,
  },
  textInputContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  textInput: {
    minHeight: 80,
  },
  textInputOutline: {
    borderWidth: 0,
  },
  disabledTextInput: {
    marginHorizontal: -14,

    backgroundColor: 'transparent',
    minHeight: 0,
  },
  editContainer: {
    gap: 8,
    marginTop: 16,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  saveButton: {
    marginLeft: 8,
  },
  emptyState: {
    // removed alignItems: 'center' and paddingVertical
  },
  emptyStateText: {
    marginBottom: 12,
    fontStyle: 'italic',
  },
  addNoteButton: {
    marginBottom: 16,
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
