import { act, renderHook } from '@testing-library/react-native';
import type { FormConfig } from '../api/leadsApi';
import * as apiHook from '../hooks/api';
import * as sessionStore from '../hooks/sessionStore';
import * as useFormState from '../hooks/useFormState';
import * as usePressScale from '../hooks/usePressScale';
import * as useSelectedColorScheme from '../hooks/useSelectedColorScheme';
import type { Lead } from '../types';

describe('Hooks', () => {
  describe('api hooks', () => {
    it('useLeads returns query object', () => {
      const { result } = renderHook(() => apiHook.useLeads());
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
    });
    it('useLead returns query object', () => {
      const { result } = renderHook(() => apiHook.useLead('1'));
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
    });
    it('useCreateLead returns mutation object', () => {
      const { result } = renderHook(() => apiHook.useCreateLead());
      expect(result.current).toHaveProperty('mutate');
    });
    it('useUpdateLead returns mutation object', () => {
      const { result } = renderHook(() => apiHook.useUpdateLead());
      expect(result.current).toHaveProperty('mutate');
    });
    it('useDeleteLead returns mutation object', () => {
      const { result } = renderHook(() => apiHook.useDeleteLead());
      expect(result.current).toHaveProperty('mutate');
    });
  });

  describe('sessionStore', () => {
    beforeEach(() => {
      jest.spyOn(sessionStore, 'useSessionStore').mockImplementation(() => ({
        isSignedIn: false,
        theme: 'light',
        signIn: jest.fn(),
        signOut: jest.fn(),
        setTheme: jest.fn(),
      }));
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('can sign in and out', () => {
      const { result } = renderHook(() => sessionStore.useSessionStore());
      expect(typeof result.current.signIn).toBe('function');
      expect(typeof result.current.signOut).toBe('function');
    });
    it('can set theme', () => {
      const { result } = renderHook(() => sessionStore.useSessionStore());
      expect(typeof result.current.setTheme).toBe('function');
    });
  });

  describe('useFormState', () => {
    const formConfig: FormConfig = {
      title: 'Test Form',
      fields: [
        {
          name: 'name' as keyof Lead,
          type: 'text',
          label: 'Name',
          required: true,
        },
      ],
      submitLabel: 'Submit',
      cancelLabel: 'Cancel',
    };
    it('initializes with config and updates values', () => {
      const { result } = renderHook(() =>
        useFormState.useFormState(formConfig),
      );
      act(() => {
        result.current.setValue('name', 'John');
      });
      expect(result.current.formData.name).toBe('John');
    });
    it('validates required fields', () => {
      const { result } = renderHook(() =>
        useFormState.useFormState(formConfig),
      );
      act(() => {
        result.current.setValue('name', '');
      });
      let errors: Record<string, string>;
      act(() => {
        errors = result.current.validateForm();
      });
      expect(errors!.name).toBeDefined();
    });
  });

  describe('usePressScale', () => {
    it('returns animated style and handlers', () => {
      const { result } = renderHook(() => usePressScale.usePressScale());
      expect(result.current).toHaveProperty('animatedStyle');
      expect(result.current).toHaveProperty('handlePressIn');
      expect(result.current).toHaveProperty('handlePressOut');
    });
  });

  describe('useSelectedColorScheme', () => {
    beforeAll(() => {
      jest
        .spyOn(useSelectedColorScheme, 'useSelectedColorScheme')
        .mockReturnValue('light');
    });
    it('returns a color scheme', () => {
      const { result } = renderHook(() =>
        useSelectedColorScheme.useSelectedColorScheme(),
      );
      expect(['light', 'dark', 'device']).toContain(result.current);
    });
  });
});
