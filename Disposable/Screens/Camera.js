import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { Camera } from 'expo-camera/legacy'; // legacy for SDK 51
import { MaterialIcons } from '@expo/vector-icons';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import { EventContext } from './EventContext'; // Ensure EventContext is imported correctly

const CameraScreen = ({ route }) => {
  const { eventId, numberOfPhotos } = route.params || {}; // Destructuring route.params with default values
  const { deviceId, userName } = useContext(EventContext); // Access deviceId from EventContext
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [photosRemaining, setPhotosRemaining] = useState(parseInt(numberOfPhotos, 10) || 0);  // Initialize photosRemaining with numberOfPhotos
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  let cameraRef = null;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    console.log(`Initial number of photos: ${numberOfPhotos}`);
    console.log(`Parsed number of photos: ${parseInt(numberOfPhotos, 10)}`);
    console.log(`Event: ${eventId}`);
    setPhotosRemaining(parseInt(numberOfPhotos, 10) || 0);
  }, [numberOfPhotos, eventId]);

  const takePicture = async () => {
    if (!cameraRef) return;
    const photo = await cameraRef.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
    setPhotosRemaining((prev) => prev - 1);  // Decrease the number of photos remaining
    // savePhoto(capturedImage);

  };

  const savePhoto = async () => {
    if (!capturedImage || !capturedImage.uri) {
      console.log('No image to save');
      return;
    }
    try {
      if (!eventId) {
        console.error('Event is undefined');
        Alert.alert('Error', 'Event is undefined. Cannot save photo.');
        return;
      }
      const response = await fetch(capturedImage.uri);
      const blob = await response.blob();
      const imageName = `${eventId}/${userName}${Date.now()}.jpg`;
      const storageRef = ref(storage, imageName);
      console.log('Uploading image to Firebase Storage:', imageName);
      await uploadBytes(storageRef, blob);
      console.log('Image uploaded successfully!');

      const downloadURL = await getDownloadURL(storageRef);
      const imageDocRef = doc(collection(db, 'events', eventId, 'images'));
      await setDoc(imageDocRef, {
        url: downloadURL,
        timestamp: Date.now(),
        owner: userName
      });
      console.log('Image URL saved to Firestore');

      setPreviewVisible(false);
      setCapturedImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const toggleCameraType = () => {
    setType((prevType) =>
      prevType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlash((prevFlash) =>
      prevFlash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
    );
  };

  const reTake = () => {
    setPreviewVisible(false);
    setCapturedImage(null);
    setPhotosRemaining((prev) => prev + 1);
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {previewVisible ? (
        <ImageBackground source={{ uri: capturedImage?.uri }} style={styles.imageBackground}>
          <View style={styles.imageControls}>
            <TouchableOpacity onPress={reTake} style={styles.controlButton}>
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
            <TouchableOpacity onPress={toggleCameraType} style={styles.controlButton}>
              <MaterialIcons name={type === Camera.Constants.Type.back ? 'camera-front' : 'camera-rear'} size={40} color="#09745F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFlash} style={styles.controlButton}>
              <MaterialIcons name={flash === Camera.Constants.FlashMode.off ? "flash-off" : "flash-on"} size={40} color="#09745F" />
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
  );
};

const styles = StyleSheet.create({
  container: {
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
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingTop: 40,
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
    backgroundColor: '#E8D7FF',
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
