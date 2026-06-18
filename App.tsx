import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeFeed } from '@/engine/HomeFeed';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import homepagePayload from '@/mocks/homepage_payload.json';
import type { HomepagePayload } from '@/types';

const payload = homepagePayload as HomepagePayload;

class RootErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, backgroundColor: '#fff1f2' }}>
          <Text style={{ color: '#9b1c1c', fontSize: 14, fontFamily: 'monospace', textAlign: 'center' }}>
            App crash: {this.state.error}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <RootErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider theme={payload.theme}>
          <CartProvider>
            <StatusBar style="auto" />
            <HomeFeed payload={payload} />
          </CartProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </RootErrorBoundary>
  );
}
