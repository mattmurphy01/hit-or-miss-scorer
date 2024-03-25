import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GameScoresScreen from '../screens/GameScoresScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HOMStackNavigator from '../utils/HOMStackNavigator';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF', 
        tabBarInactiveTintColor: '#888888', 
        tabBarStyle: {
          backgroundColor: '#121212', 
        },
        tabBarLabelStyle: {
          fontSize: 12, 
        },
        tabBarIconStyle: { /* Customizations for the icon style */ },
        headerShown: false,
      }}
    >
      <Tab.Screen name="HitOrMiss" component={HOMStackNavigator} options={{ tabBarLabel: 'Hit Or Miss', tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="casino" size={size} color={color} />
      ), }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings', tabBarIcon: ({ color, size }) => (
        <MaterialIcons name="settings" size={size} color={color} />
      ), }} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
