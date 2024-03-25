import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GameScoresScreen from '../screens/GameScoresScreen';
import SettingsScreen from '../screens/SettingsScreen'; // Assume you have this screen

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HitOrMiss" component={GameScoresScreen} options={{ tabBarLabel: 'Hit Or Miss' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
