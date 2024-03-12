import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Game } from '../types/types';
import { Timestamp } from 'firebase/firestore';
import { NavigationProp } from '@react-navigation/native';

interface GameBoxProps {
  game: Game;
  navigation: any;
}

const GameBox: React.FC<GameBoxProps> = ({ game, navigation }) => {
  const formatDate = (date: Timestamp) => {
    const jsDate = new Date(date.seconds * 1000);
    return jsDate.toLocaleDateString();
  };
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('GameScreen', { game })} style={styles.touchableContainer}>
      <View style={styles.container}>
        <Text style={styles.gameTitle}>{game.name || formatDate(game.date)}</Text>
        {sortedPlayers.map((player, index) => (
          <View key={index} style={styles.playerRow}>
            <Text style={styles.playerName}>{player.name}: </Text>
            <Text style={styles.playerScore}>{player.score}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: 8, // Ensures the touchable opacity respects the border radius
    overflow: 'hidden', // Ensures the ripple effect is contained within the border radius bounds
  },
  container: {
    padding: 20,
    margin: 10,
    backgroundColor: '#333', // Dark background for the game box
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#FFF', // Light text color for dark mode
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  playerName: {
    color: '#CCC', // Light grey color for player names
  },
  playerScore: {
    color: '#FFF', // White color for scores to ensure visibility
  },
});

export default GameBox;