import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Player } from '../types/types';
import { Button } from 'react-native';

interface EditModalProps {
  isVisible: boolean;
  onClose: () => void;
  playerName: string;
  playerScore: number;
  updateScore: (newScore: number) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isVisible,
  onClose,
  playerName,
  playerScore,
  updateScore,
}) => {
  const [score, setScore] = useState<number>(playerScore);

  useEffect(() => {
    setScore(playerScore);
  }, [playerScore]);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const handleDirectScoreChange = (text: string) => {
    const newScore = parseInt(text, 10);
    if (!isNaN(newScore)) {
      setScore(newScore);
    } 
  }

  return (
    <Modal
      visible={isVisible}
      animationType='slide'
      transparent={true}
      onRequestClose={onClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Edit player: {playerName}</Text>
            <TextInput 
              style={styles.scoreInput}
              keyboardType='numeric'
              onChangeText={handleDirectScoreChange}
              value={score.toString()}
              maxLength={3}
            />
            <View style={styles.scoreAdjustmentContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleScoreChange(score - 1)}>
                <Text style={styles.buttonText}>-1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleScoreChange(score + 1)}>
                <Text style={styles.buttonText}>+1</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.scoreAdjustmentContainer}>
              <TouchableOpacity style={styles.button} onPress={() => handleScoreChange(score - 3)}>
                <Text style={styles.buttonText}>-3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleScoreChange(score + 3)}>
                <Text style={styles.buttonText}>+3</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.button} onPress={() => updateScore(score)}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>
  )
}

export default EditModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: '#222222', // Dark theme modal background
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '85%',
  },
  title: {
    color: '#ffffff', // White color for text
    marginBottom: 15,
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#444444', // Updated button color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 5,
  },
  buttonText: {
    color: '#ffffff', // White color for button text
    fontSize: 16,
  },
  scoreInput: {
    backgroundColor: '#333333',
    color: '#ffffff',
    width: '100%',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreAdjustmentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  confirmCancelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%', // Ensuring the confirm and cancel buttons are evenly spaced
    marginTop: 10,
  },
});