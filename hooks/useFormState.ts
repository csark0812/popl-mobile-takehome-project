import { FormConfig, FormFieldConfig } from '@api/leadsApi';
import { Lead } from '@types';
import { useCallback, useMemo, useState } from 'react';

interface UseFormStateOptions {
  initialData?: Partial<Lead>;
  onSubmit?: (data: Partial<Lead>) => void;
}

interface UseFormStateReturn {
  formData: Partial<Lead>;
  validationErrors: Record<string, string>;
  setValue: (fieldName: keyof Lead, value: string | string[]) => void;
  addTag: (tag: string) => void;
  removeTag: (tagIndex: number) => void;
  validateForm: () => Record<string, string>;
  clearErrors: () => void;
  clearField: (fieldName: keyof Lead) => void;
  reset: () => void;
  isValid: boolean;
  hasChanges: boolean;
  getCleanedData: () => Partial<Lead>;
}

export function useFormState(
  formConfig: FormConfig | null | undefined,
  options: UseFormStateOptions = {},
): UseFormStateReturn {
  const { initialData, onSubmit } = options;

  // Generate initial form data based on form config
  const initialFormData = useMemo(() => {
    if (!formConfig) return {};

    const defaultData: Partial<Lead> = {};

    formConfig.fields.forEach((field) => {
      switch (field.type) {
        case 'tags':
          (defaultData as any)[field.name] = [];
          break;
        default:
          (defaultData as any)[field.name] = '';
          break;
      }
    });

    // Override with any provided initial data
    return { ...defaultData, ...initialData };
  }, [formConfig, initialData]);

  const [formData, setFormData] = useState<Partial<Lead>>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Update form data when initial data or config changes
  const reset = useCallback(() => {
    setFormData(initialFormData);
    setValidationErrors({});
  }, [initialFormData]);

  // Set individual field value
  const setValue = useCallback(
    (fieldName: keyof Lead, value: string | string[]) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      // Clear validation error when user starts typing
      setValidationErrors((prev) => {
        if (prev[fieldName]) {
          const { [fieldName]: removed, ...rest } = prev;
          return rest;
        }
        return prev;
      });
    },
    [],
  );

  // Add tag to tags array
  const addTag = useCallback(
    (tag: string) => {
      const currentTags = (formData.tags || []) as string[];
      if (!currentTags.includes(tag)) {
        setValue('tags', [...currentTags, tag]);
      }
    },
    [formData.tags, setValue],
  );

  // Remove tag from tags array
  const removeTag = useCallback(
    (tagIndex: number) => {
      const currentTags = (formData.tags || []) as string[];
      const newTags = currentTags.filter((_, index) => index !== tagIndex);
      setValue('tags', newTags);
    },
    [formData.tags, setValue],
  );

  // Validate form based on form configuration
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    if (!formConfig) return errors;

    formConfig.fields.forEach((field: FormFieldConfig) => {
      const value = formData[field.name];

      // Required field validation
      if (
        field.required &&
        (!value || (typeof value === 'string' && !value.trim()))
      ) {
        errors[field.name] = `${field.label} is required`;
        return;
      }

      // Skip validation if field is empty and not required
      if (!value || (typeof value === 'string' && !value.trim())) {
        return;
      }

      // Type-specific validation
      if (field.validation) {
        const stringValue = typeof value === 'string' ? value : '';

        if (
          field.validation.pattern &&
          !new RegExp(field.validation.pattern).test(stringValue)
        ) {
          errors[field.name] =
            field.validation.message || `Invalid ${field.label.toLowerCase()}`;
        }

        if (
          field.validation.minLength &&
          stringValue.length < field.validation.minLength
        ) {
          errors[field.name] =
            field.validation.message ||
            `${field.label} must be at least ${field.validation.minLength} characters`;
        }

        if (
          field.validation.maxLength &&
          stringValue.length > field.validation.maxLength
        ) {
          errors[field.name] =
            field.validation.message ||
            `${field.label} cannot exceed ${field.validation.maxLength} characters`;
        }
      }
    });

    setValidationErrors(errors);
    return errors;
  }, [formConfig, formData]);

  // Clear all validation errors
  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  // Clear specific field
  const clearField = useCallback((fieldName: keyof Lead) => {
    setFormData((prev) => {
      const { [fieldName]: removed, ...rest } = prev;
      return rest;
    });
    setValidationErrors((prev) => {
      const { [fieldName]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  // Get cleaned data for submission
  const getCleanedData = useCallback(() => {
    const cleanedData = { ...formData };

    // Remove empty strings and convert to undefined/null as needed
    (Object.keys(cleanedData) as Array<keyof Lead>).forEach((key) => {
      const value = cleanedData[key];
      if (typeof value === 'string' && !value.trim()) {
        delete cleanedData[key];
      }
    });

    // Remove empty tags array
    if (
      cleanedData.tags &&
      Array.isArray(cleanedData.tags) &&
      cleanedData.tags.length === 0
    ) {
      delete cleanedData.tags;
    }

    return cleanedData;
  }, [formData]);

  // Check if form is valid (all required fields filled and no validation errors)
  const isValid = useMemo(() => {
    if (!formConfig) return false;

    const requiredFieldsValid = formConfig.fields
      .filter((field) => field.required)
      .every((field) => {
        const value = formData[field.name];
        return value && (typeof value === 'string' ? value.trim() : true);
      });

    return requiredFieldsValid && Object.keys(validationErrors).length === 0;
  }, [formConfig, formData, validationErrors]);

  // Check if form has changes from initial state
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  return {
    formData,
    validationErrors,
    setValue,
    addTag,
    removeTag,
    validateForm,
    clearErrors,
    clearField,
    reset,
    isValid,
    hasChanges,
    getCleanedData,
  };
}
