import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import { StyleSheet, Text, View } from 'react-native';
import GameScoresScreen from './src/screens/GameScoresScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import GameScreen from './src/screens/GameScreen';
import BottomTabNavigator from './src/components/BottomTabNavigator';

// const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <BottomTabNavigator />
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