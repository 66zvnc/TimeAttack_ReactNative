# Quick Start Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- **Watchman** (macOS only - required to prevent file watching errors)
  - Install via Homebrew: `brew install watchman`
  - See TROUBLESHOOTING.md if you don't have Homebrew
- Expo CLI (will be installed with dependencies)
- iOS Simulator (Mac only) or Android Emulator
- OR a physical device with Expo Go app

## Setup Instructions

### 1. Install Dependencies

```bash
cd TimeAttack_ReactNative
npm install
```

This will install all required packages:
- Expo SDK 50
- React Native
- TypeScript
- Navigation libraries
- Location services
- Maps
- AsyncStorage
- Zustand

### 2. Start the Development Server

```bash
npm start
```

Or for specific platforms:
```bash
npm run ios      # iOS Simulator (Mac only)
npm run android  # Android Emulator
npm run web      # Web browser
```

### 3. Run on Device

#### iOS (Physical Device)
1. Install Expo Go from App Store
2. Scan QR code from terminal with Camera app
3. App will open in Expo Go

#### Android (Physical Device)
1. Install Expo Go from Play Store
2. Scan QR code from terminal with Expo Go app
3. App will load

### 4. Permissions

On first launch, the app will request:
- **Location When In Use** - Required for GPS tracking
- **Location Always** - Required for background tracking during runs

Grant both permissions for full functionality.

## First Run

1. **Create Your First Track**:
   - Tap "New Track" on home screen
   - Allow location permissions if prompted
   - The map will center on your current location
   - Tap "Set Start" button, then tap on the map to place start zone
   - Tap "Set Finish" button, then tap on the map to place finish zone
   - Adjust radius slider (20-200 meters)
   - Enter track name
   - Tap "Save Track"

2. **Run a Time Attack**:
   - From home screen, tap on your saved track
   - Position yourself in the start zone
   - Tap "Start"
   - Status will show "Exit Start Zone"
   - Drive/walk out of the start zone to begin timing
   - Status will change to "Running" and timer will start
   - Navigate to the finish zone
   - Timer stops automatically when you cross the finish line
   - View your time and save

3. **View History**:
   - Tap "History" from home screen
   - See all completed runs sorted by time
   - Personal best for each track marked with 🏆
   - Long press any run to delete

## Troubleshooting

### EMFILE: too many open files
**This is the most common issue on macOS.** Install Watchman:
```bash
brew install watchman
```

If you don't have Homebrew, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed instructions.

### TypeScript Errors Before npm install
If you see TypeScript errors before running `npm install`, this is normal. They will resolve after installing dependencies.

### Location Not Working
- Ensure location permissions are granted
- Check device location services are enabled
- Try on physical device (simulators may have limited GPS)

### Maps Not Loading
- Ensure you have internet connection
- Wait a moment for tiles to download
- Try zooming in/out

### Background Tracking Not Working
- Ensure "Always Allow" location permission is granted
- Check iOS background modes are enabled (already configured in app.json)
- Android: Disable battery optimization for Expo Go

## Development Notes

### File Watching
Expo will hot-reload when you save files. No need to restart unless:
- You modify app.json
- You install new native dependencies
- You encounter persistent errors

### Debugging
- Shake device (physical) or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open debug menu
- Can enable Remote JS Debugging
- Use React DevTools for component inspection

### Building for Production
See [Expo Build Documentation](https://docs.expo.dev/build/introduction/) for creating standalone apps:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure and build
eas build --platform ios
eas build --platform android
```

## Project Structure Reference

```
TimeAttack_ReactNative/
├── App.tsx                           # Entry point
├── app.json                          # Expo configuration
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
└── src/
    ├── core/                         # Business logic
    │   ├── location/                # GPS tracking
    │   ├── timer/                   # Run state machine
    │   ├── models/                  # Data models
    │   └── storage/                 # Data persistence
    ├── features/                     # Feature modules
    │   ├── trackSetup/              # Track creation
    │   ├── runSession/              # Active run
    │   └── history/                 # Run history
    ├── screens/                      # Screen components
    ├── navigation/                   # Navigation setup
    └── store/                        # Global state
```

## Next Steps

- Test the app in different environments
- Create multiple tracks
- Try runs at different speeds
- Check interpolation accuracy
- Verify background tracking works
- Review run history and personal bests

## Need Help?

- Check [Expo Documentation](https://docs.expo.dev/)
- Review [React Native Docs](https://reactnative.dev/)
- See README.md for detailed feature explanations
