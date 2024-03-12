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
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput placeholder="Game Name (Optional)" placeholderTextColor="#ccc" value={gameName} onChangeText={setGameName} style={styles.input} />
          {playerInputs.map((input, index) => (
            <View key={input.id} style={styles.playerInputContainer}>
              <TextInput
                placeholder={`Player ${index + 1} Name`}
                placeholderTextColor="#ccc"
                value={input.name}
                onChangeText={text =>
                  setPlayerInputs(current =>
                    current.map(i => (i.id === input.id ? { ...i, name: text } : i))
                  )
                }
                style={[styles.input, { flex: 1, marginRight: 10 }]}
              />
              <TouchableOpacity onPress={() => removePlayerInput(input.id)} style={styles.removeButton}>
                <Text style={styles.buttonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={addPlayerInput}>
            <Text style={styles.buttonText}>Add Another Player</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAddGame}>
            <Text style={styles.buttonText}>Add Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginBottom: 10,
  },
  playerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  removeButton: {
    backgroundColor: '#D32F2F',
    padding: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },

});

export default AddGameModal;
