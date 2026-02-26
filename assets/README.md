# Assets Placeholder

This directory should contain the following image assets for the app:

## Required Assets

1. **icon.png** (1024x1024)
   - App icon for iOS and Android
   - Should be a square PNG with no transparency for best results

2. **adaptive-icon.png** (1024x1024)
   - Adaptive icon for Android
   - Should be a square PNG

3. **splash.png** (1284x2778 or larger)
   - Splash screen image
   - Will be resized to fit different screen sizes

4. **favicon.png** (48x48 or larger)
   - Favicon for web version

## Asset Generation

You can generate these assets using:
- Design tools (Figma, Sketch, etc.)
- Online icon generators
- Expo asset generation tools

For now, the app will use Expo's default assets. To add custom assets:

1. Replace the placeholder files in this directory
2. Update `app.json` if you change filenames
3. Run `expo prebuild` if needed

## Quick Setup

To use default Expo assets temporarily, you can create simple colored squares:
- Icon: A solid color 1024x1024 PNG
- Splash: A branded splash screen image

The app will function without custom assets using Expo defaults.
