import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useHistory } from './useHistory';
import { Card } from '../../components/Card';
import { TabBarIcon } from '../../components/TabBarIcon';
import { theme } from '../../theme/theme';

type TabFilter = 'all' | 'best' | 'recent';

export const HistoryScreen: React.FC = () => {
  const { runs, isLoading, handleDeleteRun, formatDuration, formatDate, refresh } =
    useHistory();
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const getFilteredRuns = () => {
    if (activeTab === 'all') return runs;
    if (activeTab === 'best') return runs.filter(run => run.isBest);
    if (activeTab === 'recent') {
      // Return last 10 runs
      return runs.slice(0, 10);
    }
    return runs;
  };

  const filteredRuns = getFilteredRuns();

  // Calculate map region to fit both start and finish zones
  const getMapRegion = (track: any) => {
    const startLat = track.startCenter.latitude;
    const startLng = track.startCenter.longitude;
    const finishLat = track.finishCenter.latitude;
    const finishLng = track.finishCenter.longitude;

    const minLat = Math.min(startLat, finishLat);
    const maxLat = Math.max(startLat, finishLat);
    const minLng = Math.min(startLng, finishLng);
    const maxLng = Math.max(startLng, finishLng);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = (maxLat - minLat) * 1.8; // Add 80% padding
    const lngDelta = (maxLng - minLng) * 1.8;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.01), // Minimum zoom level
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  const confirmDelete = (runId: string, trackName: string) => {
    Alert.alert(
      'Delete Run',
      `Delete run on ${trackName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteRun(runId),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => {
    const track = item.track;
    if (!track) return null;

    const mapRegion = getMapRegion(track);

    return (
      <TouchableOpacity
        onLongPress={() => confirmDelete(item.id, item.trackName)}
        activeOpacity={0.7}
        style={styles.runItemContainer}
      >
        <Card style={styles.runCard}>
          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.map}
              region={mapRegion}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              {/* Start Zone */}
              <Circle
                center={track.startCenter}
                radius={track.startRadius}
                fillColor="rgba(34, 197, 94, 0.15)"
                strokeColor="rgba(34, 197, 94, 0.6)"
                strokeWidth={2}
              />
              <Marker
                coordinate={track.startCenter}
                pinColor={theme.colors.success}
              />

              {/* Finish Zone */}
              <Circle
                center={track.finishCenter}
                radius={track.finishRadius}
                fillColor="rgba(239, 68, 68, 0.15)"
                strokeColor="rgba(239, 68, 68, 0.6)"
                strokeWidth={2}
              />
              <Marker
                coordinate={track.finishCenter}
                pinColor={theme.colors.error}
              />
            </MapView>
            
            {/* Personal Best Badge */}
            {item.isBest && (
              <View style={styles.bestBadge}>
                <TabBarIcon name="bestCup" color="#FFFFFF" size={14} />
                <Text style={styles.bestBadgeText}>PERSONAL BEST</Text>
              </View>
            )}
          </View>

          {/* Run Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.trackName}>{item.trackName}</Text>
            <Text style={styles.dateTime}>
              {formatDate(item.startDate)} • {new Date(item.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </Text>

            <Text style={styles.timeValue}>
              {formatDuration(item.duration || 0)}
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statHeader}>
                  <TabBarIcon name="star" color={theme.colors.primary} size={15} />
                  <Text style={styles.statLabel}>POINTS GAINED</Text>
                </View>
                <Text style={styles.statValue}>{item.points.length.toLocaleString()} pts</Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={styles.statHeader}>
                  <TabBarIcon name="maxSpeed" color={theme.colors.primary} size={15} />
                  <Text style={styles.statLabel}>MAX SPEED</Text>
                </View>
                <Text style={styles.statValue}>
                  {item.points.length > 0 
                    ? Math.max(...item.points.map((p: any) => p.speed * 3.6)).toFixed(0) 
                    : '0'} km/h
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Headers */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All Runs
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'best' && styles.tabActive]}
          onPress={() => setActiveTab('best')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'best' && styles.tabTextActive]}>
            Personal Best
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.tabActive]}
          onPress={() => setActiveTab('recent')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.tabTextActive]}>
            Recent
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* List */}
      {filteredRuns.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No runs yet</Text>
          <Text style={styles.emptySubtext}>
            Complete a time attack run to see it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRuns}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  runItemContainer: {
    marginBottom: theme.spacing.lg,
  },
  runCard: {
    padding: 0,
    overflow: 'hidden',
  },
  mapContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  bestBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    ...theme.shadows.md,
  },
  bestBadgeText: {
    fontSize: theme.typography.sizes.tiny,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textInverse,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    padding: theme.spacing.lg,
  },
  trackName: {
    fontSize: theme.typography.sizes.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  timeValue: {
    fontSize: 48,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    fontFamily: theme.typography.families.monospace,
    marginBottom: theme.spacing.lg,
    letterSpacing: -1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.tiny,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.sizes.heading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
