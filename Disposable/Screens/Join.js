import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { EventContext } from './EventContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

function JoinPage({ navigation }) {
  const [eventId, setEventId] = useState('');
  const [userName, setUserName] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const { setEventDetails: setContextEventDetails, setUserName: setContextUserName, deviceId } = useContext(EventContext);

  const fetchEventDetails = async (id) => {
    try {
      console.log("Fetching Event Details for ID: ", id);
      const eventDocRef = doc(db, 'events', id.trim());
      const eventDoc = await getDoc(eventDocRef);
      if (eventDoc.exists()) {
        console.log("Event Details: ", eventDoc.data());
        setEventDetails(eventDoc.data());
      } else {
        console.error('Event not found for ID:', id);
        Alert.alert('Error', 'Event not found. Please check the event ID.');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', 'Failed to fetch event details. Please try again.');
    }
  };

  const handleJoinEvent = async () => {
    if (!userName) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    if (!eventId) {
      Alert.alert('Error', 'Please enter a valid event ID.');
      return;
    }

    try {
      const participantDocRef = doc(collection(db, 'events', eventId, 'participants'), deviceId);
      await setDoc(participantDocRef, {
        userId: deviceId,
        role: 'participant',
        name: userName,
      });

      setContextEventDetails(eventDetails);
      setContextUserName(userName);

      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error joining event:', error);
      Alert.alert('Error', 'Failed to join event. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {eventDetails ? (
        <>
          <Text style={styles.label}>Event Name: {eventDetails.eventName}</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={userName}
            onChangeText={setUserName}
          />
          <Button title="Join Event" onPress={handleJoinEvent} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Event ID"
            value={eventId}
            onChangeText={(text) => setEventId(text.trim())}
          />
          <Button title="Fetch Event Details" onPress={() => fetchEventDetails(eventId)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default JoinPage;
