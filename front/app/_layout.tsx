import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ConfigurationProvider } from '@/context/ConfigurationContext';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { UserProvider } from '@/context/User';
import Spinner from '@/components/Spinner';
import NotFoundScreen from './+not-found';
import { colors } from '@/utils/colors';
import { AuthProvider } from '@/context/authContext';



function NotificationHandler() {
  const router = useRouter();

  function _handleNotification(response: Notifications.NotificationResponse) {
    try {
      const notification = response.notification;
      if (response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
        const data = notification.request.content.data as any;
        if (data.order && data._id) {
          router.push({
            pathname: '/(drawer)/(stack)',
            params: { _id: data._id }
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      _handleNotification
    );

    return () => subscription.remove();
  }, []);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ConfigurationProvider>
        <UserProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="(drawer)" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </UserProvider>
      </ConfigurationProvider>
    </AuthProvider>
  );
}