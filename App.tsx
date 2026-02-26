import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-gesture-handler';

// Keep splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./fonts/Inter/static/Inter_18pt-Regular.ttf'),
    'Inter-Medium': require('./fonts/Inter/static/Inter_18pt-Medium.ttf'),
    'Inter-SemiBold': require('./fonts/Inter/static/Inter_18pt-SemiBold.ttf'),
    'Inter-Bold': require('./fonts/Inter/static/Inter_18pt-Bold.ttf'),
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
