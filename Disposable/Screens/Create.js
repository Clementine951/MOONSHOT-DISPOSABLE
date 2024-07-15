import React, { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, List, Button, SegmentedButtons } from 'react-native-paper';
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

  const { setEventDetails, deviceId, setUserName: setContextUserName, setUserRole } = useContext(EventContext);

  useEffect(() => {
    if (eventName && start && duration && reveal && numberOfPhotos && userName) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [eventName, start, duration, reveal, numberOfPhotos, userName]);

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
      revealTime = new Date(Date.now());
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
      revealTime,
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
    <View>
      <TextInput
        label="Your name"
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

      <List.Section title={`Photos reveal`}>
        <SegmentedButtons
          onValueChange={(value) => setReveal(value)}
          value={reveal}
          density="medium"
          buttons={[
            { style: { flex: 1 }, value: 'revealNow', label: 'Immediately' },
            { style: { flex: 1 }, value: 'revealEnd', label: 'At the end' },
          ]}
        />
      </List.Section>

      <List.Section title={`Photos per person`}>
        <SegmentedButtons
          onValueChange={(value) => setNumberOfPhotos(value)}
          value={numberOfPhotos}
          density="medium"
          buttons={[
            { style: { flex: 1 }, value: '5', label: '5' },
            { style: { flex: 1 }, value: '10', label: '10' },
            { style: { flex: 1 }, value: '15', label: '15' },
            { style: { flex: 1 }, value: '20', label: '20' },
          ]}
        />
      </List.Section>

      <List.Section>
        <Button
          mode="contained-tonal"
          buttonColor='#09745F'
          textColor='#FFF7F1'
          onPress={handleValidate}
          style={{ margin: 5 }}
          disabled={isButtonDisabled}
        >
          Validate
        </Button>
      </List.Section>
    </View>
  );
}

export default CreatePage;
