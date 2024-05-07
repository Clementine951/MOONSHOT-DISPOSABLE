import React from 'react';
import { View, Text, Button } from 'react-native';

function GalleryScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Gallery</Text>
      <Button
        title="Go to Camera"
        onPress={() => navigation.navigate('CameraScreen')}
        // replace instead of navigate for no back button
      />
    </View>
  );
}

export default GalleryScreen;
