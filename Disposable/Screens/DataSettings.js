import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


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
    fontSize: 18,
    paddingVertical: 15,
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
