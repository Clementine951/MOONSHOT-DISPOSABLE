import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = () => {
  return (
    <View>
      <Text>Settings</Text>
      <MaterialIcons name="flash-on" size={30} color="black" />
      <MaterialIcons name="flash-off" size={30} color="black" />
      <MaterialIcons name="camera-front" size={30} color="black" />
      <MaterialIcons name="camera-rear" size={30} color="black" />
      <MaterialIcons name="save-alt" size={30} color="black" />

    </View>
  );
};

export default SettingsScreen;