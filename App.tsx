import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import { StyleSheet, Text, View } from 'react-native';
import GameScoresScreen from './src/screens/GameScoresScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import GameScreen from './src/screens/GameScreen';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
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
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;