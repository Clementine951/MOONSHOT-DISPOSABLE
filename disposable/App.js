import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Home from './components/Home';
import Cam from './components/Camera';
import Set from './components/Settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home />;
      case 'Camera':
        return <CameraPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <Home />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageContainer}>{renderPage()}</View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => setCurrentPage('Home')}>
          <Ionicons name="home" size={24} color={currentPage === 'Home' ? 'blue' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => setCurrentPage('Camera')}>
          <Ionicons name="camera" size={24} color={currentPage === 'Camera' ? 'blue' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => setCurrentPage('Settings')}>
          <Ionicons name="settings" size={24} color={currentPage === 'Settings' ? 'blue' : 'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const HomePage = () => {
  return (
    <View style={styles.page}>
      {/* Content for Home Page */
        <Home />
      }
    </View>
  );
};

const CameraPage = () => {
  return (
    <View style={styles.page}>
      {/* Content for Camera Page */
        
      <Cam />
      }
    </View>
  );
};


const SettingsPage = () => {
  return (
    <View style={styles.page}>
      {/* Content for Settings Page */
        <Set />
      }
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ccc',
    height: 70,
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
