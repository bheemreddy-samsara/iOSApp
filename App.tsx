import { useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppState } from 'react-native';
import { RootNavigator } from '@/navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { isE2ETestMode } from '@/utils/testMode';

// Check E2E mode once at module load to avoid re-evaluation
const isE2E = isE2ETestMode();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: isE2E ? 0 : 2,
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      // Disable automatic refetching during E2E tests to prevent Detox sync issues
      refetchOnWindowFocus: !isE2E,
      refetchOnReconnect: !isE2E,
    },
    mutations: {
      retry: isE2E ? 0 : 1,
    },
  },
});

export default function App() {
  useEffect(() => {
    // Skip AppState listener during E2E tests to prevent Detox sync issues
    if (isE2E) return;

    const subscription = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active');
    });
    return () => subscription.remove();
  }, []);

  const client = useMemo(() => queryClient, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={client}>
          <StatusBar style="dark" />
          <RootNavigator />
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
