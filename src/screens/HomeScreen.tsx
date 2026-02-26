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
      onPress={() => handleSelectTrack(item)}
      onLongPress={() => handleDeleteTrack(item.id, item.name)}
      activeOpacity={0.7}
    >
      <Card style={styles.trackCard}>
        <Text style={styles.trackName}>{item.name}</Text>
        
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinateLabel}>Start</Text>
          <Text style={styles.coordinateValue}>
            {item.startCenter.latitude.toFixed(4)}, {item.startCenter.longitude.toFixed(4)}
          </Text>
        </View>
        
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinateLabel}>Finish</Text>
          <Text style={styles.coordinateValue}>
            {item.finishCenter.latitude.toFixed(4)}, {item.finishCenter.longitude.toFixed(4)}
          </Text>
        </View>
        
        <View style={styles.radiusBadge}>
          <Text style={styles.radiusText}>{item.startRadius}m</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Time Attack</Text>
          <Text style={styles.subtitle}>Select a track</Text>
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
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title="New Track"
              onPress={() => navigation.navigate('TrackSetup')}
              variant="outline"
            />
          </View>
          <View style={styles.buttonWrapper}>
            <PrimaryButton
              title="History"
              onPress={() => navigation.navigate('History')}
              variant="primary"
            />
          </View>
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
  trackName: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  coordinatesContainer: {
    marginBottom: theme.spacing.sm,
  },
  coordinateLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  coordinateValue: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.families.monospace,
  },
  radiusBadge: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  radiusText: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textInverse,
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
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  buttonWrapper: {
    flex: 1,
  },
});
