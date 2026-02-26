import * as Location from 'expo-location';
import { Track } from '../models/Track';
import { RunPoint } from '../models/RunPoint';

export enum RunState {
  idle = 'idle',
  waitingForStartExit = 'waitingForStartExit',
  running = 'running',
  finished = 'finished',
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export class RunTimerEngine {
  private state: RunState = RunState.idle;
  private track: Track | null = null;
  private points: RunPoint[] = [];
  private startTime: number = 0;
  private endTime: number = 0;
  private lastLocation: Location.LocationObject | null = null;
  private onStateChange?: (state: RunState) => void;
  private onPointAdded?: (point: RunPoint) => void;

  constructor() {}

  setTrack(track: Track): void {
    this.track = track;
  }

  getState(): RunState {
    return this.state;
  }

  getPoints(): RunPoint[] {
    return [...this.points];
  }

  getStartTime(): number {
    return this.startTime;
  }

  getEndTime(): number {
    return this.endTime;
  }

  getDuration(): number {
    if (this.state === RunState.finished) {
      return this.endTime - this.startTime;
    }
    return 0;
  }

  setOnStateChange(callback: (state: RunState) => void): void {
    this.onStateChange = callback;
  }

  setOnPointAdded(callback: (point: RunPoint) => void): void {
    this.onPointAdded = callback;
  }

  start(): void {
    if (!this.track) {
      throw new Error('No track set');
    }
    this.state = RunState.waitingForStartExit;
    this.points = [];
    this.startTime = 0;
    this.endTime = 0;
    this.lastLocation = null;
    this.notifyStateChange();
  }

  reset(): void {
    this.state = RunState.idle;
    this.points = [];
    this.startTime = 0;
    this.endTime = 0;
    this.lastLocation = null;
    this.notifyStateChange();
  }

  processLocation(location: Location.LocationObject): void {
    if (!this.track || this.state === RunState.idle || this.state === RunState.finished) {
      return;
    }

    const currentCoords: Coordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    const point: RunPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
      speed: location.coords.speed || 0,
      heading: location.coords.heading || 0,
    };

    const inStartZone = this.isInsideZone(
      currentCoords,
      this.track.startCenter,
      this.track.startRadius
    );

    const inFinishZone = this.isInsideZone(
      currentCoords,
      this.track.finishCenter,
      this.track.finishRadius
    );

    switch (this.state) {
      case RunState.waitingForStartExit:
        if (!inStartZone) {
          // Exited start zone, begin timing
          this.startTime = performance.now();
          this.state = RunState.running;
          this.notifyStateChange();
        }
        break;

      case RunState.running:
        // Add point
        this.points.push(point);
        this.onPointAdded?.(point);

        // Check if entered finish zone
        if (inFinishZone && this.lastLocation) {
          const lastCoords: Coordinates = {
            latitude: this.lastLocation.coords.latitude,
            longitude: this.lastLocation.coords.longitude,
          };

          // Validate direction
          const bearing = this.calculateBearing(lastCoords, currentCoords);
          const finishBearing = this.calculateBearing(
            this.track.startCenter,
            this.track.finishCenter
          );

          if (this.isDirectionValid(bearing, finishBearing, 30)) {
            // Interpolate crossing time
            this.endTime = this.interpolateFinishTime(
              lastCoords,
              currentCoords,
              this.lastLocation.timestamp,
              location.timestamp
            );
            this.state = RunState.finished;
            this.notifyStateChange();
          }
        }
        break;
    }

    this.lastLocation = location;
  }

  private isInsideZone(
    location: Coordinates,
    center: Coordinates,
    radius: number
  ): boolean {
    const distance = this.haversineDistance(location, center);
    return distance <= radius;
  }

  private haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371000; // Earth's radius in meters
    const lat1Rad = this.toRadians(coord1.latitude);
    const lat2Rad = this.toRadians(coord2.latitude);
    const deltaLat = this.toRadians(coord2.latitude - coord1.latitude);
    const deltaLon = this.toRadians(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateBearing(from: Coordinates, to: Coordinates): number {
    const lat1Rad = this.toRadians(from.latitude);
    const lat2Rad = this.toRadians(to.latitude);
    const deltaLon = this.toRadians(to.longitude - from.longitude);

    const y = Math.sin(deltaLon) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);

    const bearing = Math.atan2(y, x);
    return (this.toDegrees(bearing) + 360) % 360;
  }

  private isDirectionValid(
    currentBearing: number,
    expectedBearing: number,
    tolerance: number
  ): boolean {
    let diff = Math.abs(currentBearing - expectedBearing);
    if (diff > 180) {
      diff = 360 - diff;
    }
    return diff <= tolerance;
  }

  private interpolateFinishTime(
    lastCoords: Coordinates,
    currentCoords: Coordinates,
    lastTimestamp: number,
    currentTimestamp: number
  ): number {
    if (!this.track) {
      return performance.now();
    }

    const finishCenter = this.track.finishCenter;
    const finishRadius = this.track.finishRadius;

    // Calculate distance from last point to finish center
    const distanceFromLast = this.haversineDistance(lastCoords, finishCenter);
    const distanceFromCurrent = this.haversineDistance(currentCoords, finishCenter);

    // If we can't interpolate, use current time
    if (distanceFromLast === distanceFromCurrent) {
      return performance.now();
    }

    // Linear interpolation to estimate when we crossed the finish circle
    const totalDistance = Math.abs(distanceFromLast - finishRadius) + 
                          Math.abs(distanceFromCurrent - finishRadius);
    const distanceToFinish = Math.abs(distanceFromLast - finishRadius);
    
    let fraction = totalDistance > 0 ? distanceToFinish / totalDistance : 0.5;
    fraction = Math.max(0, Math.min(1, fraction));

    const interpolatedTimestamp = lastTimestamp + fraction * (currentTimestamp - lastTimestamp);
    
    // Convert to performance.now() time
    const timeSinceLastUpdate = Date.now() - currentTimestamp;
    return performance.now() - timeSinceLastUpdate - (currentTimestamp - interpolatedTimestamp);
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  private notifyStateChange(): void {
    this.onStateChange?.(this.state);
  }
}
