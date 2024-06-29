import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera/legacy';
import { MaterialIcons } from '@expo/vector-icons';
import { storage } from './../firebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';

function CameraScreen({ route }) {
  const { event, number } = route.params;

  const [hasPermission, setHasPermission] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [startOver, setStartOver] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [photosRemaining, setPhotosRemaining] = useState(number);
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
    setPhotosRemaining(photosRemaining - 1);
    
  };

  const savePhoto = async () => {
    if (!capturedImage || !capturedImage.uri) {
      console.log('No image to save');
      return;
    }
    try {
      const response = await fetch(capturedImage.uri);
      const blob = await response.blob();

      const imageName = `${eventName}/${Date.now()}.jpg`;

      const storageRef = ref(storage, imageName);
      console.log('Uploading image to Firebase Storage:', imageName);
      await uploadBytes(storageRef, blob);
      console.log('Image uploaded successfully!');

      setPreviewVisible(false);
      setCapturedImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
