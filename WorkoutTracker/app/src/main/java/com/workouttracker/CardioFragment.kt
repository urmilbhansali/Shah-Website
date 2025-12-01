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

class CardioFragment : Fragment() {
    private lateinit var cardioAdapter: CardioAdapter
    private val cardioExercises = mutableListOf<CardioExercise>()
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
        return inflater.inflate(R.layout.fragment_cardio, container, false)
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

        // Initialize cardio exercises
        initializeCardioExercises()

        // Setup RecyclerView
        val recyclerView = view.findViewById<RecyclerView>(R.id.cardioRecyclerView)
        cardioAdapter = CardioAdapter(cardioExercises) { saveCardio() }
        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        recyclerView.adapter = cardioAdapter

        // Load cardio for current date
        loadCardio()
    }

    private fun initializeCardioExercises() {
        cardioExercises.clear()
        cardioExercises.add(CardioExercise("Cycling"))
        cardioExercises.add(CardioExercise("Stair Master"))
        cardioExercises.add(CardioExercise("Walking"))
        cardioExercises.add(CardioExercise("Sports"))
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
                loadCardio()
            },
            year, month, day
        ).show()
    }

    private fun getDateKey(): String {
        return dateFormat.format(currentDate.time)
    }

    private fun saveCardio() {
        val dateKey = getDateKey()
        val cardioData = cardioExercises.map { exercise ->
            mapOf(
                "name" to exercise.name,
                "duration" to exercise.duration,
                "avgBpm" to exercise.avgBpm,
                "calories" to exercise.calories,
                "minHeartRate" to exercise.minHeartRate,
                "maxHeartRate" to exercise.maxHeartRate,
                "zone1Time" to exercise.zone1Time,
                "zone2Time" to exercise.zone2Time,
                "zone3Time" to exercise.zone3Time,
                "zone4Time" to exercise.zone4Time,
                "zone5Time" to exercise.zone5Time,
                "completed" to exercise.completed
            )
        }
        val json = gson.toJson(cardioData)
        sharedPreferences.edit().putString("cardio_$dateKey", json).apply()
    }

    private fun loadCardio() {
        val dateKey = getDateKey()
        val json = sharedPreferences.getString("cardio_$dateKey", null)
        
        if (json != null) {
            val type = object : TypeToken<List<Map<String, Any>>>() {}.type
            @Suppress("UNCHECKED_CAST")
            val cardioData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: emptyList()
            
            cardioData.forEach { data ->
                val name = data["name"] as? String ?: return@forEach
                val exercise = cardioExercises.find { it.name == name } ?: return@forEach
                
                exercise.duration = (data["duration"] as? Int) ?: (data["duration"] as? Number)?.toInt() ?: 0
                exercise.avgBpm = (data["avgBpm"] as? Int) ?: (data["avgBpm"] as? Number)?.toInt() ?: 0
                exercise.calories = (data["calories"] as? Int) ?: (data["calories"] as? Number)?.toInt() ?: 0
                exercise.minHeartRate = (data["minHeartRate"] as? Int) ?: (data["minHeartRate"] as? Number)?.toInt() ?: 0
                exercise.maxHeartRate = (data["maxHeartRate"] as? Int) ?: (data["maxHeartRate"] as? Number)?.toInt() ?: 0
                exercise.zone1Time = (data["zone1Time"] as? Int) ?: (data["zone1Time"] as? Number)?.toInt() ?: 0
                exercise.zone2Time = (data["zone2Time"] as? Int) ?: (data["zone2Time"] as? Number)?.toInt() ?: 0
                exercise.zone3Time = (data["zone3Time"] as? Int) ?: (data["zone3Time"] as? Number)?.toInt() ?: 0
                exercise.zone4Time = (data["zone4Time"] as? Int) ?: (data["zone4Time"] as? Number)?.toInt() ?: 0
                exercise.zone5Time = (data["zone5Time"] as? Int) ?: (data["zone5Time"] as? Number)?.toInt() ?: 0
                exercise.completed = (data["completed"] as? Boolean) ?: false
            }
        }
        
        cardioAdapter.notifyDataSetChanged()
    }

    override fun onPause() {
        super.onPause()
        saveCardio()
    }
}

