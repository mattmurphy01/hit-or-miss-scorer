import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Player } from '../types/types';
import { CheckBox } from 'react-native-elements';

interface RoundModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  players: Player[];
  mainPlayerName: string;
  selectedPlayers: { [key: string]: boolean };
  togglePlayerSelection: (playerId: string) => void;
  confirmSelections: () => void;
}

const RoundModal: React.FC<RoundModalProps> = ({
  isVisible,
  onClose,
  title,
  players,
  mainPlayerName,
  selectedPlayers,
  togglePlayerSelection,
  confirmSelections,
}) => {
  return (
    <Modal
      visible={isVisible}
      animationType='slide'
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList 
            data={players}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.playerItem} 
                onPress={() => togglePlayerSelection(item.id)}
                activeOpacity={0.7}>
                <Text style={styles.playerName}>{item.name}</Text>
                <CheckBox
                  checked={selectedPlayers[item.id]}
                  onPress={() => togglePlayerSelection(item.id)}
                />
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={confirmSelections}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RoundModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: '#222222', // Dark background for the modal
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%', // Ensuring modal width is responsive
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#ffffff', // Text color for dark theme
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  playerName: {
    color: '#ffffff', // Text color for dark theme
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#444444', // Updated button color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});