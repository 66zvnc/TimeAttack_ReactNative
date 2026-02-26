import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { useRunStore } from '../store/useRunStore';
import RunStorage from '../core/storage/RunStorage';

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
    setCurrentTrack(track);
    navigation.navigate('RunSession');
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

  const renderTrackItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => handleSelectTrack(item)}
      onLongPress={() => handleDeleteTrack(item.id, item.name)}
    >
      <View style={styles.trackHeader}>
        <Text style={styles.trackName}>{item.name}</Text>
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.infoText}>
          Start: {item.startCenter.latitude.toFixed(5)},{' '}
          {item.startCenter.longitude.toFixed(5)}
        </Text>
        <Text style={styles.infoText}>
          Finish: {item.finishCenter.latitude.toFixed(5)},{' '}
          {item.finishCenter.longitude.toFixed(5)}
        </Text>
        <Text style={styles.infoText}>Radius: {item.startRadius}m</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TimeAttack</Text>
        <Text style={styles.subtitle}>Select a track to start</Text>
      </View>

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
        />
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('TrackSetup')}
        >
          <Text style={styles.navButtonText}>➕ New Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.navButtonText}>📊 History</Text>
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
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContent: {
    padding: 16,
  },
  trackItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  trackHeader: {
    marginBottom: 8,
  },
  trackName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  trackInfo: {
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    ...Platform.select({
      ios: {
        paddingBottom: 32,
      },
    }),
  },
  navButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
