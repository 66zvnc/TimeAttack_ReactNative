# Android Setup Guide

## ✅ Android Configuration Complete

Your app now supports Android with Google Maps!

- **iOS**: Uses Apple Maps (unchanged)
- **Android**: Uses Google Maps

---

## Quick Setup Check

Run this to check your Android setup:

```bash
./check-android-setup.sh
```

This will tell you what's missing and what to do next.

---

## Prerequisites: Install Android Studio

**⚠️ You need to install Android Studio first!**

Already have Android Studio? Skip to [step 4](#4-get-google-maps-api-key-required-for-android).

**Check if Android Studio is installed:**

```bash
adb --version
```

If you see "Android Debug Bridge version...", you're good! If not, follow steps 1-3 below.

---

### 1. Download and Install Android Studio

1. **Download Android Studio:**
   - Go to https://developer.android.com/studio
   - Download Android Studio for macOS
   - Open the downloaded `.dmg` file
   - Drag Android Studio to Applications folder

2. **Launch Android Studio and complete setup:**
   - Open Android Studio
   - Click "Next" through the setup wizard
   - Choose "Standard" installation
   - Accept licenses
   - Wait for SDK components to download (this takes 5-10 minutes)

3. **Set up Android SDK:**
   - Android Studio will install SDK automatically
   - Default location: `/Users/macbook/Library/Android/sdk`

### 2. Configure Environment Variables

Add these lines to your shell configuration file:

```bash
# Open your shell config file
nano ~/.zshrc
```

Add these lines at the end:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Save and reload:

```bash
# Press Ctrl+O to save, Ctrl+X to exit
source ~/.zshrc
```

Verify installation:

```bash
adb --version
# Should show: Android Debug Bridge version...
```

### 3. Create Android Virtual Device (Emulator)

1. **Open Android Studio**
2. **Click "More Actions" → "Virtual Device Manager"**
3. **Click "Create Virtual Device"**
4. **Select a device** (e.g., Pixel 5)
5. **Click "Next"**
6. **Download system image** (e.g., Android 13 / API 33 - recommended)
7. **Click "Finish"**
8. **Click the Play button** to start the emulator

---

## Setup Steps

### 4. Get Google Maps API Key (Required for Android)

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com/

2. **Create a new project or select existing one**

3. **Enable Maps SDK for Android:**
   - Go to "APIs & Services" → "Library"
   - Search for "Maps SDK for Android"
   - Click "Enable"
   AIzaSyBI4BrDGqlDoEbSY_ok9UEjXdtdgd52Fy4

4. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
   AIzaSyBFAjtpcBdMuXkledgxsnoIX7IW4kAs_hg

5. **Restrict the API Key (Recommended):**
   - Click on your API key
   - Under "Application restrictions", select "Android apps"
   - Add your package name: `com.yourname.timeattackgps`
   - Under "API restrictions", select "Restrict key"
   - Choose "Maps SDK for Android"
   - Click "Save"

### 5. Add API Key to app.json

Open `app.json` and replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "AIzaSyCXXXXXXXXXXXXXXXXXXXXXXXX"
    }
  }
}
```

### 6. Build for Android

**Make sure Android Studio is installed and emulator is running first!**

#### Option A: Android Emulator

```bash
npx expo run:android
```

This will:
- Start Android emulator if not running
- Build and install the app
- Launch the app

#### Option B: Physical Android Device

1. **Enable Developer Options on your Android device:**
   - Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back → Developer Options
   - Enable "USB Debugging"

2. **Connect via USB and run:**
   ```bash
   npx expo run:android --device
   ```

---

## What Changed

✅ **Added Android configuration** in `app.json`:
- Google Maps API key configuration
- Location permissions for Android
- Background location enabled

✅ **Updated MapView components** to use platform-specific providers:
- iOS: Apple Maps (default)
- Android: Google Maps (PROVIDER_GOOGLE)

✅ **No changes to**:
- Layout
- Styling
- Functionality
- iOS behavior

---

## Testing Location Features on Android

### Android Emulator:
1. Open emulator
2. Click "..." (more options)
3. Go to "Location"
4. Set custom GPS coordinates or use route playback

### Physical Device:
- Location features work with real GPS
- Remember to grant location permissions when prompted

---

## Troubleshooting

### "Failed to resolve the Android SDK path" or "spawn adb ENOENT"
**This means Android Studio is not installed or not configured properly.**

1. **Install Android Studio** (see steps 1-3 above)
2. **Set environment variables** in `~/.zshrc`:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
3. **Reload shell:**
   ```bash
   source ~/.zshrc
   ```
4. **Verify:**
   ```bash
   adb --version
   ```

### "Map not loading on Android"
- Check that you added a valid Google Maps API key in `app.json`
- Make sure Maps SDK for Android is enabled in Google Cloud Console
- Rebuild the app: `npx expo run:android`

### "Location permission denied"
- Grant location permissions when the app asks
- Or go to: Settings → Apps → TimeAttack → Permissions → Location → "Allow all the time"

### "App crashes on launch"
- Make sure you have a valid API key
- Check if package name matches in Google Cloud Console restrictions

---

## Platform Differences

| Feature | iOS | Android |
|---------|-----|---------|
| Map Provider | Apple Maps | Google Maps |
| Location Tracking | ✅ | ✅ |
| Background Tracking | ✅ | ✅ |
| Layout | ✅ Same | ✅ Same |
| Functionality | ✅ Same | ✅ Same |

Everything works the same on both platforms!
