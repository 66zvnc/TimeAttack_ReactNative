import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import MapView, { Circle, Marker, Polyline, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRunSession } from './useRunSession';
import { useRunStore } from '../../store/useRunStore';
import { RunState } from '../../core/timer/RunTimerEngine';
import { Card } from '../../components/Card';
import { theme } from '../../theme/theme';

export const RunSessionScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentTrack } = useRunStore();
  const {
    runState,
    currentSpeed,
    formattedTime,
    points,
    currentLocation,
    startRun,
    stopRun,
  } = useRunSession(currentTrack);

  const [region, setRegion] = useState<Region | undefined>(undefined);

  useEffect(() => {
    if (currentTrack) {
      setRegion({
        latitude: currentTrack.startCenter.latitude,
        longitude: currentTrack.startCenter.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentLocation && runState === RunState.running) {
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentLocation, runState]);

  const handleStartStop = async () => {
    if (runState === RunState.idle) {
      await startRun();
    } else {
      Alert.alert(
        'Stop Run',
        'Are you sure you want to stop this run?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Stop',
            style: 'destructive',
            onPress: () => {
              stopRun();
            },
          },
        ]
      );
    }
  };

  const handleFinished = () => {
    Alert.alert(
      'Run Complete!',
      `Time: ${formattedTime}`,
      [
        {
          text: 'OK',
          onPress: () => {
            stopRun();
            navigation.goBack();
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (runState === RunState.finished) {
      handleFinished();
    }
  }, [runState]);

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No track selected</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getStateText = () => {
    switch (runState) {
      case RunState.idle:
        return 'Ready';
      case RunState.waitingForStartExit:
        return 'Exit Start Zone';
      case RunState.running:
        return 'Running';
      case RunState.finished:
        return 'Finished!';
      default:
        return '';
    }
  };

  const getStateColor = () => {
    switch (runState) {
      case RunState.idle:
        return theme.colors.textSecondary;
      case RunState.waitingForStartExit:
        return theme.colors.warning;
      case RunState.running:
        return theme.colors.success;
      case RunState.finished:
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const polylineCoordinates = points.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Full-screen Map */}
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        followsUserLocation={runState === RunState.running}
      >
        {/* Start Zone */}
        <Circle
          center={currentTrack.startCenter}
          radius={currentTrack.startRadius}
          fillColor="rgba(34, 197, 94, 0.15)"
          strokeColor="rgba(34, 197, 94, 0.6)"
          strokeWidth={2}
        />
        <Marker
          coordinate={currentTrack.startCenter}
          pinColor={theme.colors.success}
          title="Start"
        />

        {/* Finish Zone */}
        <Circle
          center={currentTrack.finishCenter}
          radius={currentTrack.finishRadius}
          fillColor="rgba(239, 68, 68, 0.15)"
          strokeColor="rgba(239, 68, 68, 0.6)"
          strokeWidth={2}
        />
        <Marker
          coordinate={currentTrack.finishCenter}
          pinColor={theme.colors.error}
          title="Finish"
        />

        {/* Path Polyline */}
        {polylineCoordinates.length > 0 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor={theme.colors.primary}
            strokeWidth={4}
          />
        )}

        {/* User Location Marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.userMarker} />
          </Marker>
        )}
      </MapView>

      {/* Floating UI Overlay */}
      <SafeAreaView style={styles.overlay}>
        {/* Minimal Top Navigation */}
        <View style={styles.headerNav}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>OVERLAP</Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {/* Settings placeholder */}}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Glass-Style Timer Card */}
        <View style={styles.timerCard}>
          <Text style={styles.liveLabel}>LIVE LAP TIME</Text>
          <Text style={styles.timerText}>{formattedTime}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{currentSpeed.toFixed(0)}</Text>
              <Text style={styles.statLabel}>Speed</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: getStateColor() }]}>
                {getStateText().toUpperCase()}
              </Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
          </View>
        </View>

        {/* Start/Stop Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            runState === RunState.idle && styles.startButton,
          ]}
          onPress={handleStartStop}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>
            {runState === RunState.idle ? 'START LAP' : 'STOP'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  backButtonText: {
    fontSize: 24,
    color: theme.colors.textPrimary,
    marginLeft: -2,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.subtitle,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textInverse,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.glassBackground,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  settingsIcon: {
    fontSize: 20,
    color: theme.colors.textPrimary,
  },
  timerCard: {
    backgroundColor: theme.colors.glassBackground,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  liveLabel: {
    fontSize: theme.typography.sizes.tiny,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  timerText: {
    fontSize: theme.typography.sizes.timer,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontFamily: theme.typography.families.monospace,
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder,
    marginVertical: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.weights.medium,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.cardBorder,
    marginHorizontal: theme.spacing.md,
  },
  actionButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 20,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  startButton: {
    backgroundColor: theme.colors.success,
  },
  actionButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5,
  },
  userMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: theme.colors.textInverse,
    ...theme.shadows.sm,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.sizes.title,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  errorButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
  },
  errorButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semibold,
  },
});
