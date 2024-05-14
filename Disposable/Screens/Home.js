import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    // Check if the route has params and if so, update the state
    if (route.params?.event) {
      setEventName(route.params.event);
    } else {
      setEventName('');  // Reset if no event name is passed
    }
  }, [route.params]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {eventName ? (
        <Text style={{ fontSize: 24, marginBottom: 20 }}>Event: {eventName}</Text>
      ) : (
        <>
          <Button title="Create an event" onPress={() => navigation.navigate('CreatePage')} />
          <Button title="Join an event" onPress={() => navigation.navigate('JoinPoint')} />
        </>
      )}
    </View>
  );
}

export default HomeScreen;
