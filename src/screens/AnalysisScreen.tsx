import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { TabBarIcon } from '../components/TabBarIcon';
import { RunSelectionModal } from '../components/RunSelectionModal';
import { useRunStore } from '../store/useRunStore';
import { Run } from '../core/models/Run';
import { theme } from '../theme/theme';

interface RunWithTrackName extends Run {
  trackName: string;
  isBest: boolean;
}

export const AnalysisScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { runs, tracks } = useRunStore();
  const [showRunModal, setShowRunModal] = useState(false);
  const [availableRuns, setAvailableRuns] = useState<RunWithTrackName[]>([]);

  useEffect(() => {
    loadRuns();
  }, [runs, tracks]);

  const loadRuns = () => {
    // Get runs with track names and best status
    const runsWithInfo: RunWithTrackName[] = runs
      .filter((run) => run.duration !== undefined && run.duration > 0)
      .map((run) => {
        const track = tracks.find((t) => t.id === run.trackId);
        const trackName = track ? track.name : 'Unknown Track';

        // Check if this is the best run for the track
        const trackRuns = runs
          .filter((r) => r.trackId === run.trackId && r.duration !== undefined)
          .sort((a, b) => (a.duration || 0) - (b.duration || 0));
        const isBest = trackRuns.length > 0 && trackRuns[0].id === run.id;

        return {
          ...run,
          trackName,
          isBest,
        };
      })
      .sort((a, b) => b.startDate - a.startDate); // Sort by most recent first
    
    setAvailableRuns(runsWithInfo);
  };

  const handleAnalyzePress = () => {
    if (availableRuns.length === 0) {
      return;
    }
    setShowRunModal(true);
  };

  const handleRunAnalysis = (selectedRunId: string) => {
    console.log('Analyzing run:', selectedRunId);
    // TODO: Load and display the selected run's data
    setShowRunModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconButton} />
        <Text style={styles.headerTitle}>Delta</Text>
        <TouchableOpacity style={styles.iconButton}>
          <TabBarIcon name="history" color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Track Info */}
        <Text style={styles.trackName}>Silverstone GP • Oct 12</Text>

        {/* Analyze Run Button */}
        <TouchableOpacity 
          style={styles.analyzeButton}
          onPress={handleAnalyzePress}
        >
          <Text style={styles.analyzeButtonText}>Analyse Run</Text>
        </TouchableOpacity>

        {/* Session Delta Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SESSION DELTA</Text>
          <Text style={styles.deltaValue}>+0.28<Text style={styles.deltaUnit}>s</Text></Text>
          <Text style={styles.deltaSubtitle}>vs. Session Best (1:42.410)</Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Last Lap</Text>
              <Text style={styles.statValue}>1:42.690</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Avg Lap</Text>
              <Text style={styles.statValue}>1:43.115</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Consistency</Text>
              <Text style={[styles.statValue, styles.percentValue]}>94.2%</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Theoretical Best</Text>
              <Text style={styles.statValue}>1:41.882</Text>
            </View>
          </View>
        </View>

        {/* Route Progress Delta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ROUTE PROGRESS DELTA</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressSegment, styles.progressNeutral, { width: '20%' }]} />
              <View style={[styles.progressSegment, styles.progressBad, { width: '8%' }]} />
              <View style={[styles.progressSegment, styles.progressNeutral, { width: '50%' }]} />
              <View style={[styles.progressSegment, styles.progressBad, { width: '5%' }]} />
              <View style={[styles.progressSegment, styles.progressNeutral, { width: '17%' }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>START</Text>
              <Text style={styles.progressLabel}>T1-T4</Text>
              <Text style={styles.progressLabel}>CHICANE</Text>
              <Text style={styles.progressLabel}>T12-T18</Text>
              <Text style={styles.progressLabel}>FINISH</Text>
            </View>
          </View>
        </View>

        {/* Critical Zones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CRITICAL ZONES</Text>
          
          <View style={styles.zoneItem}>
            <View style={styles.zoneHeader}>
              <Text style={styles.zonePercentage}>32%</Text>
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>Zone 4 (The Loop)</Text>
                <Text style={styles.zoneDescription}>Early braking detected. Apex missed by 1.2m.</Text>
              </View>
              <Text style={styles.zoneDelta}>+0.14s</Text>
            </View>
          </View>

          <View style={styles.zoneItem}>
            <View style={styles.zoneHeader}>
              <Text style={styles.zonePercentage}>65%</Text>
              <View style={styles.zoneInfo}>
                <Text style={styles.zoneName}>Zone 7 (Copse)</Text>
                <Text style={styles.zoneDescription}>Delayed throttle application on exit.</Text>
              </View>
              <Text style={styles.zoneDelta}>+0.09s</Text>
            </View>
          </View>
        </View>

        {/* Driving Patterns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DRIVING PATTERNS</Text>

          <View style={styles.patternItem}>
            <View style={styles.patternIcon}>
              <TabBarIcon name="pinpoint" color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.patternContent}>
              <Text style={styles.patternTitle}>Consistent Late Entry</Text>
              <Text style={styles.patternDescription}>
                Entering corners with 4km/h higher speed than optimal, leading to understeer.
              </Text>
            </View>
          </View>

          <View style={styles.patternItem}>
            <View style={styles.patternIcon}>
              <TabBarIcon name="maxSpeed" color={theme.colors.primary} size={20} />
            </View>
            <View style={styles.patternContent}>
              <Text style={styles.patternTitle}>High Brake Variance</Text>
              <Text style={styles.patternDescription}>
                Pressure modulation varies +/- 15% between identical turns in Sector 2.
              </Text>
            </View>
          </View>
        </View>

        {/* Action Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACTION PLAN</Text>

          <View style={styles.actionCard}>
            <Text style={styles.actionNumber}>01</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>
                Shift braking point at Turn 4 forward by 5 meters to maximize mid-corner rotation.
              </Text>
            </View>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionNumber}>02</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>
                Smoother steering input during Sector 3 to reduce tire scrub and heat build-up.
              </Text>
            </View>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionNumber}>03</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>
                Verify brake bias settings; consider 52% forward for improved stability in T15.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Run Selection Modal */}
      <RunSelectionModal
        visible={showRunModal}
        runs={availableRuns}
        onClose={() => setShowRunModal(false)}
        onAnalyze={handleRunAnalysis}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconButton: {
    padding: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: theme.colors.textPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  trackName: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  analyzeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.tiny,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
  },
  deltaValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  deltaUnit: {
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
  },
  deltaSubtitle: {
    fontSize: theme.typography.sizes.small,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  statLabel: {
    fontSize: theme.typography.sizes.tiny,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.sizes.subtitle,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.textPrimary,
  },
  percentValue: {
    color: theme.colors.primary,
  },
  progressBarContainer: {
    marginTop: theme.spacing.sm,
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  progressSegment: {
    height: '100%',
  },
  progressNeutral: {
    backgroundColor: '#E5E7EB',
  },
  progressGood: {
    backgroundColor: '#10B981',
  },
  progressBad: {
    backgroundColor: '#EF4444',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  progressLabel: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
  },
  zoneItem: {
    marginBottom: theme.spacing.md,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  zonePercentage: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    width: 50,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  zoneDescription: {
    fontSize: theme.typography.sizes.small,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  zoneDelta: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  patternIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternContent: {
    flex: 1,
  },
  patternTitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  patternDescription: {
    fontSize: theme.typography.sizes.small,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
    lineHeight: 18,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  actionNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: theme.colors.primary,
  },
  actionContent: {
    flex: 1,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
});
