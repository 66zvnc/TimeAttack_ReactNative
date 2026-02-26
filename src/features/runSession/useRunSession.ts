import { useState, useEffect, useRef } from 'react';
import { RunTimerEngine, RunState } from '../../core/timer/RunTimerEngine';
import LocationService from '../../core/location/LocationService';
import { Track } from '../../core/models/Track';
import { Run } from '../../core/models/Run';
import { RunPoint } from '../../core/models/RunPoint';
import RunStorage from '../../core/storage/RunStorage';
import { useRunStore } from '../../store/useRunStore';

export const useRunSession = (track: Track | null) => {
  const [runState, setRunState] = useState<RunState>(RunState.idle);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [points, setPoints] = useState<RunPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const timerEngineRef = useRef<RunTimerEngine>(new RunTimerEngine());
  const animationFrameRef = useRef<number>();
  const locationUnsubscribeRef = useRef<(() => void) | null>(null);

  const { addRun } = useRunStore();

  useEffect(() => {
    if (!track) return;

    const engine = timerEngineRef.current;
    engine.setTrack(track);

    engine.setOnStateChange((state) => {
      setRunState(state);
      
      if (state === RunState.finished) {
        saveRun();
      }
    });

    engine.setOnPointAdded((point) => {
      setPoints((prev) => [...prev, point]);
    });

    return () => {
      stopRun();
    };
  }, [track]);

  useEffect(() => {
    if (runState === RunState.running) {
      startTimerLoop();
    } else {
      stopTimerLoop();
    }

    return () => {
      stopTimerLoop();
    };
  }, [runState]);

  const startTimerLoop = () => {
    const updateTimer = () => {
      const engine = timerEngineRef.current;
      if (engine.getState() === RunState.running) {
        const elapsed = performance.now() - engine.getStartTime();
        setDisplayTime(elapsed);
      }
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  const stopTimerLoop = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  };

  const startRun = async () => {
    if (!track) return;

    try {
      const engine = timerEngineRef.current;
      engine.start();

      // Start location tracking
      await LocationService.startTracking(true);

      // Subscribe to location updates
      locationUnsubscribeRef.current = LocationService.subscribe((location) => {
        setCurrentSpeed((location.coords.speed || 0) * 3.6); // Convert m/s to km/h
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        engine.processLocation(location);
      });
    } catch (error) {
      console.error('Error starting run:', error);
    }
  };

  const stopRun = async () => {
    // Unsubscribe from location updates
    if (locationUnsubscribeRef.current) {
      locationUnsubscribeRef.current();
      locationUnsubscribeRef.current = null;
    }

    // Stop location tracking
    await LocationService.stopTracking();

    // Reset engine
    const engine = timerEngineRef.current;
    engine.reset();

    setPoints([]);
    setDisplayTime(0);
    setCurrentSpeed(0);
  };

  const saveRun = async () => {
    const engine = timerEngineRef.current;
    if (!track || engine.getState() !== RunState.finished) {
      return;
    }

    const duration = engine.getDuration();
    const run: Run = {
      id: Date.now().toString(),
      trackId: track.id,
      startDate: Date.now() - duration,
      endDate: Date.now(),
      duration,
      points: engine.getPoints(),
    };

    try {
      await RunStorage.saveRun(run);
      addRun(run);
    } catch (error) {
      console.error('Error saving run:', error);
    }
  };

  const resetRun = () => {
    stopRun();
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return {
    runState,
    currentSpeed,
    displayTime,
    formattedTime: formatTime(runState === RunState.finished ? timerEngineRef.current.getDuration() : displayTime),
    points,
    currentLocation,
    startRun,
    stopRun: resetRun,
  };
};
