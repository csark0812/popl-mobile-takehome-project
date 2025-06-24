import { useSelectedColorScheme } from '@hooks/useSelectedColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import Navigation from './navigation';
import { darkTheme, lightTheme } from './themes/theme';

export const queryClient = new QueryClient();

export default function App() {
  const scheme = useSelectedColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Navigation />
      </PaperProvider>
    </QueryClientProvider>
  );
}
