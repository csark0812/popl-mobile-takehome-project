import { FormConfig, FormFieldConfig } from '@api/leadsApi';
import AddNewTagPopover, {
  AddNewTagPopoverRef,
} from '@components/AddNewTagPopover';
import DetailTags from '@components/DetailTags';
import { Lead } from '@types';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput, useTheme } from 'react-native-paper';

interface FormProps {
  formConfig: FormConfig;
  formData: Record<string, any>;
  setFormData: (fieldName: keyof Lead, value: string | string[]) => void;
  validationErrors?: Record<string, string>;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tagIndex: number) => void;
}

export default function Form({
  formConfig,
  formData,
  setFormData,
  validationErrors = {},
  onAddTag,
  onRemoveTag,
}: FormProps) {
  const theme = useTheme();
  const tagPopoverRef = useRef<AddNewTagPopoverRef>(null);

  const setValue = (fieldName: string, value: any) => {
    setFormData(fieldName as keyof Lead, value);
  };

  const handleAddTag = (tag: string) => {
    if (onAddTag) {
      onAddTag(tag);
    } else {
      const currentTags = (formData.tags || []) as string[];
      if (!currentTags.includes(tag)) {
        setValue('tags', [...currentTags, tag]);
      }
    }
  };

  const handleRemoveTag = (tagIndex: number) => {
    if (onRemoveTag) {
      onRemoveTag(tagIndex);
    } else {
      const currentTags = (formData.tags || []) as string[];
      setValue(
        'tags',
        currentTags.filter((_, index) => index !== tagIndex),
      );
    }
  };

  const renderFormField = (field: FormFieldConfig) => {
    const value = formData[field.name] || '';
    const hasError = !!validationErrors[field.name];

    switch (field.type) {
      case 'textarea':
        return (
          <TextInput
            key={field.name}
            label={field.label}
            mode="outlined"
            multiline
            numberOfLines={field.rows || 4}
            value={value as string}
            onChangeText={(text) => setValue(field.name, text)}
            placeholder={field.placeholder}
            style={styles.input}
            error={hasError}
          />
        );

      case 'email':
        return (
          <TextInput
            key={field.name}
            label={field.label}
            mode="outlined"
            value={value as string}
            onChangeText={(text) => setValue(field.name, text)}
            placeholder={field.placeholder}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            error={hasError}
          />
        );

      case 'tel':
        return (
          <TextInput
            key={field.name}
            label={field.label}
            mode="outlined"
            value={value as string}
            onChangeText={(text) => setValue(field.name, text)}
            placeholder={field.placeholder}
            keyboardType="phone-pad"
            style={styles.input}
            error={hasError}
          />
        );

      case 'tags':
        const tags = (formData.tags || []) as string[];
        return (
          <View key={field.name} style={styles.tagsField}>
            <Text
              style={[
                theme.fonts.labelMedium,
                styles.fieldLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {field.label}
            </Text>
            <Surface
              style={[
                styles.tagsContainerRedesigned,
                {
                  borderColor: theme.colors.outline,
                  backgroundColor: theme.colors.surfaceVariant,
                },
              ]}
              elevation={0}
            >
              {tags.length > 0 ? (
                <DetailTags
                  tags={tags}
                  leadId="form-lead"
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                />
              ) : (
                <View style={styles.emptyTagsState}>
                  <Text
                    style={[
                      theme.fonts.bodyMedium,
                      styles.emptyTagsText,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {field.placeholder || 'No tags added yet'}
                  </Text>
                  <Button
                    mode="outlined"
                    icon="plus"
                    onPress={() => tagPopoverRef.current?.show()}
                    style={styles.addTagsButtonRedesigned}
                    labelStyle={{ color: theme.colors.primary }}
                    contentStyle={styles.addTagsButtonContentRedesigned}
                    accessibilityLabel="Add a new tag"
                  >
                    Add Tag
                  </Button>
                </View>
              )}
            </Surface>
            <AddNewTagPopover ref={tagPopoverRef} onSubmit={handleAddTag} />
          </View>
        );

      case 'image':
        return (
          <View key={field.name} style={{ marginBottom: 16 }}>
            <Text
              style={[
                theme.fonts.labelMedium,
                styles.fieldLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {field.label}
            </Text>
            {value ? (
              <Image
                source={{ uri: value }}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
                resizeMode="cover"
              />
            ) : null}
            <Button
              mode="outlined"
              icon="image"
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (
                  !result.canceled &&
                  result.assets &&
                  result.assets.length > 0
                ) {
                  setValue(field.name, result.assets[0].uri);
                }
              }}
            >
              {value ? 'Change Image' : field.placeholder || 'Select Image'}
            </Button>
          </View>
        );

      default:
        return (
          <TextInput
            key={field.name}
            label={field.label}
            mode="outlined"
            value={value as string}
            onChangeText={(text) => setValue(field.name, text)}
            placeholder={field.placeholder}
            style={styles.input}
            error={hasError}
          />
        );
    }
  };

  return (
    <View>
      {formConfig.description && (
        <Text
          style={[
            theme.fonts.bodyMedium,
            styles.description,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {formConfig.description}
        </Text>
      )}

      {/* Form Fields */}
      {formConfig.fields.map((field) => (
        <View key={field.name} style={styles.fieldContainer}>
          {renderFormField(field)}
          {validationErrors[field.name] && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {validationErrors[field.name]}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  tagsField: {
    marginBottom: 8,
  },
  fieldLabel: {
    marginBottom: 8,
    fontWeight: '500',
  },
  tagsContainerRedesigned: {
    minHeight: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0', // fallback, overridden by theme
    padding: 16,
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  emptyTagsState: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  emptyTagsText: {
    marginBottom: 12,
    textAlign: 'center',
  },
  addTagsButtonRedesigned: {
    alignSelf: 'center',
    minWidth: 120,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent', // overridden by Paper
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  addTagsButtonContentRedesigned: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});
