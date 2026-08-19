/**
 * Expo Router Root Layout
 * Pure JavaScript / JSX with SafeAreaProvider
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" hidden={false} translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#1E123D' },
        }}
      />
    </SafeAreaProvider>
  );
}
