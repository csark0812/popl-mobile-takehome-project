import { devtools } from '@csark0812/zustand-expo-devtools';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface NavigationState {
  headerHeight: number;
  setHeaderHeight: (height: number) => void;
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    persist(
      immer((set) => ({
        headerHeight: 0,
        setHeaderHeight: (height) =>
          set(
            (state) => {
              state.headerHeight = height;
            },
            false,
            'navigation/setHeaderHeight',
          ),
      })),
      {
        name: 'navigation-storage',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
    { name: 'navigation-store' },
  ),
);
