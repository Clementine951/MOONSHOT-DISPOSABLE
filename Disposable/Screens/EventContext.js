import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const loadDeviceId = async () => {
      try {
        let id = await AsyncStorage.getItem('deviceId');
        if (!id) {
          id = uuid.v4();
          await AsyncStorage.setItem('deviceId', id);
        }
        setDeviceId(id);
        console.log('Loaded device ID:', id);
      } catch (error) {
        console.error('Failed to load device ID:', error);
      }
    };

    const loadEventDetails = async () => {
      try {
        const savedEventDetails = await AsyncStorage.getItem('eventDetails');
        if (savedEventDetails) {
          setEventDetails(JSON.parse(savedEventDetails));
        }
        console.log('Loaded event details:', savedEventDetails);
      } catch (error) {
        console.error('Failed to load event details:', error);
      }
    };

    const loadUserName = async () => {
      try {
        const savedUserName = await AsyncStorage.getItem('userName');
        if (savedUserName) {
          setUserName(savedUserName);
        }
        console.log('Loaded user name:', savedUserName);
      } catch (error){
        console.error('Failed to load user name:', error);
      }
    }

    loadDeviceId();
    loadEventDetails();
    loadUserName();
  }, []);

  useEffect(() => {
    const saveEventDetails = async () => {
      try {
        if (eventDetails) {
          await AsyncStorage.setItem('eventDetails', JSON.stringify(eventDetails));
        } else {
          await AsyncStorage.removeItem('eventDetails');
        }
        console.log('Saved event details:', eventDetails);
      } catch (error) {
        console.error('Failed to save event details:', error);
      }
    };

    saveEventDetails();
  }, [eventDetails]);

  useEffect(() => {
    const saveUserName = async () => {
      try {
        if (userName) {
          await AsyncStorage.setItem('userName', userName);
        } else {
          await AsyncStorage.removeItem('userName');
        }
        console.log('Saved user name:', userName);
      } catch (error) {
        console.error('Failed to save user name:', error);
      }
    };

    saveUserName();
  }, [userName]);

  const clearEventDetails = async () => {
    try {
      await AsyncStorage.removeItem('eventDetails');
      setEventDetails(null);
      console.log('Cleared event details');
    } catch (error) {
      console.error('Failed to clear event details:', error);
    }
  };

  return (
    <EventContext.Provider value={{ eventDetails, setEventDetails, clearEventDetails, deviceId, userName, setUserName }}>
      {children}
    </EventContext.Provider>
  );
};