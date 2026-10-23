
import { router } from 'expo-router';

export function safeBack(
  fallbackRoute: '/' | '/(drawer)/(tabs)' = '/'
) {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallbackRoute);
  }
}