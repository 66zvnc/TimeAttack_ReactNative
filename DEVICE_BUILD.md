# Building for Physical iOS Device

## Why You Need This

Expo Go doesn't support custom native configurations like location permissions. To use the app on your physical device, you need to create a custom development build.

## ✅ FREE METHOD (No Paid Account Needed!)

You can test on your device **for free** using a local build with any Apple ID!

### Requirements
- FREE Apple ID (icloud.com, gmail.com, any email works!)
- Xcode installed on your Mac
- Your iPhone connected via USB

### Steps:

1. **Open Xcode and add your FREE Apple ID:**
   ```bash
   open ios/TimeAttack.xcworkspace
   ```
   - Xcode → Settings → Accounts
   - Click `+` → Add Apple ID
   - Sign in with ANY Apple ID (doesn't need to be paid!)

2. **Enable Automatic Signing:**
   - Select "TimeAttack" project in left sidebar (blue icon)
   - Select "TimeAttack" under TARGETS
   - Go to "Signing & Capabilities" tab
   - Check ✅ "Automatically manage signing"
   - Team: Select your Apple ID (shows as "Personal Team")

3. **Connect your iPhone via USB and unlock it**

4. **Build and run:**
   ```bash
   npx expo run:ios --device
   ```
   - Select your device from the list
   - It will build and install!

5. **Trust the certificate on your iPhone:**
   - Settings → General → VPN & Device Management
   - Tap your Apple ID email
   - Tap "Trust"

6. **Launch the app!**

### Limitations of Free Apple ID:
- App expires after 7 days (just rebuild)
- Can only have 3 apps installed at once
- No TestFlight distribution
- **Perfect for development and testing!**

---

## Alternative: EAS Build (Cloud - Requires Paid Account)

**⚠️ Requires Apple Developer Program ($99/year)**

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure EAS
```bash
eas build:configure
```

### 4. Create Development Build
```bash
eas build --platform ios --profile development
```

This will:
- Build your app in the cloud
- Generate a download link
- You can install it on your device via TestFlight or direct install

### 5. Install on Your Device

Once the build completes, scan the QR code or download via TestFlight.

### 6. Start Dev Server
```bash
npx expo start --dev-client
```

Now your physical device will work with all location features!

---

## iOS Simulator (Also Free!)

If you don't need to test on a physical device yet:

```bash
npx expo run:ios
```

The simulator has full location simulation and works perfectly for development!

---

## Comparison

| Method | Cost | Setup Time | Best For |
|--------|------|------------|----------|
| **Local Build (Free Apple ID)** | **FREE** | **5 mins** | **Testing on YOUR device** ⭐ |
| EAS Build | $99/year | 10 mins | TestFlight distribution |
| iOS Simulator | Free | None | Development without device |
| Expo Go | Free | None | Simple apps only |

## Recommendation

For your TimeAttack app:
1. **Develop**: Use iOS Simulator (`npx expo run:ios`)
2. **Test on YOUR device**: Use FREE local build method above ⭐
3. **Distribute to others**: Get paid account + use EAS Build
4. **Production**: Build full release with EAS

The FREE method is perfect for testing GPS features on your own device!
