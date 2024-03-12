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
          <Text>{title}</Text>
          <FlatList 
            data={players}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.playerItem} 
                onPress={() => togglePlayerSelection(item.id)}
                activeOpacity={0.6}>
                <Text>{item.name}</Text>
                <CheckBox
                  checked={selectedPlayers[item.id]}
                  onPress={() => togglePlayerSelection(item.id)}
                />
              </TouchableOpacity>
            )}
          />
          <Button title='Confirm' onPress={confirmSelections} />
          <Button title='Cancel' onPress={onClose} />
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
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
});