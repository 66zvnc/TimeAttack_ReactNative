# Fixing "EMFILE: too many open files" Error

## The Issue
This error occurs on macOS when Metro bundler tries to watch too many files without Watchman installed.

## ✅ Good News
Your Expo server **did start successfully** and showed the QR code before the error. The app should work, but let's fix this properly.

## Solution: Install Watchman

### Step 1: Install Homebrew (if not installed)

Open Terminal and run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. This may take a few minutes.

After installation, you may need to add Homebrew to your PATH:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Step 2: Install Watchman

```bash
brew install watchman
```

### Step 3: Restart Expo

```bash
cd /Users/macbook/Downloads/TimeAttack_ReactNative
npm start
```

The error should be gone!

---

## Alternative: Quick Fix (If you can't install Homebrew now)

The Metro config I created (`metro.config.js`) should help reduce the issue. You can also:

1. **Ignore the error** - The server started and the QR code appeared. You can scan it and use the app.

2. **Restart with fewer workers**:
   ```bash
   EXPO_MAX_WORKERS=2 npm start
   ```

3. **Clear everything and try again**:
   ```bash
   rm -rf node_modules
   npm install
   npm start
   ```

---

## Why This Happens

- macOS has system limits on file watchers
- Metro bundler (React Native's bundler) watches many files for hot reloading
- **Watchman** is a file watching service from Facebook specifically designed for this
- It's **required** for optimal React Native development on macOS

## Recommended

Install Watchman - it takes 5 minutes and fixes this permanently for all React Native/Expo projects.
