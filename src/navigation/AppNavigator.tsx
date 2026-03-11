import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { TrackSetupScreen } from '../features/trackSetup/TrackSetupScreen';
import { RunSessionScreen } from '../features/runSession/RunSessionScreen';
import { HistoryScreen } from '../features/history/HistoryScreen';
import { TabBarIcon } from '../components/TabBarIcon';
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for Tracks tab (includes track selection, setup, and run session)
const TracksStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.cardBorder,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
          fontSize: theme.typography.sizes.title,
        },
      }}
    >
      <Stack.Screen
        name="TrackSelection"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Tracks',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('TrackSetup')}
              style={{ marginRight: 16 }}
            >
              <TabBarIcon name="newTrack" color={theme.colors.primary} size={24} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="TrackSetup"
        component={TrackSetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RunSession"
        component={RunSessionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};



// Stack navigator for History tab
const HistoryStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.cardBorder,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
          fontSize: theme.typography.sizes.title,
        },
      }}
    >
      <Stack.Screen
        name="RunHistory"
        component={HistoryScreen}
        options={{ title: 'Run History' }}
      />
    </Stack.Navigator>
  );
};

// Stack navigator for Analysis tab
const AnalysisStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.cardBorder,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
          fontSize: theme.typography.sizes.title,
        },
      }}
    >
      <Stack.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Stack navigator for Profile tab
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.cardBorder,
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontWeight: theme.typography.weights.bold,
          fontSize: theme.typography.sizes.title,
        },
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="TracksTab"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: theme.colors.card,
            borderTopWidth: 1,
            borderTopColor: theme.colors.cardBorder,
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: theme.typography.sizes.tiny,
            fontWeight: theme.typography.weights.semibold,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          },
        }}
      >
        <Tab.Screen
          name="TracksTab"
          component={TracksStack}
          options={{
            tabBarLabel: 'TRACKS',
            tabBarIcon: ({ color }) => <TabBarIcon name="tracks" color={color} />,
          }}
        />
        <Tab.Screen
          name="HistoryTab"
          component={HistoryStack}
          options={{
            tabBarLabel: 'HISTORY',
            tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
          }}
        />
        <Tab.Screen
          name="AnalysisTab"
          component={AnalysisStack}
          options={{
            tabBarLabel: 'ANALYSIS',
            tabBarIcon: ({ color }) => <TabBarIcon name="analysis" color={color} />,
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStack}
          options={{
            tabBarLabel: 'PROFILE',
            tabBarIcon: ({ color }) => <TabBarIcon name="profile" color={color} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
