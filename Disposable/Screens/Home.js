import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { EventContext } from './EventContext';

function HomeScreen({ navigation }) {
  const { eventDetails } = useContext(EventContext);

  if (eventDetails) {
    // Render the event details screen
    return (
      <View style={styles.container}>
        <Text style={styles.eventName}>{eventDetails.event}</Text>
        <Text style={styles.eventInfo}>XX participants</Text>
        <Text style={styles.eventInfo}>{eventDetails.number} photos taken</Text>
        <TouchableOpacity style={styles.eventButton}>
          <Text style={styles.eventButtonText}>Share event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventButton}>
          <Text style={styles.eventButtonText}>End the event</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render the default home screen content with the provided design
  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TouchableOpacity 
        style={styles.createButton} 
        onPress={() => navigation.navigate('CreatePage')}
      >
        <Text style={styles.createButtonText}>Create an event</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.joinButton} 
        onPress={() => navigation.navigate('JoinPage')}
      >
        <Text style={styles.joinButtonText}>Join an event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF', // Adjust as needed
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  createButton: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    width: '80%',
  },
  createButtonText: {
    color: '#09745F',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  joinButton: {
    padding: 15,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    width: '80%',
  },
  joinButtonText: {
    color: '#09745F',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#09745F',
    marginBottom: 20,
  },
  eventInfo: {
    fontSize: 18,
    color: '#09745F',
    marginBottom: 10,
  },
  eventButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#E6E6FA',
    borderRadius: 5,
    width: '80%',
  },
  eventButtonText: {
    color: '#09745F',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;
