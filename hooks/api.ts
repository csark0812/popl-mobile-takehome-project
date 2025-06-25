import { leadsApi } from '@api/leadsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Lead } from '@types';
import { cleanLeadData, cleanLeadsData } from '@utils';

// Fetch all leads
export function useLeads() {
  return useQuery<Lead[], Error>({
    queryKey: ['leads'],
    queryFn: () => leadsApi.getAll().then((res) => cleanLeadsData(res.data)),
  });
}

// Fetch a single lead by ID
export function useLead(id: string) {
  return useQuery<Lead, Error>({
    queryKey: ['leads', id],
    queryFn: () => leadsApi.getById(id).then((res) => cleanLeadData(res.data)),
    enabled: !!id,
  });
}

// Create a new lead
export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation<Lead, Error, Partial<Lead>>({
    mutationFn: (data) =>
      leadsApi.create(data).then((res) => cleanLeadData(res.data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

// Update a lead
export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation<Lead, Error, { id: string; data: Partial<Lead> }>({
    mutationFn: ({ id, data }) =>
      leadsApi.update(id, data).then((res) => cleanLeadData(res.data)),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', variables.id] });
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
    },
  });
}
