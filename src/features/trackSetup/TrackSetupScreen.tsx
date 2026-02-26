import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Circle, Marker, Region } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useTrackSetup } from './useTrackSetup';
import LocationService from '../../core/location/LocationService';

export const TrackSetupScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    trackName,
    setTrackName,
    startCenter,
    finishCenter,
    radius,
    setStart,
    setFinish,
    updateRadius,
    canSave,
    saveTrack,
    isSaving,
  } = useTrackSetup();

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [placementMode, setPlacementMode] = useState<'none' | 'start' | 'finish'>('none');

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  const loadCurrentLocation = async () => {
    const location = await LocationService.getCurrentLocation();
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    if (placementMode === 'start') {
      setStart({ latitude, longitude });
      setPlacementMode('none');
    } else if (placementMode === 'finish') {
      setFinish({ latitude, longitude });
      setPlacementMode('none');
    }
  };

  const handleSave = async () => {
    const success = await saveTrack();
    if (success) {
      Alert.alert('Success', 'Track saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to save track');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        {startCenter && (
          <>
            <Marker
              coordinate={startCenter}
              pinColor="green"
              title="Start"
            />
            <Circle
              center={startCenter}
              radius={radius}
              fillColor="rgba(0, 255, 0, 0.2)"
              strokeColor="rgba(0, 255, 0, 0.5)"
              strokeWidth={2}
            />
          </>
        )}
        {finishCenter && (
          <>
            <Marker
              coordinate={finishCenter}
              pinColor="red"
              title="Finish"
            />
            <Circle
              center={finishCenter}
              radius={radius}
              fillColor="rgba(255, 0, 0, 0.2)"
              strokeColor="rgba(255, 0, 0, 0.5)"
              strokeWidth={2}
            />
          </>
        )}
      </MapView>

      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          placeholder="Track Name"
          value={trackName}
          onChangeText={setTrackName}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              placementMode === 'start' && styles.buttonActive,
            ]}
            onPress={() =>
              setPlacementMode(placementMode === 'start' ? 'none' : 'start')
            }
          >
            <Text style={styles.buttonText}>
              {startCenter ? 'Move Start' : 'Set Start'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              placementMode === 'finish' && styles.buttonActive,
            ]}
            onPress={() =>
              setPlacementMode(placementMode === 'finish' ? 'none' : 'finish')
            }
          >
            <Text style={styles.buttonText}>
              {finishCenter ? 'Move Finish' : 'Set Finish'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.label}>Radius: {radius.toFixed(0)}m</Text>
          <Slider
            style={styles.slider}
            minimumValue={20}
            maximumValue={200}
            value={radius}
            onValueChange={updateRadius}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#d3d3d3"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave || isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Track'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#0051D5',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  sliderContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
