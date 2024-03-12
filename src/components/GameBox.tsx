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
    <TouchableOpacity onPress={() => navigation.navigate('GameScreen', { game })}>
      <View style={styles.container}>
        <Text style={styles.gameTitle}>{game.name || formatDate(game.date)}</Text>
        {sortedPlayers.map((player, index) => (
          <View key={index} style={styles.playerRow}>
            <Text>{player.name}: </Text>
            <Text>{player.score}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  gameTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});

export default GameBox;