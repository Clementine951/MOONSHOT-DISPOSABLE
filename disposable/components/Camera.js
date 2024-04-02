import { StatusBar } from "expo-status-bar"
import React, { useEffect } from "react"
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native"
import { Camera } from "expo-camera"
let camera

/**
 * Renders a camera component with options to take pictures, switch camera, and adjust flash mode.
 * @returns {JSX.Element} The rendered camera component.
 */
export default function CameraPage() {
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = React.useState("off")

  /**
   * Requests camera permissions and starts the camera if permission is granted.
   */
  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === "granted") {
      return true;
    } else {
      Alert.alert("Access denied")
      return false;
    };
  }

  useEffect(() => {
    async function prepareCamera() {
      const cameraStarted = await __startCamera();
      if (cameraStarted) {
        // Camera started successfully, no need to set state
      }
    }
    prepareCamera(); // Start the camera when the component mounts
  }, []);

  /**
   * Takes a picture using the camera and sets the captured image as the preview.
   */
  const __takePicture = async () => {
    const photo = await camera.takePictureAsync()
    console.log(photo)
  }

  /**
   * Toggles the flash mode between "on", "off", and "auto".
   */
  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off")
    } else if (flashMode === "off") {
      setFlashMode("on")
    } else {
      setFlashMode("auto")
    }
  }

  /**
   * Switches between the front and back camera.
   */
  const __switchCamera = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        type={cameraType}
        flashMode={flashMode}
        style={{ flex: 1 }}
        ref={r => {
          camera = r
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "transparent",
            flexDirection: "row"
          }}
        >
          {/* Flash mode and camera switch buttons */}
          <View
            style={{
              position: "absolute",
              right: "5%",
              top: "10%",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <TouchableOpacity
              onPress={__handleFlashMode}
              style={{
                backgroundColor: flashMode === "off" ? "#000" : "#fff",
                borderRadius: 25,
                height: 50,
                width: 50,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                ⚡️
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={__switchCamera}
              style={{
                borderRadius: 25,
                height: 50,
                width: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                {cameraType === Camera.Constants.Type.front ? "🤳" : "📷"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Take picture button */}
          <View
            style={{
              position: "absolute",
              bottom: "5%",
              alignSelf: "center",
            }}
          >
            <TouchableOpacity
              onPress={__takePicture}
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#fff"
              }}
            />
          </View>
        </View>
      </Camera>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
})
