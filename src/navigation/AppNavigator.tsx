import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { TrackSetupScreen } from '../features/trackSetup/TrackSetupScreen';
import { RunSessionScreen } from '../features/runSession/RunSessionScreen';
import { HistoryScreen } from '../features/history/HistoryScreen';

const Stack = createStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TrackSetup"
          component={TrackSetupScreen}
          options={{ title: 'New Track' }}
        />
        <Stack.Screen
          name="RunSession"
          component={RunSessionScreen}
          options={{ title: 'Time Attack' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Run History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
