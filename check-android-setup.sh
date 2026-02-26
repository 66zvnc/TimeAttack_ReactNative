#!/bin/bash

# Android Setup Check Script for macOS

echo "🔍 Checking Android Development Setup..."
echo ""

# Check if Android Studio is installed
if [ -d "/Applications/Android Studio.app" ]; then
    echo "✅ Android Studio is installed"
else
    echo "❌ Android Studio NOT found in /Applications/"
    echo "   Download from: https://developer.android.com/studio"
    echo ""
fi

# Check if Android SDK exists
if [ -d "$HOME/Library/Android/sdk" ]; then
    echo "✅ Android SDK found at: $HOME/Library/Android/sdk"
else
    echo "❌ Android SDK NOT found at: $HOME/Library/Android/sdk"
    echo "   Install Android Studio to get the SDK"
    echo ""
fi

# Check ANDROID_HOME environment variable
if [ -z "$ANDROID_HOME" ]; then
    echo "❌ ANDROID_HOME environment variable NOT set"
    echo ""
    echo "📝 To fix this, add these lines to ~/.zshrc:"
    echo ""
    echo "export ANDROID_HOME=\$HOME/Library/Android/sdk"
    echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
    echo "export PATH=\$PATH:\$ANDROID_HOME/emulator"
    echo ""
    echo "Then run: source ~/.zshrc"
    echo ""
else
    echo "✅ ANDROID_HOME is set to: $ANDROID_HOME"
fi

# Check if adb is available
if command -v adb &> /dev/null; then
    echo "✅ adb is available"
    ADB_VERSION=$(adb --version | head -n 1)
    echo "   $ADB_VERSION"
else
    echo "❌ adb command NOT found"
    echo "   Make sure ANDROID_HOME/platform-tools is in PATH"
    echo ""
fi

# Check for running emulators
echo ""
echo "📱 Checking for Android emulators/devices:"
if command -v adb &> /dev/null; then
    DEVICES=$(adb devices | grep -v "List of devices attached" | grep -v "^$")
    if [ -z "$DEVICES" ]; then
        echo "   No devices/emulators running"
        echo "   Start an emulator in Android Studio: Tools → Device Manager"
    else
        echo "$DEVICES"
    fi
else
    echo "   Cannot check (adb not available)"
fi

echo ""
echo "🎯 Next Steps:"
echo ""

if [ ! -d "/Applications/Android Studio.app" ]; then
    echo "1. Install Android Studio from https://developer.android.com/studio"
elif [ -z "$ANDROID_HOME" ]; then
    echo "1. Set up environment variables in ~/.zshrc (see above)"
    echo "2. Run: source ~/.zshrc"
    echo "3. Run this script again to verify"
elif ! command -v adb &> /dev/null; then
    echo "1. Make sure to reload your shell: source ~/.zshrc"
    echo "2. Or restart your terminal"
else
    echo "1. Start an emulator in Android Studio"
    echo "2. Run: npx expo run:android"
    echo ""
    echo "✅ Your setup looks good!"
fi

echo ""
