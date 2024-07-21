import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

function EventSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.intro}>These settings are unavailable at the moment.</Text>
      <TouchableOpacity onPress={() => { /* Gérer la génération du QR code */ }}>
        <Text style={styles.option}>Generate QR code</Text>
        <Text style={styles.description}>Generate a new QR code to share your event.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer le changement de durée */ }}>
        <Text style={styles.option}>Change duration</Text>
        <Text style={styles.description}>You want to reduce or expand the time of your event.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer le changement du nombre de photos */ }}>
        <Text style={styles.option}>Change number of photos</Text>
        <Text style={styles.description}>You want to have more or less photos.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer le changement du temps de révélation */ }}>
        <Text style={styles.option}>Change release time</Text>
        <Text style={styles.description}>You want to change the time of the photo release.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer le blocage d'un participant */ }}>
        <Text style={styles.option}>Block a participant</Text>
        <Text style={styles.description}>You want to block a participant from your event.</Text>
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
  intro: {
    fontSize: width > 768 ? 40 : 20,
    paddingVertical: width > 768 ? 30 : 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  description: {
    fontSize: width > 768 ? 20 : 12,
    paddingVertical: width > 768 ? 15 : 0,
    color: 'grey'
  }
});

export default EventSettingsScreen;
