import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameScoresScreen from "../screens/GameScoresScreen";
import GameScreen from "../screens/GameScreen";

const Stack = createNativeStackNavigator();

function HOMStackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName='GameScores'
      screenOptions={{
        headerStyle: {
          backgroundColor: '#121212',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name='GameScores' component={GameScoresScreen} options={{ title: 'Game Scores' }} />
      <Stack.Screen name="GameScreen" component={GameScreen} options={{ title: 'Game Details' }} />
    </Stack.Navigator>
  );
}

export default HOMStackNavigator;