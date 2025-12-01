package com.workouttracker

import android.content.Context
import android.content.SharedPreferences
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.*

object SampleDataGenerator {
    private val gson = Gson()
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    fun generateSampleData(context: Context) {
        val sharedPreferences = context.getSharedPreferences("WorkoutTracker", Context.MODE_PRIVATE)
        val calendar = Calendar.getInstance()

        // Generate data for the last 30 days
        val exercises = listOf(
            "Bench Press" to true,
            "Squat" to true,
            "Deadlift" to true,
            "Shoulder Press" to true,
            "Push-ups" to false,
            "Pull-ups" to false,
            "Bicep Curls" to true,
            "Tricep Pulldowns" to true
        )

        // Generate workouts for the last 30 days (every 2 days)
        // dayOffset: 0 = today, -30 = 30 days ago
        // We want: older dates = lower values, newer dates = higher values
        for (dayOffset in 0 downTo -30 step 2) {
            val workoutDate = Calendar.getInstance().apply {
                time = Date()
                add(Calendar.DAY_OF_YEAR, dayOffset)
            }
            val dateKey = dateFormat.format(workoutDate.time)
            
            // Calculate progression: 0 = today (highest), 30 = 30 days ago (lowest)
            val daysAgo = Math.abs(dayOffset)
            // Number of workouts from oldest to this one (0 = oldest workout, 15 = newest workout)
            val workoutNumber = (30 - daysAgo) / 2

            val workoutData = exercises.mapIndexed { index, (name, isWeighted) ->
                val sets = mutableListOf<Map<String, Any>>()

                if (isWeighted) {
                    // Progressive weight increase: start at 50 lbs, add 2.5 lbs per workout
                    // workoutNumber 0 = 50 lbs, workoutNumber 15 = 87.5 lbs
                    val baseWeight = 50.0 + (workoutNumber * 2.5)
                    val numSets = 3 + (index % 2) // 3 or 4 sets

                    for (setNum in 1..numSets) {
                        val weight = baseWeight + (setNum * 5.0)
                        val reps = 8 + (setNum % 3) // 8, 9, or 10 reps
                        sets.add(mapOf("weight" to weight, "reps" to reps))
                    }
                } else {
                    // Progressive reps: start at 10, add 1 per workout
                    val baseReps = 10 + workoutNumber
                    sets.add(mapOf("weight" to 0.0, "reps" to baseReps))
                }

                mapOf(
                    "name" to name,
                    "isWeighted" to isWeighted,
                    "sets" to sets,
                    "completed" to true
                )
            }

            val json = gson.toJson(workoutData)
            sharedPreferences.edit().putString("workout_$dateKey", json).apply()
        }

        // Add some variation - not every exercise every day
        // Remove some exercises randomly from some days
        val allKeys = sharedPreferences.all.keys.filter { it.startsWith("workout_") }
        allKeys.forEachIndexed { index, key ->
            if (index % 3 == 0) { // Every 3rd workout, remove some exercises
                val json = sharedPreferences.getString(key, null) ?: return@forEachIndexed
                val type = object : TypeToken<List<Map<String, Any>>>() {}.type
                val workoutData: MutableList<Map<String, Any>> = gson.fromJson(json, type)
                
                // Remove 1-2 random exercises
                if (workoutData.size > 2) {
                    workoutData.removeAt(workoutData.size - 1)
                    val updatedJson = gson.toJson(workoutData)
                    sharedPreferences.edit().putString(key, updatedJson).apply()
                }
            }
        }
        
        // Generate cardio data for the last 30 days
        val cardioExercises = listOf("Cycling", "Stair Master", "Walking", "Sports")
        
        for (dayOffset in 0 downTo -30 step 2) {
            val workoutDate = Calendar.getInstance().apply {
                time = Date()
                add(Calendar.DAY_OF_YEAR, dayOffset)
            }
            val dateKey = dateFormat.format(workoutDate.time)
            
            val daysAgo = Math.abs(dayOffset)
            val workoutNumber = (30 - daysAgo) / 2
            
            val cardioData = cardioExercises.mapIndexed { index, name ->
                // Progressive increase in duration and metrics over time
                val baseDuration = 20 + (workoutNumber * 2) // Start at 20 min, increase by 2 min per workout
                val duration = baseDuration + (index * 5) // Vary by exercise
                
                // Heart rate zones (progressive)
                val avgBpm = 120 + (workoutNumber * 2) + (index * 5)
                val minHr = avgBpm - 20
                val maxHr = avgBpm + 30
                
                // Calories (progressive)
                val calories = 150 + (workoutNumber * 10) + (index * 20)
                
                // Zone times (distributed across zones, with progression)
                val zone1Time = (duration * 0.2).toInt() + workoutNumber
                val zone2Time = (duration * 0.3).toInt() + workoutNumber
                val zone3Time = (duration * 0.25).toInt() + workoutNumber
                val zone4Time = (duration * 0.15).toInt() + (workoutNumber / 2)
                val zone5Time = (duration * 0.1).toInt() + (workoutNumber / 3)
                
                mapOf(
                    "name" to name,
                    "duration" to duration,
                    "avgBpm" to avgBpm,
                    "calories" to calories,
                    "minHeartRate" to minHr,
                    "maxHeartRate" to maxHr,
                    "zone1Time" to zone1Time,
                    "zone2Time" to zone2Time,
                    "zone3Time" to zone3Time,
                    "zone4Time" to zone4Time,
                    "zone5Time" to zone5Time,
                    "completed" to true
                )
            }
            
            val cardioJson = gson.toJson(cardioData)
            sharedPreferences.edit().putString("cardio_$dateKey", cardioJson).apply()
        }
    }
}

