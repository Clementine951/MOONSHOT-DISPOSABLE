import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';

import { storage, ref, uploadBytes } from 'firebase/storage';

import { ViewPropTypes } from 'deprecated-react-native-prop-types'; // Import ViewPropTypes from deprecated-react-native-prop-types

function CameraScreen() {
  const [photoUri, setPhotoUri] = useState(null);

  const takePicture = async (camera) => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      const data = await camera.takePictureAsync(options);
      setPhotoUri(data.uri);
    }
  };

  const savePhoto = async (capturedImage) => {
    if (!capturedImage || !capturedImage.uri) {
      console.log('No image to save');
      return;
    }
  
    try {
      const response = await fetch(capturedImage.uri);
      const blob = await response.blob();
  
      const imageName = `images/${Date.now()}.jpg`; // Set a unique name for the image
  
      const storageRef = ref(storage, imageName);
      await uploadBytes(storageRef, blob);
      console.log('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle error appropriately
      return;
    }
  
    // Reset states or navigate to another screen
    // For example:
    // navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={{ flex: 1 }} />
        ) : (
          <RNCamera
            style={{ flex: 1 }}
            type={RNCamera.Constants.Type.back}
            captureAudio={false}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            }}
          />
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Take Picture" onPress={takePicture} />
        {photoUri && <Button title="Save Picture" onPress={savePhoto} />}
      </View>
    </View>
  );
}

export default CameraScreen;
