import React from 'react';
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
import { useHistory } from './useHistory';

export const HistoryScreen: React.FC = () => {
  const { runs, isLoading, handleDeleteRun, formatDuration, formatDate, refresh } =
    useHistory();

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

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.runItem}
      onLongPress={() => confirmDelete(item.id, item.trackName)}
    >
      <View style={styles.runHeader}>
        <Text style={styles.trackName}>{item.trackName}</Text>
        {item.isBest && (
          <View style={styles.bestBadge}>
            <Text style={styles.bestBadgeText}>🏆 Best</Text>
          </View>
        )}
      </View>

      <View style={styles.runDetails}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Time</Text>
          <Text style={styles.timeValue}>
            {formatDuration(item.duration || 0)}
          </Text>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(item.startDate)}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Points</Text>
          <Text style={styles.statValue}>{item.points.length}</Text>
        </View>
        {item.points.length > 0 && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Max Speed</Text>
            <Text style={styles.statValue}>
              {Math.max(...item.points.map((p: any) => p.speed * 3.6)).toFixed(
                0
              )}{' '}
              km/h
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {runs.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No runs yet</Text>
          <Text style={styles.emptySubtext}>
            Complete a time attack run to see it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={runs}
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
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  runItem: {
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
  runHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  bestBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bestBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  runDetails: {
    marginBottom: 12,
  },
  timeContainer: {
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    fontVariant: ['tabular-nums'],
  },
  dateContainer: {
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    gap: 24,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
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
});
