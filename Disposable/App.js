import React from 'react';
import 'react-native-gesture-handler';
import { EventProvider } from './Screens/EventContext';
import AppNavigation from './Navigation';

export default function App() {
  return (
    <EventProvider>
      <AppNavigation />
    </EventProvider>
  );
}
