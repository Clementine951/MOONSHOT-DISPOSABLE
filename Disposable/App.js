import React from 'react';
import AppNavigation from './Navigation';
import { EventProvider } from './Screens/EventContext';

export default function App() {
  return (
    <EventProvider>
      <AppNavigation />
    </EventProvider>
  );
}
