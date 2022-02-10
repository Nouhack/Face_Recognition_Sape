import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const wi = useSharedValue(0);
  const hei = useSharedValue(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
      width: wi.value,
      height: hei.value,
    };
  });
  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      x.value = faces[0].bounds.origin.x;
      y.value = faces[0].bounds.origin.y;
      wi.value = faces[0].bounds.size.width;
      hei.value = faces[0].bounds.size.height;
    } else {
      x.value = 0;
      y.value = 0;
      wi.value = 0;
      hei.value = 0;
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Camera
      style={styles.camera}
      type={type}
      ratio="16:9"
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
        runClassifications: FaceDetector.FaceDetectorClassifications.none,
        minDetectionInterval: 100,
        tracking: true,
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: "transparent",
            borderWidth: 2,
            borderColor: "red",
            borderRadius: 100,
            position: "absolute",
          },
          animatedStyle,
        ]}
      ></Animated.View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={styles.text}> Flip </Text>
        </TouchableOpacity>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    width,
    height,
    resizeMode: "cover",
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
