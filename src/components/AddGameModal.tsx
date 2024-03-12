import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; 
import { v4 as uuidv4 } from 'uuid';

interface PlayerInput {
  id: string;
  name: string;
}

const AddGameModal: React.FC<{ isVisible: boolean; onClose: () => void, onGameAdded: () => void }> = ({ isVisible, onClose, onGameAdded }) => {
  const [gameName, setGameName] = useState<string>('');
  const [playerInputs, setPlayerInputs] = useState<PlayerInput[]>([
    { id: uuidv4(), name: '' },
    { id: uuidv4(), name: '' },
    { id: uuidv4(), name: '' },
  ]);

  const addPlayerInput = () => {
    setPlayerInputs(currentInputs => [...currentInputs, { id: uuidv4(), name: '' }]);
  };

  const removePlayerInput = (id: string) => {
    setPlayerInputs(currentInputs => currentInputs.filter(input => input.id !== id));
  };

  const handleAddGame = async () => {
    if (playerInputs.length < 3) {
      alert('You must add at least 3 players.');
      return;
    }

    const gameData = {
      name: gameName || null,
      date: Timestamp.fromDate(new Date()),
      players: playerInputs.map(player => ({ id: player.id, name: player.name, score: 0 })),
    };

    try {
      await addDoc(collection(db, 'games'), gameData);
      onClose(); // Close modal on success
      onGameAdded();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalView}>
        <TextInput placeholder="Game Name (Optional)" value={gameName} onChangeText={setGameName} style={styles.input} />
        {playerInputs.map((input, index) => (
          <View key={input.id} style={styles.playerInputContainer}>
            <TextInput
              placeholder={`Player ${index + 1} Name`}
              value={input.name}
              onChangeText={text =>
                setPlayerInputs(current =>
                  current.map(i => (i.id === input.id ? { ...i, name: text } : i))
                )
              }
              style={styles.input}
            />
            <TouchableOpacity onPress={() => removePlayerInput(input.id)} style={styles.removeButton}>
              <Text>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <Button title="Add Another Player" onPress={addPlayerInput} />
        <Button title="Add Game" onPress={handleAddGame} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    marginTop: 50,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
  },
  playerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    marginLeft: 10,
  },
});

export default AddGameModal;
