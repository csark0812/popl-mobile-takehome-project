import { useSelectedColorScheme } from '@hooks/useSelectedColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import CustomToast from './components/CustomToast';
import Navigation from './navigation';
import { darkTheme, lightTheme } from './themes/theme';

export const queryClient = new QueryClient();

// Toast configuration with custom components
const toastConfig = {
  success: CustomToast.success,
  error: CustomToast.error,
  notify: CustomToast.notify,
};

function AppImpl() {
  const scheme = useSelectedColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  const { top } = useSafeAreaInsets();
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Navigation />
        <Toast visibilityTime={5000} topOffset={top} config={toastConfig} />
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppImpl />
    </SafeAreaProvider>
  );
}
