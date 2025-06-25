import { api } from '@api/api';
import { Lead } from '@types';

// Form configuration types for dynamic form generation
export interface FormFieldConfig {
  name: keyof Lead;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'tags';
  required: boolean;
  placeholder?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
  multiline?: boolean;
  rows?: number;
}

export interface FormConfig {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  submitLabel: string;
  cancelLabel: string;
}

export const leadsApi = {
  getAll: () => api.get<Lead[]>('/leads'),
  getById: (id: string) => api.get<Lead>(`/leads/${id}`),
  create: (data: Partial<Lead>) => api.post<Lead>('/leads', data),
  getFormConfig: () => api.get<FormConfig>('/form-config'),

  // Optional methods (not required for this take-home)
  update: (id: string, data: Partial<Lead>) =>
    api.put<Lead>(`/leads/${id}`, data),
  delete: (id: string) => api.delete(`/leads/${id}`),
};
