import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { db } from '../firebaseConfig'; // Make sure to import your firebaseConfig file
import { collection, addDoc } from 'firebase/firestore';

function ContactFormScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const subjects = ['General inquiry', 'Technical support', 'Feedback', 'Data access', 'Data deletion', 'Other'];

  const handleCheckboxChange = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((item) => item !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = async () => {
    try {
      // Add a new document with a generated id
      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        message,
        subjects: selectedSubjects,
        timestamp: new Date(),
      });

      // Show confirmation alert
      Alert.alert('Success', 'Your message has been sent successfully.');

      // Clear the form
      setName('');
      setEmail('');
      setMessage('');
      setSelectedSubjects([]);

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error saving contact message to Firestore:', error);
      Alert.alert('Error', 'Failed to send your message. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={message}
        onChangeText={setMessage}
        placeholder="Your message"
        multiline={true}
        numberOfLines={4}
      />

      <Text style={styles.label}>Subjects</Text>
      {subjects.map((subject) => (
        <View key={subject} style={styles.checkboxContainer}>
          <Checkbox
            status={selectedSubjects.includes(subject) ? 'checked' : 'unchecked'}
            onPress={() => handleCheckboxChange(subject)}
            
          />
          <Text style={styles.checkboxLabel}>{subject}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#09745F',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default ContactFormScreen;
