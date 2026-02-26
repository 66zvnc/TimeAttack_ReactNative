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
import { Card } from '../../components/Card';
import { theme } from '../../theme/theme';

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
      onLongPress={() => confirmDelete(item.id, item.trackName)}
      activeOpacity={0.7}
    >
      <Card style={styles.runCard}>
        <View style={styles.runHeader}>
          <Text style={styles.trackName}>{item.trackName}</Text>
          {item.isBest && (
            <View style={styles.bestBadge}>
              <Text style={styles.bestBadgeText}>🏆 BEST</Text>
            </View>
          )}
        </View>

        <Text style={styles.timeValue}>
          {formatDuration(item.duration || 0)}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Date</Text>
            <Text style={styles.statValue}>{formatDate(item.startDate)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Points</Text>
            <Text style={styles.statValue}>{item.points.length}</Text>
          </View>
          
          {item.points.length > 0 && (
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Max Speed</Text>
              <Text style={styles.statValue}>
                {Math.max(...item.points.map((p: any) => p.speed * 3.6)).toFixed(0)} km/h
              </Text>
            </View>
          )}
        </View>
      </Card>
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
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  runCard: {
    marginBottom: theme.spacing.md,
  },
  runHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  trackName: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  bestBadge: {
    backgroundColor: theme.colors.warning,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  bestBadgeText: {
    fontSize: theme.typography.sizes.tiny,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  timeValue: {
    fontSize: 40,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    fontFamily: theme.typography.families.monospace,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: theme.typography.sizes.tiny,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semibold,
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
