import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

function DataSettingsScreen() {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => {navigation.navigate('TermsCond')}}>
            <Text style={styles.option}>Terms and Conditions</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => {navigation.navigate('Privacy')}}>
            <Text style={styles.option}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => {navigation.navigate('ContactForm')}}>
            <Text style={styles.option}>Get access to your data</Text>
        </TouchableOpacity>
        <View style={styles.separator} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  option: {
    fontSize: width > 768 ? 30 : 18,
    paddingVertical: width > 768 ? 40 : 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    // color: 'grey'
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});

export default DataSettingsScreen;
