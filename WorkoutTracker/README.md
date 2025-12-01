# Workout Tracker Android App

A simple Android application for tracking workouts with support for both weighted and non-weighted exercises.

## Features

- **Exercise List**: View a list of exercises (both weighted and non-weighted)
- **Weighted Exercises**: 
  - Input weight and reps for each set
  - Add multiple sets with "Add Set" button
  - Columns display: Set number, Weight, Reps
- **Non-weighted Exercises**: 
  - Simple reps input field
  - Perfect for bodyweight exercises like push-ups, pull-ups, etc.

## Project Structure

```
WorkoutTracker/
├── app/
│   ├── src/main/
│   │   ├── java/com/workouttracker/
│   │   │   ├── MainActivity.kt          # Main activity
│   │   │   ├── Exercise.kt              # Data models
│   │   │   ├── ExerciseAdapter.kt       # RecyclerView adapter for exercises
│   │   │   └── SetAdapter.kt            # RecyclerView adapter for sets
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   ├── activity_main.xml    # Main activity layout
│   │   │   │   ├── item_exercise.xml    # Exercise item layout
│   │   │   │   └── item_set.xml         # Set item layout
│   │   │   └── values/
│   │   │       ├── strings.xml
│   │   │       ├── colors.xml
│   │   │       └── themes.xml
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
├── settings.gradle
└── gradle.properties
```

## Building the App

### Prerequisites

- Android Studio (latest version recommended)
- JDK 8 or higher
- Android SDK (API 24 or higher)

### Steps to Build

1. Open the project in Android Studio
2. Wait for Gradle sync to complete
3. Connect an Android device or start an emulator
4. Click "Run" or press `Shift+F10` to build and run the app

### Using Gradle Command Line

```bash
cd WorkoutTracker
./gradlew assembleDebug
```

The APK will be generated at: `app/build/outputs/apk/debug/app-debug.apk`

## How to Use

1. **Weighted Exercises** (e.g., Bench Press, Squat):
   - Each exercise shows a table with columns: Set, Weight, Reps
   - Enter the weight and number of reps for each set
   - Click "Add Set" to add more sets
   - Data is automatically saved when you move focus away from input fields

2. **Non-weighted Exercises** (e.g., Push-ups, Pull-ups):
   - Simply enter the number of reps in the input field
   - Data is saved automatically

## Sample Exercises Included

The app comes pre-loaded with sample exercises:

**Weighted:**
- Bench Press
- Squat
- Deadlift
- Shoulder Press
- Barbell Row

**Non-weighted:**
- Push-ups
- Pull-ups
- Sit-ups
- Plank (seconds)

## Customization

To add or modify exercises, edit the `initializeExercises()` function in `MainActivity.kt`:

```kotlin
exercises.add(Exercise("Your Exercise Name", isWeighted = true/false))
```

## Technical Details

- **Language**: Kotlin
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)
- **Architecture**: Standard Android with RecyclerView
- **UI**: Material Design Components

## Future Enhancements

Potential features to add:
- Save workout history
- Progress tracking over time
- Custom exercise creation
- Workout templates
- Data persistence (SharedPreferences or Room database)


