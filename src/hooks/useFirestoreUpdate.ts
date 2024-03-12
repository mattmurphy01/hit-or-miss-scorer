// src/hooks/useFirestoreUpdate.ts
import { useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Player } from '../types/types'; // Adjust import path as needed

export const useFirestoreUpdate = () => {
  const updatePlayersScores = useCallback(async (gameId: string, updatedPlayers: Player[]): Promise<void> => {
    const gameRef = doc(db, 'games', gameId);
    try {
      await updateDoc(gameRef, {
        players: updatedPlayers
      });
      console.log("Players' scores updated successfully.");
    } catch (error) {
      console.error("Failed to update players' scores in Firestore:", error);
      throw error; // Allows for error handling in the component
    }
  }, []);

  return { updatePlayersScores };
};
