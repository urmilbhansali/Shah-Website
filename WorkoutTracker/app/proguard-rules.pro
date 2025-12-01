# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.

# Keep data classes used with Gson
-keep class com.workouttracker.Exercise { *; }
-keep class com.workouttracker.WorkoutSet { *; }
-keep class com.workouttracker.ExerciseCategory { *; }
-keep class com.workouttracker.CardioExercise { *; }

# Keep Gson classes
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.** { *; }
-keep class * implements com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Keep MPAndroidChart classes
-keep class com.github.mikephil.charting.** { *; }

# Keep Android classes
-keep class androidx.** { *; }
-keep class android.** { *; }

# Keep application classes
-keep class com.workouttracker.** { *; }
