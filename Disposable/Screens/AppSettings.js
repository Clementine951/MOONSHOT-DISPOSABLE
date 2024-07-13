import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function AppSettingsScreen() {
  return (
    <View style={styles.container}>
        <Text style={styles.intro}>These settings are unavailable at the moment.</Text>
      <TouchableOpacity onPress={() => { /* Gérer la génération du QR code */ }}>
        <Text style={styles.option}>Dark mode</Text>
        <Text>Switch to dark mode for a better experience.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer la génération du QR code */ }}>
        <Text style={styles.option}>Tutorial</Text>
        <Text>An easy to follow tutorial to get along with Disposable.</Text>
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
    fontSize: 18,
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
        fontSize: 20,
        paddingVertical: 15,
    },
});

export default AppSettingsScreen;
