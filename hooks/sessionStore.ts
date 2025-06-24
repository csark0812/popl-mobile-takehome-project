import { devtools } from '@csark0812/zustand-expo-devtools';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface SessionState extends Session {
  signIn: (name: string, password: string) => void;
  signOut: () => void;
  setTheme: (theme: 'light' | 'dark' | 'device') => void;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      immer((set) => ({
        name: '',
        password: '',
        isSignedIn: false,
        theme: 'light',
        signIn: (name, password) =>
          set(
            (state) => {
              state.name = name;
              state.password = password;
              state.isSignedIn = true;
            },
            undefined,
            'session/signIn',
          ),
        signOut: () =>
          set(
            (state) => {
              state.name = '';
              state.password = '';
              state.isSignedIn = false;
            },
            undefined,
            'session/signOut',
          ),
        setTheme: (theme) =>
          set(
            (state) => {
              state.theme = theme;
            },
            undefined,
            'session/setTheme',
          ),
      })),
      {
        name: 'session-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
    { name: 'session-store' },
  ),
);
