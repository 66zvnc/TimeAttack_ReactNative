import AsyncStorage from '@react-native-async-storage/async-storage';
import { Run } from '../models/Run';
import { Track } from '../models/Track';

const RUNS_KEY = '@timeattack_runs';
const TRACKS_KEY = '@timeattack_tracks';

class RunStorage {
  async saveRun(run: Run): Promise<void> {
    try {
      const runs = await this.loadRuns();
      runs.push(run);
      await AsyncStorage.setItem(RUNS_KEY, JSON.stringify(runs));
    } catch (error) {
      console.error('Error saving run:', error);
      throw error;
    }
  }

  async loadRuns(): Promise<Run[]> {
    try {
      const data = await AsyncStorage.getItem(RUNS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading runs:', error);
      return [];
    }
  }

  async deleteRun(runId: string): Promise<void> {
    try {
      const runs = await this.loadRuns();
      const filtered = runs.filter((r) => r.id !== runId);
      await AsyncStorage.setItem(RUNS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting run:', error);
      throw error;
    }
  }

  async saveTrack(track: Track): Promise<void> {
    try {
      const tracks = await this.loadTracks();
      tracks.push(track);
      await AsyncStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
    } catch (error) {
      console.error('Error saving track:', error);
      throw error;
    }
  }

  async loadTracks(): Promise<Track[]> {
    try {
      const data = await AsyncStorage.getItem(TRACKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tracks:', error);
      return [];
    }
  }

  async deleteTrack(trackId: string): Promise<void> {
    try {
      const tracks = await this.loadTracks();
      const filtered = tracks.filter((t) => t.id !== trackId);
      await AsyncStorage.setItem(TRACKS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting track:', error);
      throw error;
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([RUNS_KEY, TRACKS_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export default new RunStorage();
