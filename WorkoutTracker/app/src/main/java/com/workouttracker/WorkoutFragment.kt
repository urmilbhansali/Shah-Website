package com.workouttracker

import android.app.DatePickerDialog
import android.content.Context
import android.content.SharedPreferences
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.*

class WorkoutFragment : Fragment() {
    private lateinit var categoryAdapter: CategoryAdapter
    private val categories = mutableListOf<ExerciseCategory>()
    private lateinit var dateTextView: TextView
    private var currentDate: Calendar = Calendar.getInstance()
    private lateinit var sharedPreferences: SharedPreferences
    private val gson = Gson()
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    private val displayDateFormat = SimpleDateFormat("MMM dd, yyyy", Locale.getDefault())

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_workout, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sharedPreferences = requireContext().getSharedPreferences("WorkoutTracker", Context.MODE_PRIVATE)

        // Setup date display
        dateTextView = view.findViewById(R.id.dateTextView)
        updateDateDisplay()
        dateTextView.setOnClickListener {
            showDatePicker()
        }

        // Initialize exercises
        initializeExercises()
        
        // Sort exercises (put completed at top)
        sortExercises()

        // Setup RecyclerView
        val recyclerView = view.findViewById<RecyclerView>(R.id.exercisesRecyclerView)
        categoryAdapter = CategoryAdapter(
            categories, 
            sharedPreferences, 
            gson, 
            dateFormat,
            { saveWorkout() }
        )
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        recyclerView.adapter = categoryAdapter

        // Load workout for current date
        loadWorkout()
    }

    private fun getCompletedExercises(): Set<String> {
        val allKeys = sharedPreferences.all.keys.filter { it.startsWith("workout_") }
        val completedExercises = mutableSetOf<String>()
        
        allKeys.forEach outer@{ key ->
            val json = sharedPreferences.getString(key, null) ?: return@outer
            val type = object : TypeToken<List<Map<String, Any>>>() {}.type
            @Suppress("UNCHECKED_CAST")
            val workoutData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: return@outer
            workoutData.forEach inner@{ data ->
                val name = data["name"] as? String ?: return@inner
                val completed = (data["completed"] as? Boolean) ?: false
                if (completed) {
                    completedExercises.add(name)
                }
            }
        }
        
        return completedExercises
    }

    private fun sortExercises() {
        val completedExercises = getCompletedExercises()
        
        categories.forEach { category ->
            // Sort: completed first, then non-completed
            val sortedExercises = category.exercises.sortedWith(compareBy(
                { it.name !in completedExercises }, // Completed first (false comes before true)
                { it.name } // Then alphabetically
            ))
            
            category.exercises.clear()
            category.exercises.addAll(sortedExercises)
        }
    }

    private fun initializeExercises() {
        categories.clear()
        
        // Upper Body Strength
        val upperBodyCategory = ExerciseCategory("Upper Body Strength", mutableListOf(
            // Biceps
            Exercise("Dumbbell Bicep Curls", isWeighted = true, notes = "light–moderate weight, slow tempo"),
            Exercise("Hammer Curls", isWeighted = true, notes = "wrist-neutral → safer for elbows"),
            Exercise("Cable Curls", isWeighted = true, notes = "controlled range"),
            // Back
            Exercise("Lat Pulldown", isWeighted = true, notes = "already confirmed safe if done controlled"),
            Exercise("Seated Row", isWeighted = true, notes = "light–moderate weight, avoid leaning back"),
            Exercise("Chest-Supported Row", isWeighted = true, notes = "very joint-safe"),
            Exercise("Single-Arm Cable Row", isWeighted = true, notes = "good for pelvic/core stability"),
            // Chest
            Exercise("Chest Press Machine", isWeighted = true, notes = "Safe as long as you avoid breath-holding and keep ribcage tight"),
            Exercise("Push-ups on Bench", isWeighted = false, notes = "incline push-up"),
            Exercise("Dumbbell Floor Press", isWeighted = true, notes = "safer than bench due to limited ROM"),
            // Shoulders
            Exercise("Dumbbell Shoulder Press", isWeighted = true, notes = "light → moderate only, neutral grip"),
            Exercise("Lateral Raises", isWeighted = true, notes = "very light weight"),
            Exercise("Front Raises", isWeighted = true, notes = "light"),
            Exercise("Cable Face Pulls", isWeighted = true, notes = "light"),
            // Arms (Triceps)
            Exercise("Tricep Rope Pushdowns", isWeighted = true),
            Exercise("Overhead Tricep Rope Extension", isWeighted = true, notes = "light"),
            Exercise("Bench Dips", isWeighted = false, notes = "only if no shoulder instability")
        ))
        categories.add(upperBodyCategory)

        // Lower Body Strength
        val lowerBodyStrengthCategory = ExerciseCategory("Lower Body Strength", mutableListOf(
            // Glutes & Hamstrings
            Exercise("Glute Bridges", isWeighted = false),
            Exercise("Hip Thrust", isWeighted = true, notes = "light–moderate"),
            Exercise("Romanian Deadlift with Dumbbells", isWeighted = true, notes = "very light, perfect form"),
            Exercise("Hamstring Curls", isWeighted = true, notes = "machine"),
            // Quads
            Exercise("Leg Press", isWeighted = true, notes = "light–light-moderate, stable back, no deep flexion"),
            Exercise("Leg Extension", isWeighted = true, notes = "light, slow"),
            Exercise("Step-Ups", isWeighted = true, notes = "light dumbbells optional"),
            Exercise("Split Squat", isWeighted = false, notes = "small range"),
            // Calves
            Exercise("Standing Calf Raise", isWeighted = true),
            Exercise("Seated Calf Raise", isWeighted = true)
        ))
        categories.add(lowerBodyStrengthCategory)

        // Core Strength
        val coreStrengthCategory = ExerciseCategory("Core Strength", mutableListOf(
            Exercise("Pallof Press", isWeighted = true, notes = "Strength but low pressure"),
            Exercise("Cable Anti-Rotation Hold", isWeighted = true, notes = "Strength but low pressure"),
            Exercise("Dead Bug Variations", isWeighted = false, notes = "Strength but low pressure"),
            Exercise("Bird Dog", isWeighted = false, notes = "slow, Strength but low pressure")
        ))
        categories.add(coreStrengthCategory)

        // Shoulder & Scapula Stability
        val shoulderCategory = ExerciseCategory("Shoulder & Scapula Stability", mutableListOf(
            Exercise("Scapular Retractions", isWeighted = false),
            Exercise("Wall Slides", isWeighted = false),
            Exercise("Serratus Wall Press", isWeighted = false),
            Exercise("Band External Rotations", isWeighted = false, notes = "very light band"),
            Exercise("Band Internal Rotations", isWeighted = false, notes = "optional"),
            Exercise("Prone Y / T / W", isWeighted = false, notes = "only if very controlled"),
            Exercise("Face Pulls", isWeighted = false, notes = "ultra-light band")
        ))
        categories.add(shoulderCategory)

        // Core Stability
        val coreCategory = ExerciseCategory("Core Stability", mutableListOf(
            Exercise("Dead Bug", isWeighted = false, notes = "slow, small range"),
            Exercise("Bird Dog", isWeighted = false),
            Exercise("Pallof Press", isWeighted = false, notes = "light band, ribs down"),
            Exercise("Side-Plank", isWeighted = false, notes = "knees bent version"),
            Exercise("Glute Bridge", isWeighted = false, notes = "slow lift"),
            Exercise("Seated Marches", isWeighted = false, notes = "core engaged"),
            Exercise("Anti-rotation holds", isWeighted = false),
            Exercise("Wall Press Dead Bug", isWeighted = false)
        ))
        categories.add(coreCategory)

        // Lower Body Stability
        val lowerBodyCategory = ExerciseCategory("Lower Body Stability", mutableListOf(
            Exercise("Mini-Squats", isWeighted = false, notes = "supported or wall-sits light"),
            Exercise("Step-Ups", isWeighted = false, notes = "low step"),
            Exercise("Glute Bridges / Hip Thrust", isWeighted = false, notes = "light"),
            Exercise("Standing Hip Abductions", isWeighted = false),
            Exercise("Standing Hip Extensions", isWeighted = false),
            Exercise("Lateral Band Walks", isWeighted = false, notes = "light band"),
            Exercise("Heel Raises", isWeighted = false),
            Exercise("Split Squat", isWeighted = false, notes = "highly controlled, small range")
        ))
        categories.add(lowerBodyCategory)

        // Hip & Pelvis Stability
        val hipCategory = ExerciseCategory("Hip & Pelvis Stability", mutableListOf(
            Exercise("Isometric Adductor Squeeze", isWeighted = false, notes = "pillow between knees"),
            Exercise("Isometric Abductor Press", isWeighted = false, notes = "press knees outward into band"),
            Exercise("Clamshells", isWeighted = false),
            Exercise("Single-Leg Balance", isWeighted = false, notes = "short holds"),
            Exercise("Pelvic Tilts", isWeighted = false)
        ))
        categories.add(hipCategory)

        // Neck & Upper Spine Stability
        val neckCategory = ExerciseCategory("Neck & Upper Spine Stability", mutableListOf(
            Exercise("Chin Tucks", isWeighted = false),
            Exercise("Wall Head Press", isWeighted = false),
            Exercise("Scapular Setting", isWeighted = false),
            Exercise("Isometric Neck Side Holds", isWeighted = false)
        ))
        categories.add(neckCategory)

        // General Mobility
        val mobilityCategory = ExerciseCategory("General Mobility", mutableListOf(
            Exercise("Cat-Cow", isWeighted = false, notes = "slow"),
            Exercise("Thoracic Extensions over foam roller", isWeighted = false),
            Exercise("Hip Flexor Stretch", isWeighted = false, notes = "gentle"),
            Exercise("Calf Stretch", isWeighted = false)
        ))
        categories.add(mobilityCategory)
    }

    private fun updateDateDisplay() {
        dateTextView.text = displayDateFormat.format(currentDate.time)
    }

    private fun showDatePicker() {
        val year = currentDate.get(Calendar.YEAR)
        val month = currentDate.get(Calendar.MONTH)
        val day = currentDate.get(Calendar.DAY_OF_MONTH)

        DatePickerDialog(
            requireContext(),
            { _, selectedYear, selectedMonth, selectedDay ->
                currentDate.set(selectedYear, selectedMonth, selectedDay)
                updateDateDisplay()
                loadWorkout()
            },
            year, month, day
        ).show()
    }

    private fun getDateKey(): String {
        return dateFormat.format(currentDate.time)
    }

    private fun saveWorkout() {
        val dateKey = getDateKey()
        val workoutData = categories.flatMap { category ->
            category.exercises.map { exercise ->
                mapOf(
                    "name" to exercise.name,
                    "isWeighted" to exercise.isWeighted,
                    "notes" to exercise.notes,
                    "sets" to exercise.sets.map { set ->
                        mapOf("weight" to set.weight, "reps" to set.reps)
                    },
                    "completed" to exercise.completed
                )
            }
        }
        val json = gson.toJson(workoutData)
        sharedPreferences.edit().putString("workout_$dateKey", json).apply()
        
        // Re-sort exercises after saving (completed exercises move to top)
        sortExercises()
        categoryAdapter.notifyDataSetChanged()
    }

    private fun loadWorkout() {
        val dateKey = getDateKey()
        val json = sharedPreferences.getString("workout_$dateKey", null)
        
        if (json != null) {
            // Load saved workout for this date
            val type = object : TypeToken<List<Map<String, Any>>>() {}.type
            @Suppress("UNCHECKED_CAST")
            val workoutData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: emptyList()
            
            // Match exercises by name across all categories
            workoutData.forEach { data ->
                val exerciseName = data["name"] as? String ?: return@forEach
                val exercise = categories.flatMap { it.exercises }.find { it.name == exerciseName } ?: return@forEach
                @Suppress("UNCHECKED_CAST")
                val setsData = (data["sets"] as? List<*>)?.mapNotNull { it as? Map<String, Any> } ?: emptyList()
                exercise.sets.clear()
                exercise.completed = (data["completed"] as? Boolean) ?: false
                setsData.forEach { setData ->
                    val weight = (setData["weight"] as? Double) ?: (setData["weight"] as? Number)?.toDouble() ?: 0.0
                    val reps = (setData["reps"] as? Int) ?: (setData["reps"] as? Number)?.toInt() ?: 0
                    exercise.sets.add(WorkoutSet(weight, reps))
                }
            }
        } else {
            // No workout for this date, try to load last workout
            loadLastWorkout()
        }
        
        sortExercises()
        categoryAdapter.notifyDataSetChanged()
    }

    private fun loadLastWorkout() {
        // Get all saved workout keys
        val allKeys = sharedPreferences.all.keys.filter { it.startsWith("workout_") }
        if (allKeys.isEmpty()) return

        // Sort by date (key format: workout_yyyy-MM-dd)
        val sortedKeys = allKeys.sortedByDescending { it }
        if (sortedKeys.isEmpty()) return

        // Load the most recent workout
        val lastWorkoutJson = sharedPreferences.getString(sortedKeys[0], null) ?: return
        val type = object : TypeToken<List<Map<String, Any>>>() {}.type
        @Suppress("UNCHECKED_CAST")
        val workoutData: List<Map<String, Any>> = gson.fromJson(lastWorkoutJson, type) as? List<Map<String, Any>> ?: return

        // Match exercises by name and populate previous values
        workoutData.forEach { data ->
            val exerciseName = data["name"] as? String ?: return@forEach
            val exercise = categories.flatMap { it.exercises }.find { it.name == exerciseName } ?: return@forEach
            @Suppress("UNCHECKED_CAST")
            val setsData = (data["sets"] as? List<*>)?.mapNotNull { it as? Map<String, Any> } ?: emptyList()
            
            // Store previous values for display
            exercise.previousSets.clear()
            setsData.forEach { setData ->
                val weight = (setData["weight"] as? Double) ?: (setData["weight"] as? Number)?.toDouble() ?: 0.0
                val reps = (setData["reps"] as? Int) ?: (setData["reps"] as? Number)?.toInt() ?: 0
                if (weight > 0 || reps > 0) {
                    exercise.previousSets.add(WorkoutSet(weight, reps))
                }
            }
        }
    }

    override fun onPause() {
        super.onPause()
        saveWorkout()
    }
}

