import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Circle, Marker, Polyline, Region } from 'react-native-maps';
import { useRunSession } from './useRunSession';
import { useRunStore } from '../../store/useRunStore';
import { RunState } from '../../core/timer/RunTimerEngine';

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
      <View style={styles.container}>
        <Text style={styles.errorText}>No track selected</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
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
        return '#666';
      case RunState.waitingForStartExit:
        return '#FF9500';
      case RunState.running:
        return '#34C759';
      case RunState.finished:
        return '#007AFF';
      default:
        return '#666';
    }
  };

  const polylineCoordinates = points.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
  }));

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation
        followsUserLocation={runState === RunState.running}
      >
        <Circle
          center={currentTrack.startCenter}
          radius={currentTrack.startRadius}
          fillColor="rgba(0, 255, 0, 0.2)"
          strokeColor="rgba(0, 255, 0, 0.5)"
          strokeWidth={2}
        />
        <Marker
          coordinate={currentTrack.startCenter}
          pinColor="green"
          title="Start"
        />

        <Circle
          center={currentTrack.finishCenter}
          radius={currentTrack.finishRadius}
          fillColor="rgba(255, 0, 0, 0.2)"
          strokeColor="rgba(255, 0, 0, 0.5)"
          strokeWidth={2}
        />
        <Marker
          coordinate={currentTrack.finishCenter}
          pinColor="red"
          title="Finish"
        />

        {polylineCoordinates.length > 0 && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#007AFF"
            strokeWidth={3}
          />
        )}

        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.userMarker} />
          </Marker>
        )}
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.statsContainer}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formattedTime}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Speed</Text>
              <Text style={styles.infoValue}>
                {currentSpeed.toFixed(0)} km/h
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { color: getStateColor() }]}>
                {getStateText()}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            runState === RunState.idle
              ? styles.startButton
              : styles.stopButton,
          ]}
          onPress={handleStartStop}
        >
          <Text style={styles.actionButtonText}>
            {runState === RunState.idle ? 'Start' : 'Stop'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    left: 16,
    right: 16,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    fontVariant: ['tabular-nums'],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoBox: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  actionButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  startButton: {
    backgroundColor: '#34C759',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: 'white',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
