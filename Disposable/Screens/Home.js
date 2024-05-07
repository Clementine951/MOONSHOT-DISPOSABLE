import React from 'react';
import { View, Text, Button } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <Button title="Create an event" onPress={() => navigation.navigate('CreatePage')}/>
      <Button title="Join an event" onPress={() => navigation.navigate('JoinPage')}/>
    </View>
  );
}

export default HomeScreen;
