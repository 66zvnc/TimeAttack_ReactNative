import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Run } from '../core/models/Run';
import { theme } from '../theme/theme';

interface RunWithTrackName extends Run {
  trackName: string;
  isBest: boolean;
}

interface RunSelectionModalProps {
  visible: boolean;
  runs: RunWithTrackName[];
  onClose: () => void;
  onAnalyze: (selectedRunId: string) => void;
}

export const RunSelectionModal: React.FC<RunSelectionModalProps> = ({
  visible,
  runs,
  onClose,
  onAnalyze,
}) => {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const toggleRunSelection = (runId: string) => {
    setSelectedRunId(runId === selectedRunId ? null : runId);
  };

  const handleAnalyze = () => {
    if (selectedRunId) {
      onAnalyze(selectedRunId);
      setSelectedRunId(null);
    }
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000));

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const month = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return month;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Run to Analyze</Text>
            <Text style={styles.subtitle}>Choose a run to compare telemetry data.</Text>
          </View>

          {/* Run List */}
          <FlatList
            data={runs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => {
              const isSelected = selectedRunId === item.id;
              const runNumber = runs.length - index; // Count backwards for display
              
              return (
                <TouchableOpacity
                  style={[
                    styles.runItem,
                    isSelected && styles.runItemSelected,
                  ]}
                  onPress={() => toggleRunSelection(item.id)}
                >
                  <View style={styles.runLeft}>
                    <View
                      style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                    <View style={styles.runInfo}>
                      <View style={styles.runHeader}>
                        <Text style={styles.runName}>{item.trackName} • {formatDate(item.startDate)}</Text>
                        {item.isBest && (
                          <View style={styles.bestBadge}>
                            <Text style={styles.bestBadgeText}>BEST</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.runTime}>{formatTime(item.duration || 0)}</Text>
                    </View>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.analyzeButton,
                !selectedRunId && styles.analyzeButtonDisabled,
              ]}
              onPress={handleAnalyze}
              disabled={!selectedRunId}
            >
              <Text style={styles.analyzeButtonText}>Analyze Selected 📊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: Dimensions.get('window').height * 0.8,
    paddingBottom: 34, // Extra padding for safe area
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  runItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  runItemSelected: {
    backgroundColor: '#EBF5FF',
    borderColor: theme.colors.primary,
  },
  runLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  runInfo: {
    flex: 1,
  },
  runHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  runName: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.textPrimary,
  },
  bestBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  bestBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  runTime: {
    fontSize: theme.typography.sizes.small,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actions: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  analyzeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  analyzeButtonText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textMuted,
  },
});
