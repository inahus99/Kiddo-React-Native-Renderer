import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeFeed } from '@/engine/HomeFeed';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import homepagePayload from '@/mocks/homepage_payload.json';
import type { HomepagePayload } from '@/types';

const payload = homepagePayload as HomepagePayload;

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={payload.theme}>
        <CartProvider>
          <StatusBar style="auto" />
          <HomeFeed payload={payload} />
        </CartProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
