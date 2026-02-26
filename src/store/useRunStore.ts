import { create } from 'zustand';
import { Track } from '../core/models/Track';
import { Run } from '../core/models/Run';

interface RunStore {
  currentTrack: Track | null;
  tracks: Track[];
  runs: Run[];
  
  setCurrentTrack: (track: Track | null) => void;
  addTrack: (track: Track) => void;
  deleteTrack: (trackId: string) => void;
  setTracks: (tracks: Track[]) => void;
  
  addRun: (run: Run) => void;
  deleteRun: (runId: string) => void;
  setRuns: (runs: Run[]) => void;
  
  getRunsForTrack: (trackId: string) => Run[];
  getBestRunForTrack: (trackId: string) => Run | null;
}

export const useRunStore = create<RunStore>((set, get) => ({
  currentTrack: null,
  tracks: [],
  runs: [],

  setCurrentTrack: (track) => set({ currentTrack: track }),

  addTrack: (track) =>
    set((state) => ({
      tracks: [...state.tracks, track],
    })),

  deleteTrack: (trackId) =>
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== trackId),
      runs: state.runs.filter((r) => r.trackId !== trackId),
      currentTrack: state.currentTrack?.id === trackId ? null : state.currentTrack,
    })),

  setTracks: (tracks) => set({ tracks }),

  addRun: (run) =>
    set((state) => ({
      runs: [...state.runs, run],
    })),

  deleteRun: (runId) =>
    set((state) => ({
      runs: state.runs.filter((r) => r.id !== runId),
    })),

  setRuns: (runs) => set({ runs }),

  getRunsForTrack: (trackId) => {
    return get().runs.filter((r) => r.trackId === trackId);
  },

  getBestRunForTrack: (trackId) => {
    const runs = get()
      .runs.filter((r) => r.trackId === trackId && r.duration !== undefined)
      .sort((a, b) => (a.duration || 0) - (b.duration || 0));
    return runs.length > 0 ? runs[0] : null;
  },
}));
