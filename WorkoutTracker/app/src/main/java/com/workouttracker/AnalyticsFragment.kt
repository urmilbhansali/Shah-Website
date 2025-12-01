package com.workouttracker

import android.content.Context
import android.content.SharedPreferences
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Spinner
import androidx.fragment.app.Fragment
import com.github.mikephil.charting.charts.LineChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.Entry
import com.github.mikephil.charting.data.LineData
import com.github.mikephil.charting.data.LineDataSet
import com.github.mikephil.charting.formatter.ValueFormatter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.*

class AnalyticsFragment : Fragment() {
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var exerciseSpinner: Spinner
    private lateinit var progressionChart: LineChart
    private lateinit var periodTabLayout: com.google.android.material.tabs.TabLayout
    private lateinit var cardioMetricTabLayout: com.google.android.material.tabs.TabLayout
    private lateinit var xAxisLabel: android.widget.TextView
    private lateinit var yAxisLabel: android.widget.TextView
    private val gson = Gson()
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    private var currentPeriod = "Week"
    private var currentCardioMetric = "Total Time"
    private val exerciseNames = mutableListOf<String>()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_analytics, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sharedPreferences = requireContext().getSharedPreferences("WorkoutTracker", Context.MODE_PRIVATE)

        exerciseSpinner = view.findViewById(R.id.exerciseSpinner)
        progressionChart = view.findViewById(R.id.progressionChart)
        periodTabLayout = view.findViewById(R.id.periodTabLayout)
        cardioMetricTabLayout = view.findViewById(R.id.cardioMetricTabLayout)
        xAxisLabel = view.findViewById(R.id.xAxisLabel)
        yAxisLabel = view.findViewById(R.id.yAxisLabel)

        setupChart()
        setupPeriodTabs()
        setupCardioMetricTabs()
        loadExerciseNames()
        setupExerciseSpinner()

        // Initial load
        updateChart()
    }

    private fun setupChart() {
        progressionChart.description.isEnabled = false
        progressionChart.setTouchEnabled(true)
        progressionChart.setDragEnabled(true)
        progressionChart.setScaleEnabled(true)
        progressionChart.setPinchZoom(true)

        val xAxis = progressionChart.xAxis
        xAxis.position = XAxis.XAxisPosition.BOTTOM
        xAxis.setDrawGridLines(false)
        xAxis.granularity = 1f
        xAxis.labelRotationAngle = -45f
        xAxis.textSize = 10f
        xAxis.textColor = Color.WHITE
        xAxis.yOffset = 0f
        xAxis.xOffset = 0f

        val leftAxis = progressionChart.axisLeft
        leftAxis.setDrawGridLines(true)
        leftAxis.gridColor = Color.parseColor("#333333")
        leftAxis.textSize = 10f
        leftAxis.textColor = Color.WHITE
        leftAxis.setDrawAxisLine(true)
        leftAxis.axisLineColor = Color.WHITE
        leftAxis.axisMinimum = 0f
        leftAxis.setSpaceTop(5f)
        leftAxis.setSpaceBottom(5f)
        leftAxis.setLabelCount(5, true)
        
        progressionChart.setBackgroundColor(Color.BLACK)
        progressionChart.legend.textColor = Color.WHITE

        progressionChart.axisRight.isEnabled = false
        progressionChart.legend.isEnabled = true
    }

    private fun setupPeriodTabs() {
        periodTabLayout.addTab(periodTabLayout.newTab().setText("Week"))
        periodTabLayout.addTab(periodTabLayout.newTab().setText("Month"))
        periodTabLayout.addTab(periodTabLayout.newTab().setText("All Time"))

        periodTabLayout.addOnTabSelectedListener(object : com.google.android.material.tabs.TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: com.google.android.material.tabs.TabLayout.Tab?) {
                currentPeriod = tab?.text?.toString() ?: "Week"
                updateChart()
            }

            override fun onTabUnselected(tab: com.google.android.material.tabs.TabLayout.Tab?) {}
            override fun onTabReselected(tab: com.google.android.material.tabs.TabLayout.Tab?) {}
        })
    }

    private fun setupCardioMetricTabs() {
        cardioMetricTabLayout.addTab(cardioMetricTabLayout.newTab().setText("Total Time"))
        cardioMetricTabLayout.addTab(cardioMetricTabLayout.newTab().setText("Zone 1"))
        cardioMetricTabLayout.addTab(cardioMetricTabLayout.newTab().setText("Zone 2"))
        cardioMetricTabLayout.addTab(cardioMetricTabLayout.newTab().setText("Zone 3"))
        cardioMetricTabLayout.addTab(cardioMetricTabLayout.newTab().setText("Zone 4"))
        cardioMetricTabLayout.addTab(cardioMetricTabLayout.newTab().setText("Zone 5"))
        cardioMetricTabLayout.addTab(cardioMetricTabLayout.newTab().setText("Calories"))

        cardioMetricTabLayout.addOnTabSelectedListener(object : com.google.android.material.tabs.TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: com.google.android.material.tabs.TabLayout.Tab?) {
                currentCardioMetric = tab?.text?.toString() ?: "Total Time"
                updateChart()
            }

            override fun onTabUnselected(tab: com.google.android.material.tabs.TabLayout.Tab?) {}
            override fun onTabReselected(tab: com.google.android.material.tabs.TabLayout.Tab?) {}
        })
    }

    private fun loadExerciseNames() {
        val exerciseSet = mutableSetOf<String>()
        
        // Load workout exercises
        val workoutKeys = sharedPreferences.all.keys.filter { it.startsWith("workout_") }
        workoutKeys.forEach outer@{ key ->
            val json = sharedPreferences.getString(key, null) ?: return@outer
            val type = object : TypeToken<List<Map<String, Any>>>() {}.type
            @Suppress("UNCHECKED_CAST")
            val workoutData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: return@outer
            workoutData.forEach inner@{ data ->
                val name = data["name"] as? String ?: return@inner
                exerciseSet.add(name)
            }
        }
        
        // Load cardio exercises
        val cardioKeys = sharedPreferences.all.keys.filter { it.startsWith("cardio_") }
        cardioKeys.forEach outer@{ key ->
            val json = sharedPreferences.getString(key, null) ?: return@outer
            val type = object : TypeToken<List<Map<String, Any>>>() {}.type
            @Suppress("UNCHECKED_CAST")
            val cardioData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: return@outer
            cardioData.forEach inner@{ data ->
                val name = data["name"] as? String ?: return@inner
                exerciseSet.add(name)
            }
        }
        
        exerciseNames.clear()
        exerciseNames.addAll(exerciseSet.sorted())
    }

    private fun setupExerciseSpinner() {
        if (exerciseNames.isEmpty()) {
            exerciseNames.add("No exercises found")
        }

        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, exerciseNames)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        exerciseSpinner.adapter = adapter

        exerciseSpinner.onItemSelectedListener = object : android.widget.AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: android.widget.AdapterView<*>?, view: View?, position: Int, id: Long) {
                // Show/hide cardio metric tabs based on selected exercise
                val selectedExercise = exerciseSpinner.selectedItem?.toString() ?: ""
                val isCardio = listOf("Cycling", "Stair Master", "Walking", "Sports").contains(selectedExercise)
                cardioMetricTabLayout.visibility = if (isCardio) View.VISIBLE else View.GONE
                updateChart()
            }

            override fun onNothingSelected(parent: android.widget.AdapterView<*>?) {}
        }
    }

    private fun updateChart() {
        if (exerciseNames.isEmpty() || exerciseSpinner.selectedItemPosition < 0) return

        val selectedExercise = exerciseSpinner.selectedItem.toString()
        if (selectedExercise == "No exercises found") return

        // Check if it's a cardio exercise (declare once at the top)
        val isCardioExercise = listOf("Cycling", "Stair Master", "Walking", "Sports").contains(selectedExercise)

        val dataPoints = mutableListOf<Pair<Date, Float>>()

        // Calculate cutoff date properly
        val now = Calendar.getInstance()
        val cutoffDate = when (currentPeriod) {
            "Week" -> {
                val cal = Calendar.getInstance()
                cal.add(Calendar.DAY_OF_YEAR, -7)
                cal.time
            }
            "Month" -> {
                val cal = Calendar.getInstance()
                cal.add(Calendar.MONTH, -1)
                cal.time
            }
            else -> Date(0) // All time
        }
        
        if (isCardioExercise) {
            // Load cardio data
            val cardioKeys = sharedPreferences.all.keys.filter { it.startsWith("cardio_") }
            cardioKeys.forEach outer@{ key ->
                val dateStr = key.removePrefix("cardio_")
                val date = try {
                    dateFormat.parse(dateStr)
                } catch (e: Exception) {
                    null
                }

                if (date != null && date.after(cutoffDate) && !date.after(now.time)) {
                    val json = sharedPreferences.getString(key, null) ?: return@outer
                    val type = object : TypeToken<List<Map<String, Any>>>() {}.type
                    @Suppress("UNCHECKED_CAST")
                    val cardioData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: return@outer

                    cardioData.forEach inner@{ data ->
                        val name = data["name"] as? String ?: return@inner
                        if (name == selectedExercise) {
                            // Get value based on selected metric
                            val value = when (currentCardioMetric) {
                                "Total Time" -> {
                                    (data["duration"] as? Int) ?: (data["duration"] as? Number)?.toInt() ?: 0
                                }
                                "Zone 1" -> {
                                    (data["zone1Time"] as? Int) ?: (data["zone1Time"] as? Number)?.toInt() ?: 0
                                }
                                "Zone 2" -> {
                                    (data["zone2Time"] as? Int) ?: (data["zone2Time"] as? Number)?.toInt() ?: 0
                                }
                                "Zone 3" -> {
                                    (data["zone3Time"] as? Int) ?: (data["zone3Time"] as? Number)?.toInt() ?: 0
                                }
                                "Zone 4" -> {
                                    (data["zone4Time"] as? Int) ?: (data["zone4Time"] as? Number)?.toInt() ?: 0
                                }
                                "Zone 5" -> {
                                    (data["zone5Time"] as? Int) ?: (data["zone5Time"] as? Number)?.toInt() ?: 0
                                }
                                "Calories" -> {
                                    (data["calories"] as? Int) ?: (data["calories"] as? Number)?.toInt() ?: 0
                                }
                                else -> 0
                            }
                            if (value > 0) {
                                dataPoints.add(Pair(date, value.toFloat()))
                            }
                        }
                    }
                }
            }
        } else {
            // Load workout data
            val workoutKeys = sharedPreferences.all.keys.filter { it.startsWith("workout_") }
            workoutKeys.forEach outer@{ key ->
                val dateStr = key.removePrefix("workout_")
                val date = try {
                    dateFormat.parse(dateStr)
                } catch (e: Exception) {
                    null
                }

                if (date != null && date.after(cutoffDate) && !date.after(now.time)) {
                    val json = sharedPreferences.getString(key, null) ?: return@outer
                    val type = object : TypeToken<List<Map<String, Any>>>() {}.type
                    @Suppress("UNCHECKED_CAST")
                    val workoutData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: return@outer

                    workoutData.forEach inner@{ data ->
                        val name = data["name"] as? String ?: return@inner
                        if (name == selectedExercise) {
                            @Suppress("UNCHECKED_CAST")
                            val setsData = (data["sets"] as? List<*>)?.mapNotNull { 
                                it as? Map<String, Any> 
                            } ?: return@inner
                            if (setsData.isNotEmpty()) {
                                // Calculate average weight or total reps
                                val isWeighted = (data["isWeighted"] as? Boolean) ?: false
                                val value = if (isWeighted) {
                                    // Average weight (only count sets with weight > 0)
                                    val weights = setsData.mapNotNull { setData ->
                                        val weight = (setData["weight"] as? Double) ?: (setData["weight"] as? Number)?.toDouble()
                                        if (weight != null && weight > 0) weight else null
                                    }
                                    if (weights.isNotEmpty()) weights.average().toFloat() else 0f
                                } else {
                                    // Total reps
                                    setsData.mapNotNull { setData ->
                                        (setData["reps"] as? Int) ?: (setData["reps"] as? Number)?.toInt()
                                    }.sum().toFloat()
                                }

                                if (value > 0) {
                                    dataPoints.add(Pair(date, value))
                                }
                            }
                        }
                    }
                }
            }
        }

        if (dataPoints.isEmpty()) {
            progressionChart.data = null
            progressionChart.invalidate()
            return
        }

        // Sort by date (oldest first)
        dataPoints.sortBy { it.first }

        // Create entries with proper x-axis values
        val entries = dataPoints.mapIndexed { index, (_, value) ->
            Entry(index.toFloat(), value)
        }

        val dates = dataPoints.map { dateFormat.format(it.first) }
        val values = dataPoints.map { it.second }

        // Calculate average change rate
        val changes = mutableListOf<Float>()
        for (i in 1 until values.size) {
            val previousValue = values[i - 1]
            val currentValue = values[i]
            if (previousValue > 0) {
                val changePercent = ((currentValue - previousValue) / previousValue) * 100
                changes.add(changePercent)
            }
        }
        // Create main line dataset
        val dataSet = LineDataSet(entries, selectedExercise)
        dataSet.lineWidth = 3f
        dataSet.setDrawValues(true)
        dataSet.valueTextColor = Color.WHITE
        dataSet.valueTextSize = 10f
        dataSet.circleRadius = 5f
        dataSet.setDrawCircles(true)
        dataSet.setDrawCircleHole(false)
        dataSet.setDrawFilled(false) // No fill

               // Use single color for all points (no conditional coloring)
               dataSet.color = Color.WHITE
               dataSet.setCircleColor(Color.WHITE)

        val lineData = LineData(dataSet)
        progressionChart.data = lineData

        // Set axis labels (reuse isCardioExercise declared at top of function)
        // X-axis label (always dates)
        xAxisLabel.text = "Date"
        xAxisLabel.visibility = View.VISIBLE
        
        // Y-axis label based on exercise type and metric
        val yAxisLabelText = when {
            isCardioExercise -> when (currentCardioMetric) {
                "Total Time", "Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5" -> "Time (minutes)"
                "Calories" -> "Calories"
                else -> "Value"
            }
            else -> {
                // Check if weighted exercise
                val firstKey = sharedPreferences.all.keys.filter { it.startsWith("workout_") }.firstOrNull()
                if (firstKey != null) {
                    val json = sharedPreferences.getString(firstKey, null)
                    if (json != null) {
                        val type = object : TypeToken<List<Map<String, Any>>>() {}.type
                        @Suppress("UNCHECKED_CAST")
                        val workoutData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: emptyList()
                        val exercise = workoutData.find { (it["name"] as? String) == selectedExercise }
                        val isWeighted = (exercise?.get("isWeighted") as? Boolean) ?: false
                        if (isWeighted) "Weight (lbs)" else "Reps"
                    } else "Value"
                } else "Value"
            }
        }
        
        yAxisLabel.text = yAxisLabelText
        yAxisLabel.visibility = View.VISIBLE
        
        progressionChart.axisLeft.setAxisMinimum(0f)
        progressionChart.axisLeft.valueFormatter = object : ValueFormatter() {
            override fun getFormattedValue(value: Float): String {
                return if (yAxisLabelText.contains("Calories") || yAxisLabelText.contains("Reps") || yAxisLabelText.contains("Time")) {
                    value.toInt().toString()
                } else {
                    String.format("%.1f", value)
                }
            }
        }

        // Format x-axis labels (dates)
        progressionChart.xAxis.valueFormatter = object : ValueFormatter() {
            override fun getFormattedValue(value: Float): String {
                val index = value.toInt()
                if (index >= 0 && index < dates.size) {
                    val date = dateFormat.parse(dates[index])
                    val displayFormat = SimpleDateFormat("MM/dd", Locale.getDefault())
                    return displayFormat.format(date ?: Date())
                }
                return ""
            }
        }
        
        // Set axis labels text size
        progressionChart.xAxis.textSize = 10f
        progressionChart.axisLeft.textSize = 10f

        progressionChart.invalidate()
    }
}

