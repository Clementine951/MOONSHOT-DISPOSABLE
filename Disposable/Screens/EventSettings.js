import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function EventSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.intro}>These settings are unavailable at the moment.</Text>
      <TouchableOpacity onPress={() => { /* Gérer la génération du QR code */ }}>
        <Text style={styles.option}>Generate QR code</Text>
        <Text>Generate a new QR code to share your event.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer le changement de durée */ }}>
        <Text style={styles.option}>Change duration</Text>
        <Text>You want to reduce or expand the time of your event.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer le changement du nombre de photos */ }}>
        <Text style={styles.option}>Change number of photos</Text>
        <Text>You want to have more or less photos.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer le changement du temps de révélation */ }}>
        <Text style={styles.option}>Change release time</Text>
        <Text>You want to change the time of the photo release.</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity onPress={() => { /* Gérer le blocage d'un participant */ }}>
        <Text style={styles.option}>Block a participant</Text>
        <Text>You want to block a participant from your event.</Text>
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
  intro: {
    fontSize: 20,
    paddingVertical: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});

export default EventSettingsScreen;
