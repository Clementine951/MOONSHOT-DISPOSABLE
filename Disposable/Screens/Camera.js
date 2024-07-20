import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { Camera } from 'expo-camera/legacy'; // legacy for SDK 51
import { MaterialIcons } from '@expo/vector-icons';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventContext } from './EventContext'; 

const CameraScreen = ({ route }) => {
  const { eventId, numberOfPhotos } = route.params || {}; 
  const { deviceId, userName } = useContext(EventContext); 
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [photosRemaining, setPhotosRemaining] = useState(0); 
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  let cameraRef = null;

  useEffect(() => {
    // Request camera permissions on component mount
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted'); // Update permission state
    })();
  }, []);

  useEffect(() => {
    // Fetch remaining photos from AsyncStorage
    const fetchPhotosRemaining = async () => {
      const savedPhotosRemaining = await AsyncStorage.getItem(`photosRemaining_${eventId}_${deviceId}`);
      if (savedPhotosRemaining !== null) {
        setPhotosRemaining(parseInt(savedPhotosRemaining, 10)); // Set remaining photos from storage
      } else {
        setPhotosRemaining(parseInt(numberOfPhotos, 10) || 0); // Set initial remaining photos
      }
    };

    fetchPhotosRemaining();
  }, [numberOfPhotos, eventId, deviceId]);

  const takePicture = async () => {
    // Function to take a picture
    if (!cameraRef || photosRemaining <= 0) return; // Block camera if no photos remaining
    const photo = await cameraRef.takePictureAsync(); // Capture photo
    setPreviewVisible(true); // Show image preview
    setCapturedImage(photo); // Store captured image
    setPhotosRemaining((prev) => {
      const newPhotosRemaining = prev - 1;
      AsyncStorage.setItem(`photosRemaining_${eventId}_${deviceId}`, newPhotosRemaining.toString()); // Update remaining photos in storage
      return newPhotosRemaining;
    });
  };

  const savePhoto = async () => {
    // Function to save photo
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
      const blob = await response.blob(); // Convert image to blob
      const imageName = `${eventId}/${userName}${Date.now()}.jpg`; // Generate image name
      const storageRef = ref(storage, imageName); // Create storage reference
      console.log('Uploading image to Firebase Storage:', imageName);
      await uploadBytes(storageRef, blob); // Upload image to Firebase storage
      console.log('Image uploaded successfully!');

      const downloadURL = await getDownloadURL(storageRef); // Get image URL
      const imageDocRef = doc(collection(db, 'events', eventId, 'images')); // Create Firestore document reference
      await setDoc(imageDocRef, {
        url: downloadURL,
        timestamp: Date.now(),
        owner: userName, // Save image URL and metadata to Firestore
      });
      console.log('Image URL saved to Firestore');

      setPreviewVisible(false); // Hide image preview
      setCapturedImage(null); // Clear captured image state
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const toggleCameraType = () => {
    // Function to toggle camera type (front/back)
    setType((prevType) =>
      prevType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    // Function to toggle flash mode (on/off)
    setFlash((prevFlash) =>
      prevFlash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
    );
  };

  const reTake = () => {
    // Function to retake picture
    setPreviewVisible(false); // Hide image preview
    setCapturedImage(null); // Clear captured image state
    setPhotosRemaining((prev) => {
      const newPhotosRemaining = prev + 1;
      AsyncStorage.setItem(`photosRemaining_${eventId}_${deviceId}`, newPhotosRemaining.toString()); // Update remaining photos in storage
      return newPhotosRemaining;
    });
  }

  if (hasPermission === null) {
    return <View />; // Return empty view if permission status is unknown
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>; // Return message if camera access is denied
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

// Define styles for the component
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
    justifyContent: 'space-between',
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
    backgroundColor: '#FFF',
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
