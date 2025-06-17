import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './navigation';

export const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </QueryClientProvider>
  );
}
