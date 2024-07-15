import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { EventContext } from './EventContext';
import { db } from '../firebaseConfig';
import { deleteDoc, doc, collection } from 'firebase/firestore';

function HomeScreen({ navigation }) {
  const { eventDetails, clearEventDetails, userName, userRole } = useContext(EventContext);

  const handleEndEvent = async () => {
    Alert.alert(
      "Ending the Event Now",
      "The photos will only be available during 1 hour.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "End Event",
          onPress: async () => {
            try {
              const eventDocRef = doc(db, 'events', eventDetails.eventId);
              await deleteDoc(eventDocRef);

              const participantsRef = collection(db, 'events', eventDetails.eventId, 'participants');
              // Use batch delete for participants and other related data

              clearEventDetails();
              navigation.navigate('HomeScreen');
            } catch (error) {
              console.error('Error ending event:', error);
              Alert.alert('Error', 'Failed to end event. Please try again.');
            }
          }
        },
      ],
      { cancelable: false }
    );
  };

  if (eventDetails && userRole === 'organizer') {
    return (
      <View style={styles.container}>
        <Text style={styles.eventName}>{eventDetails.eventName}</Text>
        <Text style={styles.eventInfo}>{userName}</Text>
        <Text style={styles.eventInfo}>XX participants</Text>
        <Text style={styles.eventInfo}>{eventDetails.numberOfPhotos} photos taken</Text>
        <TouchableOpacity style={styles.eventButton}>
          <Text style={styles.eventButtonText}>Share event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.eventButton} onPress={handleEndEvent}>
          <Text style={styles.eventButtonText}>End the event</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (eventDetails && userRole === 'participant') {
    return (
      <View style={styles.container}>
        <Text>Participant</Text>
      </View>
    );
  }

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
    backgroundColor: '#FFF',
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
    backgroundColor: '#E8D7FF',
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
