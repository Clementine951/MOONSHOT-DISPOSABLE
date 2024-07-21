import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

function AppSettingsScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.intro}>These settings are unavailable at the moment.</Text>
      <TouchableOpacity onPress={() => { /* Gérer la génération du QR code */ }}>
        <Text style={styles.option}>Dark mode</Text>
        <Text style={styles.description}>Switch to dark mode for a better experience.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer la génération du QR code */ }}>
        <Text style={styles.option}>Tutorial</Text>
        <Text style={styles.description}>An easy to follow tutorial to get along with Disposable.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  option: {
    fontSize: width > 768 ? 30 : 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    color: 'grey'
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  intro: {
    fontSize: width > 768 ? 40 : 20,
    paddingVertical: width > 768 ? 30 : 15,
  },
  description: {
    fontSize: width > 768 ? 20 : 12,
    paddingVertical: width > 768 ? 15 : 0,
    color: 'grey'
  }
});

export default AppSettingsScreen;
