import React, { useState, useRef, useCallback, useContext, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';
import { EventContext } from './EventContext';

export default function CameraScreen({ route }) {
  const { eventDetails } = useContext(EventContext);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [photosRemaining, setPhotosRemaining] = useState(eventDetails.number);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need camera permissions to make this work!');
      }
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: true,
          skipProcessing: true
        });
        setPreviewVisible(true);
        setCapturedImage(photo);
        setPhotosRemaining((prev) => prev - 1);
      } catch (error) {
        console.error("Error taking picture: ", error);
        Alert.alert("Error", "Failed to take picture. Please try again.");
      }
    }
  };

  const savePhoto = async () => {
    if (capturedImage && capturedImage.uri) {
      try {
        const response = await fetch(capturedImage.uri);
        const blob = await response.blob();
        const imageName = `${Date.now()}.jpg`;
        const storageRef = ref(storage, `${eventDetails.eventId}/${imageName}`);

        await uploadBytes(storageRef, blob);
        setPreviewVisible(false);
        setCapturedImage(null);
        console.log("Image saved");
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert("Error", "Failed to save photo. Please try again.");
      }
    } else {
      console.error('No captured image to save');
      Alert.alert("Error", "No captured image to save.");
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleCameraFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (
        <ImageBackground source={{ uri: capturedImage.uri }} style={styles.camera}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setPreviewVisible(false)}>
              <Text style={styles.text}>Re-take</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={savePhoto}>
              <Text style={styles.text}>Save Photo</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      ) : (
        <CameraView style={styles.camera} facing={facing} flash={flash } ref={cameraRef}>
          <View style={styles.topControls}>
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.controlButton}>
            <MaterialIcons name={facing === 'front' ? 'camera-front' : 'camera-rear'} size={40} color="#09745F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleCameraFlash} style={styles.controlButton}>
            <MaterialIcons name={flash === 'on' ? 'flash-on' : 'flash-off'} size={40} color="#09745F" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomControls}>
            <View style={styles.photosRemainingContainer}>
              <Text style={styles.photosRemainingText}>{photosRemaining}{"\n"}PHOTOS{"\n"}REMAINING</Text>
            </View>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton} />
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  topControls: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  controlButton: {
    margin: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  photosRemainingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photosRemainingText: {
    color: '#09745F',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8D7FF',
    justifyContent: 'center',
  },
});