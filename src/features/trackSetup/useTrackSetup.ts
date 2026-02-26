import { useState } from 'react';
import { Track } from '../../core/models/Track';
import RunStorage from '../../core/storage/RunStorage';
import { useRunStore } from '../../store/useRunStore';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const useTrackSetup = () => {
  const [trackName, setTrackName] = useState('');
  const [startCenter, setStartCenter] = useState<Coordinates | null>(null);
  const [finishCenter, setFinishCenter] = useState<Coordinates | null>(null);
  const [radius, setRadius] = useState(50);
  const [isSaving, setIsSaving] = useState(false);

  const { addTrack, setCurrentTrack } = useRunStore();

  const setStart = (coords: Coordinates) => {
    setStartCenter(coords);
  };

  const setFinish = (coords: Coordinates) => {
    setFinishCenter(coords);
  };

  const updateRadius = (newRadius: number) => {
    setRadius(newRadius);
  };

  const canSave = (): boolean => {
    return (
      trackName.trim().length > 0 &&
      startCenter !== null &&
      finishCenter !== null &&
      radius > 0
    );
  };

  const saveTrack = async (): Promise<boolean> => {
    if (!canSave() || !startCenter || !finishCenter) {
      return false;
    }

    setIsSaving(true);
    try {
      const track: Track = {
        id: Date.now().toString(),
        name: trackName.trim(),
        startCenter,
        startRadius: radius,
        finishCenter,
        finishRadius: radius,
      };

      await RunStorage.saveTrack(track);
      addTrack(track);
      setCurrentTrack(track);

      // Reset form
      setTrackName('');
      setStartCenter(null);
      setFinishCenter(null);
      setRadius(50);

      return true;
    } catch (error) {
      console.error('Error saving track:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setTrackName('');
    setStartCenter(null);
    setFinishCenter(null);
    setRadius(50);
  };

  return {
    trackName,
    setTrackName,
    startCenter,
    finishCenter,
    radius,
    setStart,
    setFinish,
    updateRadius,
    canSave: canSave(),
    saveTrack,
    isSaving,
    reset,
  };
};
