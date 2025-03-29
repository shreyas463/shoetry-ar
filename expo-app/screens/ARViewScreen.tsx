import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Sensors from 'expo-sensors';
import { Product } from '../types/schema';
import ViroARView from '../components/ViroARView';

const ARViewScreen = () => {
  const [loading, setLoading] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [deviceSupportsAR, setDeviceSupportsAR] = useState(true);
  const [initializing, setInitializing] = useState(true);
  
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product as Product;

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Request camera permission
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(cameraStatus === 'granted');
        
        // Request location permission (often needed for AR)
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(locationStatus === 'granted');
        
        // Check device motion/orientation sensors
        const isAvailable = await Sensors.DeviceMotion.isAvailableAsync();
        if (!isAvailable) {
          Alert.alert(
            "Limited AR Experience",
            "Your device sensors may not fully support AR. The experience might be limited."
          );
        }
        
        // Set loading state
        setLoading(false);
      } catch (error) {
        console.error('Error requesting permissions:', error);
        setLoading(false);
      }
    };
    
    // Check device AR compatibility
    const checkARCompatibility = () => {
      // Simple check for iOS 11+ or Android 7.0+
      const isCompatible = (
        (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 11) ||
        (Platform.OS === 'android' && parseInt(Platform.Version, 10) >= 24)
      );
      
      setDeviceSupportsAR(isCompatible);
      
      if (!isCompatible) {
        Alert.alert(
          "Device Not Compatible",
          "Your device may not fully support AR features. Some functionality might be limited."
        );
      }
      
      setInitializing(false);
    };
    
    checkPermissions();
    checkARCompatibility();
  }, []);

  // Handle back navigation
  const handleBackPress = () => {
    navigation.goBack();
  };

  if (initializing || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B5BA5" />
        <Text style={styles.loadingText}>Loading AR Experience...</Text>
      </View>
    );
  }

  if (!deviceSupportsAR) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>AR Not Supported</Text>
        <Text style={styles.errorText}>
          Your device doesn't support the AR features needed for this experience.
        </Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleBackPress}
        >
          <Text style={styles.actionButtonText}>Return to Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!cameraPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          To use the virtual try-on feature, we need permission to use your camera.
        </Text>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(status === 'granted');
          }}
        >
          <Text style={styles.actionButtonText}>Allow Camera Access</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleBackPress}
        >
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use the enhanced ViroReact AR view
  return <ViroARView product={product} onBack={handleBackPress} />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E87A5D', // Orange accent color
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3B5BA5', // Prussian blue
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#3B5BA5',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: 250,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B5BA5',
  },
  secondaryButtonText: {
    color: '#3B5BA5',
    fontWeight: '600',
    fontSize: 16,
  }
});

export default ARViewScreen;