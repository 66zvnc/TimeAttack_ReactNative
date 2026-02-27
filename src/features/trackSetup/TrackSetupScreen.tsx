import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import MapView, { Circle, Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { useTrackSetup } from './useTrackSetup';
import LocationService from '../../core/location/LocationService';
import { TabBarIcon } from '../../components/TabBarIcon';
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

  const mapRef = useRef<MapView>(null);
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

  const handleRecenter = () => {
    if (startCenter) {
      mapRef.current?.animateToRegion({
        latitude: startCenter.latitude,
        longitude: startCenter.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      loadCurrentLocation();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Full-Screen Map */}
      <MapView
        ref={mapRef}
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

      {/* Top Overlay Buttons */}
      <View style={styles.topOverlay}>
        <TouchableOpacity
          style={styles.topButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <TabBarIcon name="goBack" color={theme.colors.textPrimary} size={20} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.topButton}
          onPress={handleRecenter}
          activeOpacity={0.7}
        >
          <TabBarIcon name="recenterMap" color={theme.colors.textPrimary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet Panel */}
      <View style={styles.bottomSheet}>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />
        
        {/* Header */}
        <Text style={styles.title}>Create Track</Text>
        <Text style={styles.subtitle}>Define your custom timing sector</Text>
        
        {/* Track Name Input */}
        <Text style={styles.sectionLabel}>TRACK NAME</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Downtown Sprint Section"
            placeholderTextColor={theme.colors.textMuted}
            value={trackName}
            onChangeText={setTrackName}
          />
          <TabBarIcon name="pen" color={theme.colors.textMuted} size={16} />
        </View>

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
            <TabBarIcon 
              name="setStart" 
              color="#FFFFFF" 
              size={18} 
            />
            <Text style={styles.placementButtonText}>
              Set Start
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
            <TabBarIcon 
              name="setFinish" 
              color="#FFFFFF" 
              size={18} 
            />
            <Text style={styles.placementButtonText}>
              Set Finish
            </Text>
          </TouchableOpacity>
        </View>

        {/* Radius Slider */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sectionLabel}>DETECTION RADIUS</Text>
            <Text style={styles.radiusValue}>{radius.toFixed(0)} m</Text>
          </View>
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
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!canSave || isSaving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!canSave || isSaving}
          activeOpacity={0.7}
        >
          <TabBarIcon name="save" color="#FFFFFF" size={18} />
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : 'Save Track'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  topOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 16,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : theme.spacing.lg,
    ...theme.shadows.lg,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.cardBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.families.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: '#F9FAFB',
    marginBottom: theme.spacing.lg,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  placementButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...theme.shadows.sm,
  },
  placementButtonActive: {
    backgroundColor: theme.colors.primary,
    opacity: 0.9,
  },
  placementButtonText: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semibold,
    color: '#FFFFFF',
  },
  sliderContainer: {
    marginBottom: theme.spacing.lg,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  radiusValue: {
    fontSize: theme.typography.sizes.subtitle,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.families.bold,
    color: theme.colors.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...theme.shadows.md,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.cardBorder,
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: theme.typography.sizes.subtitle,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.families.bold,
    color: '#FFFFFF',
  },
});
