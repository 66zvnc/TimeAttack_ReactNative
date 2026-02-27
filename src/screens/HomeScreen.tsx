import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRunStore } from '../store/useRunStore';
import RunStorage from '../core/storage/RunStorage';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { TabBarIcon } from '../components/TabBarIcon';
import { theme } from '../theme/theme';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { tracks, setTracks, setCurrentTrack, deleteTrack, setRuns } = useRunStore();

  useEffect(() => {
    loadTracks();
    loadRuns();
  }, []);

  const loadTracks = async () => {
    const loadedTracks = await RunStorage.loadTracks();
    setTracks(loadedTracks);
  };

  const loadRuns = async () => {
    const loadedRuns = await RunStorage.loadRuns();
    setRuns(loadedRuns);
  };

  const handleSelectTrack = (track: any) => {
    console.log('=== Go button pressed ===');
    console.log('Track:', track.name, 'ID:', track.id);
    console.log('Navigation object:', navigation);
    console.log('Setting current track...');
    setCurrentTrack(track);
    console.log('Navigating to RunSession...');
    try {
      navigation.navigate('RunSession', { track });
      console.log('Navigation called successfully');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', `Failed to navigate: ${error}`)
    }
  };

  const handleDeleteTrack = async (trackId: string, trackName: string) => {
    Alert.alert(
      'Delete Track',
      `Delete "${trackName}" and all associated runs?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await RunStorage.deleteTrack(trackId);
            deleteTrack(trackId);
          },
        },
      ]
    );
  };

  const renderTrackItem = ({ item }: { item: any }) => {
    // Calculate distance between start and finish
    const distance = calculateDistance(
      item.startCenter.latitude,
      item.startCenter.longitude,
      item.finishCenter.latitude,
      item.finishCenter.longitude
    );

    return (
      <Card style={styles.trackCard}>
        <TouchableOpacity
          onLongPress={() => handleDeleteTrack(item.id, item.name)}
          activeOpacity={1}
        >
          <View style={styles.trackCardHeader}>
          {/* Map Preview */}
          <View style={styles.mapPreviewContainer}>
            <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.mapPreview}
              region={{
                latitude: item.startCenter.latitude,
                longitude: item.startCenter.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={item.startCenter}
                pinColor={theme.colors.success}
              />
            </MapView>
            
            {/* Track name overlay on map */}
            <View style={styles.mapOverlay}>
              <Text style={styles.trackNameOverlay}>{item.name}</Text>
            </View>
          </View>
          
          {/* Radius Badge */}
          <View style={styles.radiusBadge}>
            <Text style={styles.radiusText}>Radius: {item.startRadius.toFixed(1)}m</Text>
          </View>
        </View>
        
        {/* Track Info */}
        <View style={styles.trackInfo}>
          <View style={styles.coordinatesRow}>
            <TabBarIcon name="pinpoint" color={theme.colors.textSecondary} size={12} />
            <Text style={styles.coordinateValue}>
              {item.startCenter.latitude.toFixed(3)}, {item.startCenter.longitude.toFixed(3)} • {distance.toFixed(1)} km
            </Text>
          </View>
        </View>
        </TouchableOpacity>
        
        {/* Go Button */}
        <View style={styles.selectButtonContainer}>
          <PrimaryButton
            title="Go"
            onPress={() => handleSelectTrack(item)}
            variant="primary"
            style={styles.selectButton}
          />
        </View>
      </Card>
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        {/* Track List */}
        {tracks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tracks yet</Text>
            <Text style={styles.emptySubtext}>
              Create a track to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={tracks}
            renderItem={renderTrackItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  trackCard: {
    marginBottom: theme.spacing.md,
    position: 'relative',
    overflow: 'visible',
  },
  trackCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  mapPreviewContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPreview: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  trackNameOverlay: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textInverse,
  },
  radiusBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  radiusText: {
    fontSize: theme.typography.sizes.tiny,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textInverse,
  },
  trackInfo: {
    marginBottom: theme.spacing.md,
  },
  coordinatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coordinateValue: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
  },
  selectButtonContainer: {
    alignItems: 'flex-end',
  },
  selectButton: {
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
