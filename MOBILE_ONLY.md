# ⚠️ IMPORTANT: This is a Mobile-Only App

The TimeAttack app **cannot run in a web browser** because it requires:
- GPS location tracking
- Native maps (react-native-maps) 
- Background location services
- Mobile-specific sensors

## ✅ How to Run the App

### Option 1: iOS Simulator (Mac Only - Easiest)

```bash
npm run ios
```

This will:
1. Start the Metro bundler
2. Open iOS Simulator automatically
3. Install and launch the app

### Option 2: Android Emulator (Requires Android Studio Setup)

```bash
npm run android
```

Make sure you have:
- Android Studio installed
- Android Emulator running
- Android SDK configured

### Option 3: Physical Device (Recommended for GPS Testing)

```bash
npm start
```

Then:
1. **iOS**: 
   - Install "Expo Go" from App Store
   - Open Camera app and scan the QR code
   
2. **Android**: 
   - Install "Expo Go" from Play Store
   - Open Expo Go app and scan the QR code

## 🎯 Why No Web Version?

Web browsers don't support:
- High-accuracy GPS tracking
- Background location services  
- Native map components
- Mobile sensors (accelerometer, compass)

This app is specifically designed for mobile devices where you'll be moving around to test time attack runs.

## 🚀 Quick Start

1. **If you have macOS and Xcode:**
   ```bash
   npm run ios
   ```

2. **If not, use a physical device:**
   ```bash
   npm start
   # Then scan QR with Expo Go app
   ```

3. **Wait for the app to load** (first time takes longer)

4. **Allow location permissions** when prompted

5. **Create your first track** and test!
