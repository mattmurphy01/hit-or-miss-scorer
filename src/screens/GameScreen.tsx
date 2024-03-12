import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Game, Player } from '../types/types';
import RoundModal from '../components/RoundModal';
import { updatePlayersScoresInFirestore } from '../utils/firestoreUtils';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import EditModal from '../components/EditModal';
import { Ionicons } from '@expo/vector-icons';

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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState<{ [key: string]: boolean }>({});
  const [mainPlayerName, setMainPlayerName] = useState('');
  const [mainPlayerId, setMainPlayerId] = useState<string | null>(null);
  const [editingPlayerScore, setEditingPlayerScore] = useState<number>(0);

  const handleEditPress = (playerName: string, playerId: string, playerScore: number) => {
    setMainPlayerName(playerName);
    setMainPlayerId(playerId);
    setEditingPlayerScore(playerScore)
    setIsEditModalVisible(true);
  };

  const updatePlayerScore = async (newScore: number) => {
    if (game && mainPlayerId) {
      const updatedPlayers = game.players.map((player) => {
        if (player.id === mainPlayerId) {
          return { ...player, score: newScore };
        }
        return player;
      });

      try {
        await updatePlayersScoresInFirestore(game.id, updatedPlayers);
        setIsEditModalVisible(false);
      } catch (error) {
        console.error("Failed to update player score:", error);
      }
    }
  };

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
        <>
          <Text style={styles.gameName}>{game.name || 'Game'}</Text>
          <Text style={styles.gameDate}>{formatDate(game.date.toDate())}</Text>
          {game.players.map((player: Player, index: number) => (
            <View key={index} style={styles.playerRow}>
              <Text style={styles.playerInfo}>{player.name} - {player.score}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} onPress={() => handleHitPress(player.name, player.id)}>
                  <Text style={styles.buttonText}>Hit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleMissPress(player.name, player.id)}>
                  <Text style={styles.buttonText}>Miss</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleEditPress(player.name, player.id, player.score)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
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
        <EditModal 
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          playerName={mainPlayerName}
          playerScore={editingPlayerScore}
          updateScore={updatePlayerScore}
        />
        </>
      )}
    </View>
  )
}

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark mode background
  },
  gameName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Text color for dark mode
    textAlign: 'center',
    marginBottom: 10,
  },
  gameDate: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    padding: 10,
    borderRadius: 5,
  },
  playerInfo: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2C2C2E', // Slightly lighter than container for contrast
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});