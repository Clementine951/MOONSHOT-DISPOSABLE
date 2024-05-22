import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';

import { storage } from './../firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';

function CameraScreen({ route }) {

  const { event, number } = route.params; // Ensure the event parameter is available

  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [startOver, setStartOver] = useState(false);  
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [photosRemaining, setPhotosRemaining] = useState(number); // Example number of photos remaining
  const [isMuted, setIsMuted] = useState(false);
  let cameraRef = null;

  
  let eventName = event;

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
    setPhotosRemaining(photosRemaining - 1); // Decrease the count of photos remaining
  };

  const savePhoto = async () => {
    if (!capturedImage || !capturedImage.uri) {
      console.log('No image to save');
      return;
    }
    const response = await fetch(capturedImage.uri);
    const blob = await response.blob();
  
    const imageName = `${eventName}/${Date.now()}.jpg`;
  
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

  const toggleFlash = () => {
    setFlash(prevFlash => 
      prevFlash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
    );
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

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
            <Camera style={styles.camera} type={type} flashMode={flash} ref={(ref) => (cameraRef = ref)}>
              <View style={styles.topControls}>
                <TouchableOpacity onPress={toggleCameraType} style={styles.flipButton}>
                  <MaterialIcons name="flip-camera-ios" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFlash} style={styles.flashButton}>
                  <MaterialIcons name={flash === Camera.Constants.FlashMode.off ? "flash-off" : "flash-on"} size={30} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.captureButtonContainer}>
                <TouchableOpacity onPress={takePicture} style={styles.captureButton} />
              </View>
              <View style={styles.photosRemainingContainer}>
                <Text style={styles.photosRemainingText}>{photosRemaining}{"\n"}photos{"\n"}remaining</Text>
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
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  flipButton: {
    // Any additional styling you want for the flip button
  },
  flashButton: {
    // Any additional styling you want for the flash button
  },
  captureButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
  },
  photosRemainingContainer: {
    position: 'absolute',
    bottom: 35,
    left: 20,
  },
  photosRemainingText: {
    color: '#09745F',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CameraScreen;


