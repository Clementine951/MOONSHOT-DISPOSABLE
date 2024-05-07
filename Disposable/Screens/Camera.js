import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';

import { storage } from './../firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';

function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [startOver, setStartOver] = useState(false);  
  const [type, setType] = useState(Camera.Constants.Type.back);
  let cameraRef = null;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef) return;

    const photo = await cameraRef.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const savePhoto = async () => {
    if (!capturedImage || !capturedImage.uri) {
      console.log('No image to save');
      return;
    }
    const response = await fetch(capturedImage.uri);
    const blob = await response.blob();
  
    const imageName = `images/${Date.now()}.jpg`;
  
    try {
      const storageRef = ref(storage, imageName);
      await uploadBytes(storageRef, blob);
      console.log('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      return;
    }
  
    setPreviewVisible(false);
    setCapturedImage(null);
  };

  const toggleCameraType = () => {
    setType(prevType =>
      prevType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  return (
    <View style={styles.container}>
      {startOver ? (
        <View style={styles.innerContainer} />
      ) : (
        <View style={styles.innerContainer}>
          {previewVisible ? (
            <ImageBackground source={{ uri: capturedImage?.uri }} style={styles.imageBackground}>
              <View style={styles.imageControls}>
                <TouchableOpacity onPress={() => setPreviewVisible(false)} style={styles.controlButton}>
                  <Text style={styles.controlButtonText}>Re-take</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={savePhoto} style={styles.controlButton}>
                  <Text style={styles.controlButtonText}>Save Photo</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          ) : (
            <Camera style={styles.camera} type={type} ref={(ref) => (cameraRef = ref)}>
              <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
                <Text style={styles.flipButtonText}>Flip</Text>
              </TouchableOpacity>
              <View style={styles.captureButtonContainer}>
                <TouchableOpacity onPress={takePicture} style={styles.captureButton} />
              </View>
            </Camera>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-end',
  },
  imageControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 130,
    height: 40,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#000',
    opacity: 0.7,
    justifyContent: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  camera: {
    flex: 1,
    flexDirection: 'row',
  },
  flipButton: {
    position: 'absolute',
    top: '5%',
    left: '5%',
  },
  flipButtonText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
});

export default CameraScreen;
