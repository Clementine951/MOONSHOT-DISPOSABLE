import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreatePage')}
      >
        <Text style={styles.buttonText}>Create an event</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('JoinPage')}
      >
        <Text style={styles.buttonText}>Join an event</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0', // Light gray background
  },
  button: {
    width: '80%',
    height: '25%',
    backgroundColor: '#E8D7FF', // Light purple background
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5, // Shadow for Android
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  buttonText: {
    color: '#09745F', // Green text color
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
});

export default HomeScreen;
