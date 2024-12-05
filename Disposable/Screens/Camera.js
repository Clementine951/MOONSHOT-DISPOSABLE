import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Alert, Dimensions } from 'react-native';
import { Camera } from 'expo-camera/legacy'; // Legacy import for compatibility
import { MaterialIcons } from '@expo/vector-icons';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventContext } from './EventContext';

const { width, height } = Dimensions.get('window');

const CameraScreen = ({ route }) => {
  const { eventId, numberOfPhotos } = route.params || {};
  const { deviceId, userName } = useContext(EventContext);
  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [photosRemaining, setPhotosRemaining] = useState(0);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const fetchPhotosRemaining = async () => {
      const savedPhotosRemaining = await AsyncStorage.getItem(`photosRemaining_${eventId}_${deviceId}`);
      setPhotosRemaining(savedPhotosRemaining ? parseInt(savedPhotosRemaining, 10) : parseInt(numberOfPhotos, 10) || 0);
    };
    fetchPhotosRemaining();
  }, [numberOfPhotos, eventId, deviceId]);

  const takePicture = async () => {
    if (!cameraRef || photosRemaining <= 0) {
      Alert.alert('Error', 'No photos remaining or camera is not ready.');
      return;
    }
    try {
      const photo = await cameraRef.takePictureAsync();
      console.log('Photo captured:', photo.uri);
      setPreviewVisible(true);
      setCapturedImage(photo);
      setPhotosRemaining((prev) => {
        const newPhotosRemaining = prev - 1;
        AsyncStorage.setItem(`photosRemaining_${eventId}_${deviceId}`, newPhotosRemaining.toString());
        return newPhotosRemaining;
      });
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo.');
    }
  };

  const savePhoto = async () => {
    if (!capturedImage || !capturedImage.uri) return;

    try {
      const response = await fetch(capturedImage.uri);
      const blob = await response.blob();
      const imageName = `${eventId}/${userName}_${Date.now()}.jpg`;
      const storageRef = ref(storage, imageName);

      await uploadBytes(storageRef, blob);
      console.log('Image uploaded successfully! URL:', await getDownloadURL(storageRef));

      setPreviewVisible(false);
      setCapturedImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to save photo.');
    }
  };

  const toggleCameraType = () => {
    setType((prevType) =>
      prevType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlash(
      flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
    );
  };

  const reTake = () => {
    setPreviewVisible(false);
    setCapturedImage(null);
    setPhotosRemaining((prev) => {
      const newPhotosRemaining = prev + 1;
      AsyncStorage.setItem(`photosRemaining_${eventId}_${deviceId}`, newPhotosRemaining.toString());
      return newPhotosRemaining;
    });
  };

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
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.topControls}>
            <TouchableOpacity onPress={toggleCameraType} style={styles.controlButtonSwitch}>
              <MaterialIcons
                name={type === Camera.Constants.Type.back ? 'camera-front' : 'camera-rear'}
                size={width > 768 ? 90 : 40}
                color="#09745F"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFlash} style={styles.controlButtonSwitch}>
              <MaterialIcons
                name={flash === Camera.Constants.FlashMode.off ? 'flash-off' : 'flash-on'}
                size={width > 768 ? 90 : 40}
                color="#09745F"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton} />
          </View>
          <View style={styles.photosRemainingContainer}>
            <Text style={styles.photosRemainingText}>
              {photosRemaining}
              {'\n'}photos{'\n'}remaining
            </Text>
          </View>
        </Camera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageBackground: { flex: 1, padding: 15, justifyContent: 'flex-end' },
  imageControls: { flexDirection: 'row', justifyContent: 'space-between' },
  controlButton: { width: width > 768 ? 500 : 130, alignItems: 'center', borderRadius: 4 },
  controlButtonSwitch: { alignItems: 'center', borderRadius: 4 },
  controlButtonText: { color: '#fff', fontSize: width > 768 ? 60 : 20 },
  camera: { flex: 1, justifyContent: 'space-between' },
  topControls: { flexDirection: 'column', alignItems: 'flex-end', paddingTop: 40 },
  captureButtonContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: width > 768 ? 75 : 30 },
  captureButton: { width: width > 768 ? 140 : 70, height: width > 768 ? 140 : 70, borderRadius: 35, backgroundColor: '#FFF' },
  photosRemainingContainer: { position: 'absolute', bottom: width > 768 ? 80 : 35, left: width > 768 ? 70 : 20 },
  photosRemainingText: { color: '#09745F', fontSize: width > 768 ? 40 : 18, fontWeight: 'bold', textAlign: 'center' },
});

export default CameraScreen;
