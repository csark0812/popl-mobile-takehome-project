import { Lead } from '../types';
import { api } from './api';

export const leadsApi = {
  getAll: () => api.get<Lead[]>('/leads'),
  getById: (id: string) => api.get<Lead>(`/leads/${id}`),
  create: (data: Partial<Lead>) => api.post<Lead>('/leads', data),

  // Optional methods (not required for this take-home)
  update: (id: string, data: Partial<Lead>) =>
    api.put<Lead>(`/leads/${id}`, data),
  delete: (id: string) => api.delete(`/leads/${id}`),
};
