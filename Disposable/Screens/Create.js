import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { TextInput, List, Button, SegmentedButtons, Checkbox } from 'react-native-paper';
import { EventContext } from './EventContext';
import { db } from '../firebaseConfig';
import { doc, setDoc, collection } from 'firebase/firestore';
import { Linking, TouchableOpacity, Text } from 'react-native';

function CreatePage({ navigation }) {
  const [eventId, setEventId] = useState('');
  const [eventName, setEventName] = useState('');
  const [start, setStart] = useState('');
  const [duration, setDuration] = useState('');
  const [reveal, setReveal] = useState('');
  const [numberOfPhotos, setNumberOfPhotos] = useState('');
  const [userName, setUserName] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const { setEventDetails, deviceId, setUserName: setContextUserName } = useContext(EventContext);

  useEffect(() => {
    if (eventId, eventName && start && duration && reveal && numberOfPhotos && userName && acceptTerms) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [eventId, eventName, start, duration, reveal, numberOfPhotos, userName, acceptTerms]);

  const handleValidate = async () => {
    let revealTime = null;
    const durationInHours = parseInt(duration, 10);
    setEventId(eventId);

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
      duration: durationInHours, // Store duration as number of hours
      reveal,
      numberOfPhotos: parseInt(numberOfPhotos, 10), // Ensure number is parsed as integer
      revealTime,
      userName,
    };

    try {
      console.log('Event Name:', eventName);
      console.log('Device ID:', deviceId);

      if (!eventName || !deviceId){
        throw new Error('Event name or device ID is missing');
      }

      // Save event details to Firestore
      const eventDocRef = doc(db, 'events', eventId);
      await setDoc(eventDocRef, eventDetails);

      // Add the user as a participant
      const participantDocRef = doc(collection(db, 'events', eventId, 'participants'), deviceId);
      await setDoc(participantDocRef, {
        userId: deviceId,
        role: 'organizer',
        name: userName,
      });

      // Save event details to context
      setEventDetails(eventDetails);
      setContextUserName(userName);

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
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={acceptTerms ? 'checked' : 'unchecked'}
            onPress={() => setAcceptTerms(!acceptTerms)}
          />
          <Text onPress={() => setAcceptTerms(!acceptTerms)}>
            I accept the 
            <TouchableOpacity onPress={() => Linking.openURL('https://sites.google.com/view/disposable-app/terms-co')}>
              <Text style={styles.link}> Terms and Conditions </Text>
            </TouchableOpacity>
            and
            <TouchableOpacity onPress={() => Linking.openURL('https://sites.google.com/view/disposable-app/privacy')}>
              <Text style={styles.link}> Privacy Policy </Text>
            </TouchableOpacity>
          </Text>
        </View>
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

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  link: {
    color: '#09745F',
    textDecorationLine: 'underline',
  },
});

export default CreatePage;
