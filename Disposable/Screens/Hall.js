import React from 'react';
import { View, Text } from 'react-native';

function HallPage({ route }) {
    // console.log(route.params);
  // Extract params from route
  const { event, start, duration, reveal, number } = route.params;
//   console.log(route.params);

//   console.log(route.params.event);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Event Name: {event}</Text>
      <Text>Start: {start}</Text>
      <Text>Duration: {duration}</Text>
      <Text>Reveal: {reveal}</Text>
      <Text>Number of Photos per Person: {number}</Text>
    </View>
  );
}

export default HallPage;
