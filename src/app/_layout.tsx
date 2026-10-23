import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, StyleSheet } from 'react-native';
import { ShopProvider } from '@/context/ShopContext';
import { COLORS } from '@/constants/theme';

// Ignore harmless upstream Reanimated warning triggered by @react-navigation/drawer
LogBox.ignoreLogs([
  '[Reanimated] Dependencies should only be used on the web and are always ignored on native.',
]);

// Keep splash screen visible while assets load
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen smoothly on mount
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ShopProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}>
          {/* Welcome Screen */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Authentication Screens */}
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />

          {/* Drawer + Bottom Tabs Container */}
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

          {/* Detail & Action Stack Screens */}
          <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="add-product" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="order-confirmation" options={{ headerShown: false }} />
          <Stack.Screen name="help" options={{ headerShown: false }} />

          {/* Compatibility redirects */}
          <Stack.Screen name="products" options={{ headerShown: false }} />
          <Stack.Screen name="explore" options={{ headerShown: false }} />
        </Stack>
      </ShopProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
