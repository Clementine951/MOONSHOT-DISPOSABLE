import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { fetchFirestoreData, updateFirestoreDocument } from '../firebaseApi';
import { EventContext } from './EventContext';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { eventDetails, clearEventDetails, userName, userRole, setEventDetails } = useContext(EventContext);
  const [participantCount, setParticipantCount] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const qrCodeRef = React.useRef(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      if (!eventDetails?.eventId?.stringValue) return;

      try {
        const response = await fetchFirestoreData(`events/${eventDetails.eventId.stringValue}/participants`);
        const participants = response.documents || [];
        setParticipantCount(participants.length);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    const updateCountdown = () => {
      if (eventDetails?.revealTime?.stringValue) {
        const now = new Date();
        const revealTime = new Date(eventDetails.revealTime.stringValue);
        const diff = revealTime - now;

        if (diff <= 0) {
          setCountdown('00:00:00');
        } else {
          const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0');
          const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0');
          const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
          setCountdown(`${hours}:${minutes}:${seconds}`);
        }
      }
    };

    if (eventDetails) {
      fetchParticipants();
      if (eventDetails.revealTime?.stringValue) {
        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);
        return () => clearInterval(intervalId);
      }
    }
  }, [eventDetails]);

  const handleEndEvent = async () => {
    Alert.alert(
      "End Event",
      "This will reveal photos for one hour. Do you want to proceed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString();
            try {
              await updateFirestoreDocument(`events/${eventDetails.eventId.stringValue}`, {
                revealTime: { stringValue: oneHourFromNow },
              });
              setEventDetails({ ...eventDetails, revealTime: { stringValue: oneHourFromNow } });
              navigation.navigate('HomeScreen');
            } catch (error) {
              console.error('Error ending event:', error);
              Alert.alert('Error', 'Could not end the event.');
            }
          },
        },
      ]
    );
  };

  const handleLeaveEvent = () => {
    Alert.alert(
      "Leave Event",
      "Are you sure you want to leave? Your saved photos will remain intact.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          onPress: () => {
            clearEventDetails();
            navigation.navigate('HomeScreen');
          },
        },
      ]
    );
  };

  const handleShareEvent = async () => {
    if (!eventDetails?.eventId?.stringValue) {
      Alert.alert('Error', 'Event ID is missing.');
      return;
    }

    const url = `https://appclip.disposableapp.xyz/clip?eventId=${eventDetails.eventId.stringValue}`;
    qrCodeRef.current.toDataURL(async (data) => {
      try {
        const imageURI = `${FileSystem.documentDirectory}${eventDetails.eventId.stringValue}_QRCode.png`;
        await FileSystem.writeAsStringAsync(imageURI, data, { encoding: FileSystem.EncodingType.Base64 });
        await shareAsync(imageURI, {
          mimeType: 'image/png',
          dialogTitle: 'Share QR Code',
          UTI: 'image/png',
        });
      } catch (error) {
        console.error('Error sharing QR code:', error);
        Alert.alert('Error', 'Could not share QR code.');
      }
    });
  };

  if (!eventDetails) {
    return (
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreatePage')}>
          <Text style={styles.createButtonText}>Create Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton} onPress={() => navigation.navigate('JoinPage')}>
          <Text style={styles.joinButtonText}>Join Event</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{eventDetails.eventName?.stringValue || 'Unknown Event'}</Text>
      <Text style={styles.eventInfo}>Organizer: {userName}</Text>
      <Text style={styles.eventInfo}>{participantCount} Participants</Text>
      <Text style={styles.eventInfo}>{countdown}</Text>
      <View style={styles.qrContainer}>
        <QRCode value={`https://appclip.disposableapp.xyz/clip?eventId=${eventDetails.eventId?.stringValue}`} size={200} getRef={qrCodeRef} />
      </View>
      <TouchableOpacity style={styles.eventButton} onPress={handleShareEvent}>
        <Text style={styles.eventButtonText}>Share Event</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.eventButton} onPress={handleEndEvent}>
        <Text style={styles.eventButtonText}>End Event</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.eventButton} onPress={handleLeaveEvent}>
        <Text style={styles.eventButtonText}>Leave Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  createButton: {
    padding: 10,
    backgroundColor: '#E6E6FA',
    borderRadius: 10,
    width: '80%',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#09745F',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  joinButton: {
    padding: 10,
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
    marginBottom: 10,
  },
  eventInfo: {
    fontSize: 18,
    color: '#09745F',
    marginBottom: 10,
  },
  qrContainer: {
    marginVertical: 20,
  },
  eventButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#E8D7FF',
    borderRadius: 10,
    width: '80%',
  },
  eventButtonText: {
    color: '#09745F',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;
