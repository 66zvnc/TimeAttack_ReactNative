# iOS Device Code Signing Setup

## Issue Resolved
✅ Changed bundle identifier to: `com.yourname.timeattackgps`

## Next Steps

### Option 1: Automatic Signing in Xcode (Recommended)

1. **Open the project in Xcode:**
   ```bash
   open ios/TimeAttack.xcworkspace
   ```

2. **Select the TimeAttack target:**
   - Click on "TimeAttack" in the left sidebar (blue icon)
   - Click on "TimeAttack" under TARGETS

3. **Enable Automatic Signing:**
   - Go to "Signing & Capabilities" tab
   - Check "Automatically manage signing"
   - Select your Team from the dropdown
     - If you don't see a team, click "Add Account" and sign in with your Apple ID
     - A free Apple ID works for development!

4. **Optional: Customize Bundle Identifier:**
   - In the same screen, you can change the bundle identifier
   - Use format: `com.yourname.timeattackgps`
   - Make it unique (e.g., `com.john.timeattackgps`)

5. **Trust Your Certificate on iPhone:**
   - On your iPhone, go to: Settings → General → VPN & Device Management
   - Tap on your developer profile
   - Tap "Trust"

### Option 2: Run Command Again

After setting up signing in Xcode, run:

```bash
npx expo run:ios --device
```

- It will list your connected devices
- Select your iPhone from the list
- The app will build and install

---

## Alternative: Use EAS Build (No Xcode Required)

If you prefer not to configure Xcode:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for device
eas build --platform ios --profile development
```

This builds in the cloud and gives you a download link!

---

## Troubleshooting

### "Development Team Not Found"
- Open Xcode
- Go to Preferences → Accounts
- Add your Apple ID
- A free account works for testing

### "iPhone is locked"
- Unlock your iPhone
- Keep it unlocked during installation

### "Untrusted Developer" on iPhone
- Settings → General → VPN & Device Management
- Trust your development certificate

---

## What Works Now?

✅ iOS Simulator: Use `npx expo run:ios`  
✅ Physical Device: After completing signing setup above  
✅ All location features will work on your device!
