import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera/legacy'; // legacy for SDK 51
import { MaterialIcons } from '@expo/vector-icons';
import { storage, db } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc } from 'firebase/firestore';

// CameraScreen component handles image capturing and uploading
const CameraScreen = ({ route }) => {
  const { event, number } = route.params;  // Get event details and number of photos remaining from route parameters
  const [hasPermission, setHasPermission] = useState(null);  // Camera permission state
  const [previewVisible, setPreviewVisible] = useState(false);  // Preview visibility state
  const [capturedImage, setCapturedImage] = useState(null);  // Captured image state
  const [photosRemaining, setPhotosRemaining] = useState(number);  // Remaining photos state
  const [type, setType] = useState(Camera.Constants.Type.back);  // Camera type state (front/back)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);  // Flash mode state (on/off)
  let cameraRef = null;  // Reference to the camera

  // Request camera permissions when the component mounts
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');  // Set camera permission state
    })();
  }, []);

  // Capture a picture and set preview state
  const takePicture = async () => {
    if (!cameraRef) return;
    const photo = await cameraRef.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
    setPhotosRemaining(photosRemaining - 1);  // Decrease the number of photos remaining
  };

  // Save the captured photo to Firebase Storage and Firestore
  const savePhoto = async () => {
    if (!capturedImage || !capturedImage.uri) {
      console.log('No image to save');
      return;
    }
    try {
      const response = await fetch(capturedImage.uri);
      const blob = await response.blob();  // Convert image URI to blob
      const imageName = `${event}/${Date.now()}.jpg`;  // Create a unique image name
      const storageRef = ref(storage, imageName);  // Reference to the storage location
      console.log('Uploading image to Firebase Storage:', imageName);
      await uploadBytes(storageRef, blob);  // Upload image to Firebase Storage
      console.log('Image uploaded successfully!');

      const downloadURL = await getDownloadURL(storageRef);  // Get the download URL of the uploaded image
      const imageDocRef = doc(collection(db, 'events', event, 'images'));  // Reference to the Firestore document
      await setDoc(imageDocRef, {
        url: downloadURL,
        timestamp: Date.now()
      });  // Save the image URL and timestamp to Firestore
      console.log('Image URL saved to Firestore');

      // Reset preview and captured image states
      setPreviewVisible(false);
      setCapturedImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Toggle the camera type between front and back
  const toggleCameraType = () => {
    setType(prevType =>
      prevType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  // Toggle the flash mode between on and off
  const toggleFlash = () => {
    setFlash(prevFlash => 
      prevFlash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
    );
  };

  // If camera permissions are not determined, render an empty view
  if (hasPermission === null) {
    return <View />;
  }
  // If camera permissions are denied, render a message
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
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
  controlButton: {
    margin: 10,
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
