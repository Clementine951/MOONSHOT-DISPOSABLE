import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

function HomeScreen({navigation}) {

  return (
    <View style={styles.container}>
          <Button title="Create an event" onPress={() => navigation.navigate('CreatePage')} />
          <Button title="Join an event" onPress={() => navigation.navigate('JoinPage')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventName: {
    fontSize: 24,
    marginBottom: 20,
  }
});

export default HomeScreen;
