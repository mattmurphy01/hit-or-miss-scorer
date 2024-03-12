import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Game } from '../types/types';
import GameBox from '../components/GameBox';
import { collection, getDocs, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import AddGameModal from '../components/AddGameModal';
import { Ionicons } from '@expo/vector-icons';

const GameScoresScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [addGameModalVisible, setAddGameModalVisible] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(collection(db, 'games'));
        const querySnapshot = await getDocs(q);
        const fetchedGames: Game[] = [];
        querySnapshot.forEach((doc) => {
          const game = doc.data() as Game;
          game.id = doc.id;
          fetchedGames.push(game);
        });
        setGames(fetchedGames);
      } catch (error) {
        console.error("Failed to fetch game data:", error);
      }
    };
    fetchGames();
  }, [refresh]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "games"), (snapshot) => {
      const gamesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Game[];
      setGames(gamesList);
    });
  
    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);
  
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.container}>
        {games.map((game) => (
          <GameBox key={game.id} game={game} navigation={navigation}/>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => setAddGameModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color="white" />
      </TouchableOpacity>
      <AddGameModal isVisible={addGameModalVisible} onClose={() => setAddGameModalVisible(false)} onGameAdded={() => setRefresh(prev => !prev)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  container: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    padding: 10,
    backgroundColor: '#1E88E5', // A shade of blue that stands out against the dark background
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60, // Increase width for a circular button
    height: 60, // Increase height for a circular button
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default GameScoresScreen;