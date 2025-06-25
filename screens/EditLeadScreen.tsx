import Form from '@components/Form';
import ModalHeader from '@components/ModalHeader';
import { useFormConfig, useLead, useUpdateLead } from '@hooks/api';
import { useFormState } from '@hooks/useFormState';
import { RootStackParamList } from '@navigation/index';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  ActivityIndicator,
  Button,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationPageContext } from '../context/NavigationPageContext';

// Add navigation prop for going back after update

type Props = NativeStackScreenProps<RootStackParamList, 'EditLead'>;

export default function EditLeadScreen({ route, navigation }: Props) {
  const { leadId } = route.params;
  const theme = useTheme();
  const { stickyHeaderHeight } = useNavigationPageContext();
  const { data: formConfig, isLoading: isLoadingConfig } = useFormConfig();
  const {
    data: lead,
    isLoading: isLoadingLead,
    isError: isLeadError,
    error: leadError,
  } = useLead(leadId);
  const { mutate, isPending, isError, error } = useUpdateLead();
  const scrollY = useSharedValue(0);
  const { top, bottom } = useSafeAreaInsets();
  // Use the form state hook, prefilled with lead data
  const {
    formData,
    validationErrors,
    setValue,
    addTag,
    removeTag,
    validateForm,
    isValid,
    getCleanedData,
  } = useFormState(formConfig, { initialData: lead });

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      return;
    }
    const cleanedData = getCleanedData();
    mutate(
      { id: leadId, data: cleanedData },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  };

  // Show loading state while form config or lead is loading
  if (isLoadingConfig || isLoadingLead) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ModalHeader scrollY={scrollY} onClose={() => navigation.goBack()} />
        <View
          style={[styles.loadingContainer, { paddingTop: stickyHeaderHeight }]}
        >
          <ActivityIndicator size="large" />
          <Text
            style={[
              styles.loadingText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Loading lead...
          </Text>
        </View>
      </View>
    );
  }

  if (!formConfig || isLeadError || !lead) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ModalHeader scrollY={scrollY} onClose={() => navigation.goBack()} />
        <View
          style={[styles.errorContainer, { paddingTop: stickyHeaderHeight }]}
        >
          <Text style={[theme.fonts.titleMedium, { textAlign: 'center' }]}>
            Unable to load lead
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  return (
    <Portal.Host>
      <View style={{ flex: 1, height: '50%' }}>
        {/* Modal Header */}
        <ModalHeader scrollY={scrollY} onClose={() => navigation.goBack()} />

        {/* Form Content */}
        <KeyboardAwareScrollView
          extraHeight={140}
          contentContainerStyle={[
            styles.formContainer,
            { paddingTop: stickyHeaderHeight, paddingBottom: bottom + 42 },
          ]}
          keyboardShouldPersistTaps="handled"
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          <Form
            formConfig={formConfig}
            formData={formData}
            setFormData={setValue}
            validationErrors={validationErrors}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />

          {/* Error State */}
          {isError && (
            <Text style={[styles.globalError, { color: theme.colors.error }]}>
              {error?.message || 'Error updating lead. Please try again.'}
            </Text>
          )}
        </KeyboardAwareScrollView>
      </View>
      {/* Floating Save Button */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={top + 16}
        style={[
          styles.floatingButtonContainer,
          {
            bottom: bottom,
          },
        ]}
      >
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isPending}
          disabled={isPending || !isValid}
          style={styles.submitButton}
          contentStyle={{ height: 48 }}
        >
          {isPending ? 'Saving...' : formConfig.submitLabel || 'Save Changes'}
        </Button>
      </KeyboardAvoidingView>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  globalError: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorButton: {
    marginTop: 16,
  },
  floatingButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
});
