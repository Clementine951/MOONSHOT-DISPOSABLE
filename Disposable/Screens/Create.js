import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, StyleSheet, Text, TouchableOpacity, Linking, ScrollView, Dimensions } from 'react-native';
import { TextInput, List, Button, SegmentedButtons, Checkbox } from 'react-native-paper';
import { EventContext } from './EventContext';
import { addFirestoreDocument, fetchFirestoreData } from '../firebaseApi'; // Use REST API utilities

// Get screen dimensions
const { width, height } = Dimensions.get('window');

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
    const durationInHours = parseInt(duration, 10);
    const revealTime = new Date(Date.now() + durationInHours * 3600 * 1000).toISOString();
    const eventId = `${eventName}_${Date.now()}`;
  
    const eventDetails = {
      eventId: { stringValue: eventId },
      eventName: { stringValue: eventName },
      start: { stringValue: start },
      duration: { integerValue: durationInHours },
      reveal: { stringValue: reveal },
      numberOfPhotos: { integerValue: parseInt(numberOfPhotos, 10) },
      revealTime: { stringValue: revealTime },
      userName: { stringValue: userName },
    };
  
    try {
      await addFirestoreDocument(`events/${eventId}`, eventDetails);
  
      const parsedEventDetails = parseFirestoreFields(eventDetails); // Parse Firestore fields
      console.log('Parsed Event Details:', parsedEventDetails);
  
      setEventDetails(parsedEventDetails);
      setContextUserName(userName);
      setUserRole('organizer');
  
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };
  
  
  const pollForAppClipURL = async (eventId) => {
    try {
      const interval = setInterval(async () => {
        const eventData = await fetchFirestoreData(`events/${eventId}`);
        if (eventData.fields?.appClipURL) {
          clearInterval(interval);
          Alert.alert('App Clip URL Generated', eventData.fields.appClipURL.stringValue);
        }
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      console.error('Error polling for App Clip URL:', error);
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
          density={width > 768 ? 'large' : 'medium'}
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
          density={width > 768 ? 'large' : 'medium'}
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
          density={width > 768 ? 'large' : 'medium'}
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
          density={width > 768 ? 'large' : 'medium'}
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
