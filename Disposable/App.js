import React from 'react';
import { EventProvider } from './Screens/EventContext';
import AppNavigation from './Navigation';

export default function App() {
  return (
    <EventProvider>
      <AppNavigation />
    </EventProvider>
  );
}
