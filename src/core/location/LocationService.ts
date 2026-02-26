import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';

type LocationCallback = (location: Location.LocationObject) => void;

class LocationService {
  private subscribers: Set<LocationCallback> = new Set();
  private isTracking = false;
  private foregroundSubscription: Location.LocationSubscription | null = null;

  async requestForegroundPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async requestBackgroundPermissions(): Promise<boolean> {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    return status === 'granted';
  }

  async startTracking(useBackground = false): Promise<void> {
    if (this.isTracking) {
      return;
    }

    const hasForeground = await this.requestForegroundPermissions();
    if (!hasForeground) {
      throw new Error('Foreground location permission denied');
    }

    if (useBackground) {
      const hasBackground = await this.requestBackgroundPermissions();
      if (!hasBackground) {
        throw new Error('Background location permission denied');
      }

      // Define the background task
      TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
        if (error) {
          console.error('Background location error:', error);
          return;
        }
        if (data) {
          const { locations } = data as { locations: Location.LocationObject[] };
          if (locations && locations.length > 0) {
            const location = locations[0];
            this.notifySubscribers(location);
          }
        }
      });

      // Start background tracking
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 0,
        foregroundService: {
          notificationTitle: 'TimeAttack',
          notificationBody: 'Tracking your run',
        },
      });
    } else {
      // Foreground tracking
      this.foregroundSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 0,
        },
        (location) => {
          this.notifySubscribers(location);
        }
      );
    }

    this.isTracking = true;
  }

  async stopTracking(): Promise<void> {
    if (!this.isTracking) {
      return;
    }

    // Stop background tracking
    try {
      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (isTaskRegistered) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    } catch (error) {
      console.log('Error stopping background tracking:', error);
    }

    // Stop foreground tracking
    if (this.foregroundSubscription) {
      this.foregroundSubscription.remove();
      this.foregroundSubscription = null;
    }

    this.isTracking = false;
  }

  subscribe(callback: LocationCallback): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(location: Location.LocationObject): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(location);
      } catch (error) {
        console.error('Error in location subscriber:', error);
      }
    });
  }

  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasForeground = await this.requestForegroundPermissions();
      if (!hasForeground) {
        return null;
      }
      return await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  getIsTracking(): boolean {
    return this.isTracking;
  }
}

export default new LocationService();
