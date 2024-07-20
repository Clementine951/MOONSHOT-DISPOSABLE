import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { EventContext } from './EventContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';

function JoinPage({ navigation }) {
  // State variables
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [eventId, setEventId] = useState('');
  const [userName, setUserName] = useState('');
  const [eventDetails, setEventDetails] = useState(null);
  const [inputMode, setInputMode] = useState('');

  // Context to manage global state
  const { 
    setEventDetails: setContextEventDetails, 
    setUserName: setContextUserName, 
    deviceId, 
    setUserRole 
  } = useContext(EventContext);

  useEffect(() => {
    // Request camera permissions on component mount
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted'); // Update permission state
    })();
  }, []);

  const fetchEventDetails = async (id) => {
    // Function to fetch event details from Firestore
    try {
      const trimmedId = id.trim(); // Trim whitespace from entered event ID
      const eventDocRef = doc(db, 'events', trimmedId); // Reference to event document in Firestore
      const eventDoc = await getDoc(eventDocRef); // Fetch event document
      if (eventDoc.exists()) {
        setEventDetails(eventDoc.data()); // Update event details state
      } else {
        Alert.alert('Error', 'Event not found. Please check the event ID.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch event details. Please try again.');
    }
  };

  const handleJoinEvent = async () => {
    // Function to handle joining the event
    if (!userName) {
      Alert.alert('Error', 'Please enter your name / pseudo.');
      return;
    }

    if (!eventId) {
      Alert.alert('Error', 'Please enter a valid event ID.');
      return;
    }

    try {
      const participantDocRef = doc(collection(db, 'events', eventId, 'participants'), deviceId); // Reference to participant document
      await setDoc(participantDocRef, {
        userId: deviceId,
        role: 'participant',
        name: userName,
      });

      setContextEventDetails(eventDetails); // Update global event details state
      setContextUserName(userName); // Update global user name state
      setUserRole('participant'); // Update global user role state

      navigation.navigate('HomeScreen'); // Navigate to HomeScreen
    } catch (error) {
      Alert.alert('Error', 'Failed to join event. Please try again.');
    }
  };

  const handleInputModeChange = (mode) => {
    // Function to handle changing input mode
    setInputMode(mode);
    setEventId(''); // Reset event ID
    setEventDetails(null); // Reset event details
    setUserName(''); // Reset user name
    setScanned(false); // Reset scanned state
  };

  // If input mode is 'scan', render the camera view for scanning QR codes
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
          {/* Option to scan QR Code or manually enter event ID */}
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

// Define styles for the component
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
