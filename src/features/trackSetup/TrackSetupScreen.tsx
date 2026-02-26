import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import MapView, { Circle, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useTrackSetup } from './useTrackSetup';
import LocationService from '../../core/location/LocationService';
import { PrimaryButton  } from '../../components/PrimaryButton';
import { theme } from '../../theme/theme';

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
      <StatusBar barStyle="dark-content" />
      
      {/* Full-Screen Map */}
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
      >
        {/* Start Zone */}
        {startCenter && (
          <>
            <Marker
              coordinate={startCenter}
              pinColor={theme.colors.success}
              title="Start"
            />
            <Circle
              center={startCenter}
              radius={radius}
              fillColor="rgba(34, 197, 94, 0.15)"
              strokeColor="rgba(34, 197, 94, 0.6)"
              strokeWidth={2}
            />
          </>
        )}
        
        {/* Finish Zone */}
        {finishCenter && (
          <>
            <Marker
              coordinate={finishCenter}
              pinColor={theme.colors.error}
              title="Finish"
            />
            <Circle
              center={finishCenter}
              radius={radius}
              fillColor="rgba(239, 68, 68, 0.15)"
              strokeColor="rgba(239, 68, 68, 0.6)"
              strokeWidth={2}
            />
          </>
        )}
      </MapView>

      {/* Bottom Sheet Panel */}
      <View style={styles.bottomSheet}>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />
        
        {/* Track Name Input */}
        <Text style={styles.sectionLabel}>TRACK NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter track name"
          placeholderTextColor={theme.colors.textMuted}
          value={trackName}
          onChangeText={setTrackName}
        />

        {/* Placement Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.placementButton,
              placementMode === 'start' && styles.placementButtonActive,
            ]}
            onPress={() =>
              setPlacementMode(placementMode === 'start' ? 'none' : 'start')
            }
            activeOpacity={0.7}
          >
            <Text style={[
              styles.placementButtonText,
              placementMode === 'start' && styles.placementButtonTextActive,
            ]}>
              {startCenter ? '✓ Start Set' : 'Set Start'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.placementButton,
              placementMode === 'finish' && styles.placementButtonActive,
            ]}
            onPress={() =>
              setPlacementMode(placementMode === 'finish' ? 'none' : 'finish')
            }
            activeOpacity={0.7}
          >
            <Text style={[
              styles.placementButtonText,
              placementMode === 'finish' && styles.placementButtonTextActive,
            ]}>
              {finishCenter ? '✓ Finish Set' : 'Set Finish'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Radius Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sectionLabel}>RADIUS: {radius.toFixed(0)}m</Text>
          <Slider
            style={styles.slider}
            minimumValue={20}
            maximumValue={200}
            value={radius}
            onValueChange={updateRadius}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.cardBorder}
            thumbTintColor={theme.colors.primary}
          />
        </View>

        {/* Save Button */}
        <PrimaryButton
          title={isSaving ? 'Saving...' : 'Save Track'}
          onPress={handleSave}
          disabled={!canSave || isSaving}
          loading={isSaving}
          variant="success"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.lg,
    ...theme.shadows.lg,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.cardBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  placementButton: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  placementButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  placementButtonText: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
  },
  placementButtonTextActive: {
    color: theme.colors.textInverse,
  },
  sliderContainer: {
    marginBottom: theme.spacing.lg,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
