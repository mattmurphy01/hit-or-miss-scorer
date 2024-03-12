import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Game, Player } from '../types/types';
import RoundModal from '../components/RoundModal';
import { updatePlayersScoresInFirestore } from '../utils/firestoreUtils';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const GameScreen: React.FC<{ route: any }> = ({ route }) => {
  // const { game } = route.params;
  const gameId = route.params.game.id;
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'games', gameId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const gameData = { id: docSnapshot.id, ...docSnapshot.data() } as Game;
        setGame(gameData);
      } else {
        console.log("No game found");
        setGame(null);
      }
    });

    return () => unsubscribe();
  }, [gameId]);

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(-2)}`;
  }
  const [isHitModalVisible, setIsHitModalVisible] = useState(false);
  const [isMissModalVisible, setIsMissModalVisible] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<{ [key: string]: boolean }>({});
  const [mainPlayerName, setMainPlayerName] = useState('');
  const [mainPlayerId, setMainPlayerId] = useState<string | null>(null);

  const handleHitPress = (playerName: string, playerId: string) => {
    setMainPlayerName(playerName);
    setMainPlayerId(playerId);
    // Initialize or reset the selection state, excluding the main player
    const initialSelections: { [key: string]: boolean } = {};
    if (game) {
      game.players.forEach((player: Player) => {
        if (player.id !== playerId) {
          initialSelections[player.id] = false;
        }
      });
    }
    setSelectedPlayers(initialSelections);
    setIsHitModalVisible(true);
  };

  const confirmHitSelections = async () => {
    if (game) {
      const additionalScoreForMainPlayer = Object.values(selectedPlayers).filter(isSelected => isSelected).length;
      const updatedPlayers = game.players.map((player: Player) => {
        if (selectedPlayers[player.id]) {
          return { ...player, score: player.score + 1 };
        } else if (player.id === mainPlayerId) {
          return { ...player, score: player.score + additionalScoreForMainPlayer };
        }
        return player;
      });
      try {
        await updatePlayersScoresInFirestore(gameId, updatedPlayers);
      } catch (error) {
        console.error("Failed to update scores:", error);
      }
    } else {
      console.error("Game or game ID is undefined.");
    }

    setIsHitModalVisible(false);
    setSelectedPlayers({});
  };

  const handleMissPress = (playerName: string, playerId: string) => {
    setMainPlayerName(playerName);
    setMainPlayerId(playerId);
    // Initialize or reset the selection state, excluding the main player
    const initialSelections: { [key: string]: boolean } = {};
    if (game) {
      game.players.forEach((player: Player) => {
        if (player.id !== playerId) {
          initialSelections[player.id] = false;
        }
      });
    }
    setSelectedPlayers(initialSelections);
    setIsMissModalVisible(true);
  };

  const confirmMissSelections = async () => {
    if (game) {
      const totalOtherPlayers = game.players.length - 1;
      const numberOfSelectedPlayers = Object.values(selectedPlayers).filter(isSelected => isSelected).length;
      const additionalScoreForMainPlayer = totalOtherPlayers - numberOfSelectedPlayers;
      const updatedPlayers = game.players.map((player: Player) => {
        if (selectedPlayers[player.id]) {
          return { ...player, score: player.score + 3 };
        } else if (player.id === mainPlayerId) {
          return { ...player, score: player.score + additionalScoreForMainPlayer };
        }
        return player;
      });
      try {
        await updatePlayersScoresInFirestore(gameId, updatedPlayers);
      } catch (error) {
        console.error("Failed to update scores:", error);
      }
    } else {
      console.error("Game or game ID is undefined.");
    }

    setIsMissModalVisible(false);
    setSelectedPlayers({});
  };
  
  return (
    <View style={styles.container}>
      {game && (
        <View>
        <Text style={styles.gameName}>{game.name || 'Game'}</Text>
        <Text style={styles.gameDate}>{formatDate(game.date.toDate())}</Text>
        {game.players.map((player: Player, index: number) => (
          <View key={index} style={styles.playerContainer}>
            <View>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerScore}>{player.score}</Text>
            </View>
            <View style={styles.buttonsContainer}>
              <Button title="Hit" onPress={() => handleHitPress(player.name, player.id)} />
              <Button title="Miss" onPress={() => handleMissPress(player.name, player.id)} />
              <Button title="Edit" onPress={() => {}} />
            </View>
          </View>
        ))}
        <RoundModal
          isVisible={isHitModalVisible}
          onClose={() => setIsHitModalVisible(false)}
          title={`Select all players who had the same item on their list as ${mainPlayerName}`}
          players={game.players.filter((p: Player) => p.id !== mainPlayerId)} // Pass all players except the main player
          mainPlayerName={mainPlayerName}
          selectedPlayers={selectedPlayers}
          togglePlayerSelection={(playerId: string) => {
            setSelectedPlayers(prev => ({ ...prev, [playerId]: !prev[playerId] }));
          }}
          confirmSelections={confirmHitSelections}
        />
        <RoundModal
          isVisible={isMissModalVisible}
          onClose={() => setIsMissModalVisible(false)}
          title={`Select all players who had the same item on their list as ${mainPlayerName}, If no one else had that item just click confirm`}
          players={game.players.filter((p: Player) => p.id !== mainPlayerId)} // Pass all players except the main player
          mainPlayerName={mainPlayerName}
          selectedPlayers={selectedPlayers}
          togglePlayerSelection={(playerId: string) => {
            setSelectedPlayers(prev => ({ ...prev, [playerId]: !prev[playerId] }));
          }}
          confirmSelections={confirmMissSelections}
        />
        </View>
      )}
    </View>
  )
}

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  gameName: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gameDate: {
    textAlign: 'center',
    marginBottom: 20,
  },
  playerContainer: {
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: {
    marginRight: 1, // Adds spacing between the name and the score
  },
  playerScore: {
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});