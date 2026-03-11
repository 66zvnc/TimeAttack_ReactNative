# Overlap - React Native (Expo)

A production-ready mobile app for tracking time attack runs using GPS start and finish zones.

## Features

- **Track Setup**: Create custom tracks with GPS-based start and finish zones
- **High-Precision Timing**: Uses `performance.now()` for millisecond-accurate timing
- **GPS Tracking**: High-accuracy location tracking with background support
- **Smart Detection**: 
  - Haversine distance calculations for zone detection
  - Bearing validation (±30° tolerance)
  - Linear interpolation for exact finish crossing time
- **Run History**: View all runs with personal best tracking
- **State Machine**: Robust run state management (idle → waitingForStartExit → running → finished)

## Tech Stack

- **React Native** with **Expo SDK 50**
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Zustand** for state management
- **AsyncStorage** for data persistence
- **expo-location** for GPS tracking with background support
- **react-native-maps** for map visualization

## Project Structure

```
src/
├── core/
│   ├── location/
│   │   └── LocationService.ts          # GPS tracking service
│   ├── timer/
│   │   └── RunTimerEngine.ts           # Run state machine & timing logic
│   ├── models/
│   │   ├── Track.ts                    # Track model
│   │   ├── Run.ts                      # Run model
│   │   └── RunPoint.ts                 # GPS point model
│   └── storage/
│       └── RunStorage.ts               # AsyncStorage wrapper
├── features/
│   ├── trackSetup/
│   │   ├── TrackSetupScreen.tsx        # Track creation UI
│   │   └── useTrackSetup.ts            # Track setup hook
│   ├── runSession/
│   │   ├── RunSessionScreen.tsx        # Active run UI
│   │   └── useRunSession.ts            # Run session hook
│   └── history/
│       ├── HistoryScreen.tsx           # Run history UI
│       └── useHistory.ts               # History hook
├── screens/
│   └── HomeScreen.tsx                  # Home screen
├── navigation/
│   └── AppNavigator.tsx                # Navigation setup
└── store/
    └── useRunStore.ts                  # Zustand store
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app

## Key Features Explained

### Location Service
- Requests foreground and background location permissions
- High-accuracy tracking (BestForNavigation)
- Updates every second with minimum distance interval of 0
- Background tracking using TaskManager

### Run Timer Engine
- **State Machine**:
  - `idle`: Ready to start
  - `waitingForStartExit`: Inside start zone, waiting to exit
  - `running`: Timer active, tracking path
  - `finished`: Crossed finish line
  
- **Zone Detection**: Uses Haversine formula for accurate spherical distance
- **Bearing Validation**: Ensures car is traveling in correct direction (±30°)
- **Interpolation**: Estimates exact crossing time between GPS updates

### Storage
- Persists tracks and runs locally using AsyncStorage
- JSON serialization for simple data structure

## Permissions

### iOS
- Location When In Use
- Location Always (for background tracking)

### Android
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- ACCESS_BACKGROUND_LOCATION

## Usage

1. **Create a Track**:
   - Tap "New Track" on home screen
   - Tap map to place start zone
   - Tap map to place finish zone
   - Adjust radius with slider
   - Name your track and save

2. **Run a Time Attack**:
   - Select a track from home screen
   - Tap "Start" when in start zone
   - Exit start zone to begin timing
   - Cross finish line to complete
   - View your time and stats

3. **View History**:
   - Tap "History" on home screen
   - See all runs sorted by time
   - Personal best marked with trophy
   - Long press to delete runs

## Performance Optimizations

- Memoization to minimize re-renders
- Efficient polyline updates
- Pure functions for math calculations
- Background location updates for battery efficiency
- RequestAnimationFrame for smooth timer display

## Background Mode

The app uses Expo TaskManager for background location tracking, ensuring runs continue even when the app is in the background. This is configured in `app.json` with proper iOS background modes and Android permissions.

## Notes

- GPS accuracy depends on device hardware and environmental conditions
- Best results in open areas with clear sky view
- Interpolation compensates for 1Hz GPS update rate
- All distance calculations use proper spherical geometry
