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
import { useRunStore } from '../store/useRunStore';
import RunStorage from '../core/storage/RunStorage';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
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
    setCurrentTrack(track);
    // Navigate to Drive tab
    navigation.navigate('DriveTab', { screen: 'RunSession' });
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
    <Card style={styles.trackCard}>
      <View style={styles.trackCardContent}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{item.name}</Text>
          
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinateValue}>
              {item.startCenter.latitude.toFixed(5)}, {item.startCenter.longitude.toFixed(5)}
            </Text>
          </View>
          
          <View style={styles.radiusBadge}>
            <Text style={styles.radiusText}>Radius: {item.startRadius}m</Text>
          </View>
        </View>
        
        <PrimaryButton
          title="Select"
          onPress={() => handleSelectTrack(item)}
          variant="primary"
        />
      </View>
      
      {/* Long press for delete */}
      <TouchableOpacity
        style={styles.deleteOverlay}
        onLongPress={() => handleDeleteTrack(item.id, item.name)}
        activeOpacity={1}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Time Attack</Text>
          <Text style={styles.subtitle}>Select a track to start</Text>
        </View>

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

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.newTrackButton}
            onPress={() => navigation.navigate('TrackSetup')}
            activeOpacity={0.7}
          >
            <Text style={styles.plusIcon}>+</Text>
            <Text style={styles.newTrackText}>New Track</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('HistoryTab')}
            activeOpacity={0.7}
          >
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.textSecondary,
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  trackCard: {
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  trackCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  coordinatesContainer: {
    marginBottom: theme.spacing.sm,
  },
  coordinateValue: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.families.monospace,
  },
  radiusBadge: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
  },
  radiusText: {
    fontSize: theme.typography.sizes.tiny,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textInverse,
  },
  deleteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  bottomButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.md : theme.spacing.lg,
  },
  newTrackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    gap: theme.spacing.xs,
  },
  plusIcon: {
    fontSize: 20,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  newTrackText: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
  },
  historyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
  },
  historyButtonText: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textInverse,
  },
});
