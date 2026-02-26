import { useEffect, useState } from 'react';
import { useRunStore } from '../../store/useRunStore';
import { Run } from '../../core/models/Run';
import { Track } from '../../core/models/Track';
import RunStorage from '../../core/storage/RunStorage';

interface RunWithTrackName extends Run {
  trackName: string;
  track: Track | null;
  isBest: boolean;
}

export const useHistory = () => {
  const { runs, tracks, setRuns, deleteRun } = useRunStore();
  const [runsWithDetails, setRunsWithDetails] = useState<RunWithTrackName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    processRuns();
  }, [runs, tracks]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const loadedRuns = await RunStorage.loadRuns();
      setRuns(loadedRuns);
    } catch (error) {
      console.error('Error loading runs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processRuns = () => {
    const runsWithInfo: RunWithTrackName[] = runs
      .filter((run) => run.duration !== undefined)
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
          track: track || null,
          isBest,
        };
      })
      .sort((a, b) => (a.duration || 0) - (b.duration || 0));

    setRunsWithDetails(runsWithInfo);
  };

  const handleDeleteRun = async (runId: string) => {
    try {
      await RunStorage.deleteRun(runId);
      deleteRun(runId);
    } catch (error) {
      console.error('Error deleting run:', error);
    }
  };

  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return {
    runs: runsWithDetails,
    isLoading,
    handleDeleteRun,
    formatDuration,
    formatDate,
    refresh: loadData,
  };
};
