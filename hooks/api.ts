import { FormConfig, leadsApi } from '@api/leadsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Lead } from '@types';
import { cleanLeadData, cleanLeadsData } from '@utils';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

// Fetch all leads
export function useLeads() {
  const query = useQuery<Lead[], Error>({
    queryKey: ['leads'],
    queryFn: () => leadsApi.getAll().then((res) => cleanLeadsData(res.data)),
  });

  useEffect(() => {
    if (query.isError && query.error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Load Leads',
        text2: query.error.message || 'An error occurred while fetching leads.',
      });
    }
  }, [query.isError, query.error]);

  return query;
}

// Fetch a single lead by ID
export function useLead(id: string) {
  const query = useQuery<Lead, Error>({
    queryKey: ['leads', id],
    queryFn: () => leadsApi.getById(id).then((res) => cleanLeadData(res.data)),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Load Lead',
        text2:
          query.error.message || 'An error occurred while fetching the lead.',
      });
    }
  }, [query.isError, query.error]);

  return query;
}

// Create a new lead
export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation<Lead, Error, Partial<Lead>>({
    mutationFn: (data) =>
      leadsApi.create(data).then((res) => cleanLeadData(res.data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      Toast.show({
        type: 'success',
        text1: 'Lead Created',
        text2: 'The new lead has been created successfully.',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Create Failed',
        text2: error.message || 'Unable to create lead.',
      });
    },
  });
}

// Update a lead
export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation<
    Lead,
    Error,
    { id: string; data: Partial<Lead> },
    { previousLead?: Lead; previousLeads?: Lead[] }
  >({
    mutationFn: async ({ id, data }) => {
      // Get the current lead data to merge with new data
      let currentLead = queryClient.getQueryData<Lead>(['leads', id]);

      if (!currentLead) {
        // If not in cache, fetch from API
        const response = await leadsApi.getById(id);
        currentLead = cleanLeadData(response.data);
      }

      // Merge current lead with new data
      const mergedData = { ...currentLead, ...data };

      // Check for duplicate tags
      if (mergedData.tags && mergedData.tags.length > 0) {
        const uniqueTags = [...new Set(mergedData.tags)];
        if (uniqueTags.length !== mergedData.tags.length) {
          throw new Error('Duplicate tags are not allowed');
        }
      }

      return leadsApi
        .update(id, mergedData)
        .then((res) => cleanLeadData(res.data));
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['leads', id] });
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      // Snapshot the previous values
      const previousLead = queryClient.getQueryData<Lead>(['leads', id]);
      const previousLeads = queryClient.getQueryData<Lead[]>(['leads']);

      // Optimistically update the individual lead
      if (previousLead) {
        const optimisticLead = { ...previousLead, ...data };
        queryClient.setQueryData<Lead>(['leads', id], optimisticLead);
      }

      // Optimistically update the leads list
      if (previousLeads) {
        const optimisticLeads = previousLeads.map((lead) =>
          lead.id === id ? { ...lead, ...data } : lead,
        );
        queryClient.setQueryData<Lead[]>(['leads'], optimisticLeads);
      }

      // Return a context object with the snapshotted values
      return { previousLead, previousLeads };
    },
    onError: (error, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousLead) {
        queryClient.setQueryData(
          ['leads', _variables.id],
          context.previousLead,
        );
      }
      if (context?.previousLeads) {
        queryClient.setQueryData(['leads'], context.previousLeads);
      }

      // Show error toast with specific message for duplicate tags
      const errorMessage =
        error.message === 'Duplicate tags are not allowed'
          ? 'Duplicate tags are not allowed. Please remove duplicates before saving.'
          : 'Unable to update lead. Changes have been reverted.';

      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
      });
    },
    onSuccess: (data, variables) => {
      // Update with the actual response data
      queryClient.setQueryData<Lead>(['leads', variables.id], data);

      // Update the leads list with the actual response data
      const currentLeads = queryClient.getQueryData<Lead[]>(['leads']);
      if (currentLeads) {
        const updatedLeads = currentLeads.map((lead) =>
          lead.id === variables.id ? data : lead,
        );
        queryClient.setQueryData<Lead[]>(['leads'], updatedLeads);
      }

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Lead Updated',
        text2: 'Your changes have been saved successfully.',
      });
    },
    onSettled: (_data, _error, variables) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

// Delete a lead
export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id) => leadsApi.delete(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      Toast.show({
        type: 'success',
        text1: 'Lead Deleted',
        text2: 'The lead has been deleted successfully.',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: error.message || 'Unable to delete lead.',
      });
    },
  });
}

// Fetch form configuration
export function useFormConfig() {
  const query = useQuery<FormConfig, Error>({
    queryKey: ['form-config'],
    queryFn: () => leadsApi.getFormConfig().then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes - form config doesn't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  useEffect(() => {
    if (query.isError && query.error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Load Form Config',
        text2:
          query.error.message ||
          'An error occurred while fetching form configuration.',
      });
    }
  }, [query.isError, query.error]);

  return query;
}
