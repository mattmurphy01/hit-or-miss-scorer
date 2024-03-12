// src/utils/firestoreUtils.ts
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Player } from '../types/types'; // Adjust import path as needed

/**
 * Updates player scores in Firestore.
 * @param gameId The ID of the game document.
 * @param updatedPlayers Array of players with updated scores.
 */
export const updatePlayersScoresInFirestore = async (gameId: string, updatedPlayers: Player[]): Promise<void> => {
  console.log("Updating scores for game ID:", gameId);
  // console.log("Updated players:", JSON.stringify(updatedPlayers, null, 2)); 
  const gameRef = doc(db, 'games', gameId);
  try {
    await updateDoc(gameRef, {
      players: updatedPlayers
    });
    console.log("Players' scores updated successfully.");
  } catch (error) {
    console.error("Failed to update players' scores in Firestore:", error);
    throw error; // Rethrow the error if handling is needed at the call site
  }
};