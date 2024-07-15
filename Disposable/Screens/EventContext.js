import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventDetails, setEventDetails] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

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
        } else {
          setEventDetails(null);
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
    };

    const loadUserRole = async () => {
      try {
        const savedUserRole = await AsyncStorage.getItem('userRole');
        if (savedUserRole) {
          setUserRole(savedUserRole);
        }
        console.log('Loaded user role:', savedUserRole);
      } catch (error){
        console.error('Failed to load user role:', error);
      }
    }

    loadDeviceId();
    loadEventDetails();
    loadUserName();
    loadUserRole();
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

  useEffect(() => {
    const saveUserRole = async () => {
      try {
        if (userRole) {
          await AsyncStorage.setItem('userRole', userRole);
        } else {
          await AsyncStorage.removeItem('userRole');
        }
        console.log('Saved user role:', userRole);
      } catch (error) {
        console.error('Failed to save user role:', error);
      }
    };

    saveUserRole();
  }, [userRole]);

  const clearEventDetails = async () => {
    try {
      await AsyncStorage.removeItem('eventDetails');
      await AsyncStorage.removeItem('userName');
      setEventDetails(null);
      setUserName('');
      console.log('Cleared event details and user name');
    } catch (error) {
      console.error('Failed to clear event details and user name:', error);
    }
  };

  return (
    <EventContext.Provider value={{ eventDetails, setEventDetails, clearEventDetails, deviceId, userName, setUserName, userRole, setUserRole }}>
      {children}
    </EventContext.Provider>
  );
};
