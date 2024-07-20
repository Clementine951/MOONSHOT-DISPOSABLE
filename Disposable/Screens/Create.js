import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, StyleSheet, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { TextInput, List, Button, SegmentedButtons, Checkbox } from 'react-native-paper';
import { EventContext } from './EventContext';
import { db } from '../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';

function CreatePage({ navigation }) {
  const [eventName, setEventName] = useState('');
  const [start, setStart] = useState('');
  const [duration, setDuration] = useState('');
  const [reveal, setReveal] = useState('');
  const [numberOfPhotos, setNumberOfPhotos] = useState('');
  const [userName, setUserName] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { setEventDetails, deviceId, setUserName: setContextUserName, setUserRole } = useContext(EventContext);

  useEffect(() => {
    if (eventName && start && duration && reveal && numberOfPhotos && userName && acceptTerms) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [eventName, start, duration, reveal, numberOfPhotos, userName, acceptTerms]);

  const handleValidate = async () => {
    let revealTime = null;
    const durationInHours = parseInt(duration, 10);

    if (reveal === 'revealEnd') {
      revealTime = new Date(Date.now() + durationInHours * 3600 * 1000);
      if (isNaN(revealTime.getTime())) {
        Alert.alert('Error', 'Invalid reveal time calculated.');
        return;
      }
    } else if (reveal === 'revealNow'){
      revealTime = new Date(Date.now() + durationInHours * 3600 * 1000); // Set reveal time to be the end of the event duration
      if (isNaN(revealTime.getTime())) {
        Alert.alert('Error', 'Invalid reveal time calculated.');
        return;
      }
    }

    const eventId = `${eventName}_${Date.now()}`;

    const eventDetails = {
      eventId,
      eventName,
      start,
      duration: durationInHours,
      reveal,
      numberOfPhotos: parseInt(numberOfPhotos, 10),
      revealTime: revealTime.toISOString(), // Ensure the time is stored as a string in ISO format
      userName,
    };

    try {
      console.log('Event Name:', eventName);
      console.log('Device ID:', deviceId);

      if (!eventName || !deviceId){
        throw new Error('Event name or device ID is missing');
      }

      const eventDocRef = doc(db, 'events', eventId);
      await setDoc(eventDocRef, eventDetails);

      const participantDocRef = doc(collection(db, 'events', eventId, 'participants'), deviceId);
      await setDoc(participantDocRef, {
        userId: deviceId,
        role: 'organizer',
        name: userName,
      });

      setEventDetails(eventDetails);
      setContextUserName(userName);
      setUserRole('organizer');

      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error saving event details to Firestore:', error);
      Alert.alert('Error', 'Failed to save event details. Please try again.');
    }
  };

  return (
    <ScrollView>
      <TextInput
        label="Your name / pseudo"
        value={userName}
        onChangeText={(text) => setUserName(text)}
      />

      <TextInput
        label="The event's name"
        value={eventName}
        onChangeText={(text) => setEventName(text)}
      />

      <List.Section title={`Start of the event`}>
        <SegmentedButtons
          onValueChange={(value) => setStart(value)}
          value={start}
          density="medium"
          buttons={[
            { style: { flex: 1 }, value: 'startNow', label: 'Now' },
            { style: { flex: 1 }, disabled: true, value: 'startLater', label: 'Start Later' },
          ]}
        />
      </List.Section>

      <List.Section title={`Duration of the event`}>
        <SegmentedButtons
          onValueChange={(value) => setDuration(value)}
          value={duration}
          density="medium"
          buttons={[
            { style: { flex: 1 }, value: '8', label: '8h' },
            { style: { flex: 1 }, value: '12', label: '12h' },
            { style: { flex: 1 }, value: '24', label: '24h' },
            { style: { flex: 1 }, value: '48', label: '48h' },
          ]}
        />
      </List.Section>

      <List.Section title={`Reveal of the photo`}>
        <SegmentedButtons
          onValueChange={(value) => setReveal(value)}
          value={reveal}
          density="medium"
          buttons={[
            { style: { flex: 1 }, value: 'revealNow', label: 'Now' },
            { style: { flex: 1 }, value: 'revealEnd', label: 'At the end' },
          ]}
        />
      </List.Section>

      <List.Section title={`Number of photos`}>
        <SegmentedButtons
          onValueChange={(value) => setNumberOfPhotos(value)}
          value={numberOfPhotos}
          density="medium"
          buttons={[
            { style: { flex: 1 }, value: '10', label: '10' },
            { style: { flex: 1 }, value: '15', label: '15' },
            { style: { flex: 1 }, value: '25', label: '25' },
          ]}
        />
      </List.Section>

      <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)} style={styles.checkboxContainer}>
        <Checkbox
          status={acceptTerms ? 'checked' : 'unchecked'}
          onPress={() => setAcceptTerms(!acceptTerms)}
        />
        <Text style={styles.checkboxLabel}>
          Accept <Text style={styles.link} onPress={() => Linking.openURL('https://sites.google.com/view/disposable-app/terms-co')}>Terms and Conditions</Text> and <Text style={styles.link} onPress={() => Linking.openURL('https://sites.google.com/view/disposable-app/privacy')}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        disabled={isButtonDisabled}
        style={{ marginTop: 16 }}
        buttonColor='#09745F'
        onPress={handleValidate}
      >
        Validate
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
  link: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default CreatePage;
