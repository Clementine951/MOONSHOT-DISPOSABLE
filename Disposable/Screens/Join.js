import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { EventContext } from './EventContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

function JoinPage({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [eventId, setEventId] = useState('');
  const [userName, setUserName] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const [inputMode, setInputMode] = useState(''); // 'scan' or 'manual'
  const { setEventDetails: setContextEventDetails, setUserName: setContextUserName, deviceId, setUserRole } = useContext(EventContext);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchEventDetails = async (id) => {
    try {
      console.log("Fetching Event Details for ID: ", id);
      const trimmedId = id.trim();
      console.log("Trimmed Event ID: ", trimmedId);
      const eventDocRef = doc(db, 'events', trimmedId);
      console.log("Event Doc Ref: ", eventDocRef.path);
      const eventDoc = await getDoc(eventDocRef);
      if (eventDoc.exists()) {
        console.log("Event Details: ", eventDoc.data());
        setEventDetails(eventDoc.data());
      } else {
        console.error('Event not found for ID:', trimmedId);
        Alert.alert('Error', 'Event not found. Please check the event ID.');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      Alert.alert('Error', 'Failed to fetch event details. Please try again.');
    }
  };

  const handleJoinEvent = async () => {
    if (!userName) {
      Alert.alert('Error', 'Please enter your name / pseudo.');
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
      setUserRole('participant');

      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error joining event:', error);
      Alert.alert('Error', 'Failed to join event. Please try again.');
    }
  };

  const handleInputModeChange = (mode) => {
    setInputMode(mode);
    setEventId('');
    setEventDetails(null);
    setUserName('');
    setScanned(false);
  };

  if (inputMode === 'scan') {
    return (
      <View style={{ flex: 1 }}>
        {hasPermission === null ? (
          <Text>Requesting for camera permission</Text>
        ) : hasPermission === false ? (
          <Text>No access to camera</Text>
        ) : (
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {scanned && (
          <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {eventDetails ? (
        <>
          <Text style={styles.eventName}>{eventDetails.eventName}</Text>
          <TextInput
            label="Your name"
            value={userName}
            onChangeText={setUserName}
          />
          <Button 
            mode="contained" 
            style={styles.button}
            buttonColor='#09745F'
            onPress={handleJoinEvent} 
          >
            Join the event
          </Button>
        </>
      ) : (
        <>
          {/* <Button title="Scan QR Code" onPress={() => handleInputModeChange('scan')} /> */}
          <TextInput
            label="Enter the event ID"
            value={eventId}
            onChangeText={(text) => setEventId(text.trim())}
          />
          <Button 
            mode="contained"
            style={styles.button}
            buttonColor='#09745F'
            onPress={() => fetchEventDetails(eventId)}
          >
            Join the event
          </Button>
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
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#09745F',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#09745F',
  },
});

export default JoinPage;
