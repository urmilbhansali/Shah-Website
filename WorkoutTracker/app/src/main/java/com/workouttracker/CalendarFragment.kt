package com.workouttracker

import android.content.Context
import android.content.SharedPreferences
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.*

class CalendarFragment : Fragment() {
    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var monthYearTextView: TextView
    private lateinit var calendarRecyclerView: RecyclerView
    private lateinit var prevMonthButton: Button
    private lateinit var nextMonthButton: Button
    private val gson = Gson()
    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    private val monthYearFormat = SimpleDateFormat("MMMM yyyy", Locale.getDefault())
    private var currentMonth = Calendar.getInstance()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_calendar, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        sharedPreferences = requireContext().getSharedPreferences("WorkoutTracker", Context.MODE_PRIVATE)

        monthYearTextView = view.findViewById(R.id.monthYearTextView)
        calendarRecyclerView = view.findViewById(R.id.calendarRecyclerView)
        prevMonthButton = view.findViewById(R.id.prevMonthButton)
        nextMonthButton = view.findViewById(R.id.nextMonthButton)

        // Setup calendar with 7 columns (days of week)
        calendarRecyclerView.layoutManager = GridLayoutManager(requireContext(), 7)

        prevMonthButton.setOnClickListener {
            currentMonth.add(Calendar.MONTH, -1)
            updateCalendar()
        }

        nextMonthButton.setOnClickListener {
            currentMonth.add(Calendar.MONTH, 1)
            updateCalendar()
        }

        updateCalendar()
    }

    private fun updateCalendar() {
        monthYearTextView.text = monthYearFormat.format(currentMonth.time)

        val days = mutableListOf<CalendarDay>()
        val calendar = currentMonth.clone() as Calendar

        // Set to first day of month
        calendar.set(Calendar.DAY_OF_MONTH, 1)
        val firstDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK)
        
        // Get workout dates
        val workoutDates = getWorkoutDates()

        // Add empty cells for days before the first day of the month
        val startOffset = (firstDayOfWeek - Calendar.SUNDAY + 7) % 7
        for (i in 0 until startOffset) {
            days.add(CalendarDay(null, false))
        }

        // Get last day of month
        val lastDay = calendar.getActualMaximum(Calendar.DAY_OF_MONTH)

        // Add all days of the month
        for (day in 1..lastDay) {
            calendar.set(Calendar.DAY_OF_MONTH, day)
            val dateKey = dateFormat.format(calendar.time)
            val hasWorkout = workoutDates.contains(dateKey)
            days.add(CalendarDay(day, hasWorkout))
        }

        // Fill remaining cells to complete the grid (6 rows = 42 cells)
        while (days.size < 42) {
            days.add(CalendarDay(null, false))
        }

        calendarRecyclerView.adapter = CalendarDayAdapter(days)
    }

    private fun getWorkoutDates(): Set<String> {
        val workoutDates = mutableSetOf<String>()
        
        // Check workout data
        val workoutKeys = sharedPreferences.all.keys.filter { it.startsWith("workout_") }
        workoutKeys.forEach { key ->
            val dateStr = key.removePrefix("workout_")
            val json = sharedPreferences.getString(key, null)
            if (json != null) {
                val type = object : TypeToken<List<Map<String, Any>>>() {}.type
                @Suppress("UNCHECKED_CAST")
                val workoutData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: emptyList()
                // Check if any exercise has values
                val hasData = workoutData.any { exercise ->
                    @Suppress("UNCHECKED_CAST")
                    val sets = (exercise["sets"] as? List<*>)?.mapNotNull { 
                        @Suppress("UNCHECKED_CAST")
                        it as? Map<String, Any> 
                    } ?: emptyList()
                    sets.any { set ->
                        val weight = (set["weight"] as? Double) ?: (set["weight"] as? Number)?.toDouble() ?: 0.0
                        val reps = (set["reps"] as? Int) ?: (set["reps"] as? Number)?.toInt() ?: 0
                        weight > 0 || reps > 0
                    }
                }
                if (hasData) {
                    workoutDates.add(dateStr)
                }
            }
        }

        // Check cardio data
        val cardioKeys = sharedPreferences.all.keys.filter { it.startsWith("cardio_") }
        cardioKeys.forEach { key ->
            val dateStr = key.removePrefix("cardio_")
            val json = sharedPreferences.getString(key, null)
            if (json != null) {
                val type = object : TypeToken<List<Map<String, Any>>>() {}.type
                @Suppress("UNCHECKED_CAST")
                val cardioData: List<Map<String, Any>> = gson.fromJson(json, type) as? List<Map<String, Any>> ?: emptyList()
                // Check if any cardio exercise has values
                val hasData = cardioData.any { exercise ->
                    val duration = (exercise["duration"] as? Int) ?: (exercise["duration"] as? Number)?.toInt() ?: 0
                    val calories = (exercise["calories"] as? Int) ?: (exercise["calories"] as? Number)?.toInt() ?: 0
                    duration > 0 || calories > 0
                }
                if (hasData) {
                    workoutDates.add(dateStr)
                }
            }
        }

        return workoutDates
    }

    data class CalendarDay(
        val day: Int?,
        val hasWorkout: Boolean
    )

    class CalendarDayAdapter(
        private val days: List<CalendarDay>
    ) : RecyclerView.Adapter<CalendarDayAdapter.DayViewHolder>() {

        class DayViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
            val dayTextView: TextView = itemView.findViewById(R.id.dayTextView)
            val workoutIndicator: View = itemView.findViewById(R.id.workoutIndicator)
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DayViewHolder {
            val view = LayoutInflater.from(parent.context)
                .inflate(R.layout.item_calendar_day, parent, false)
            return DayViewHolder(view)
        }

        override fun onBindViewHolder(holder: DayViewHolder, position: Int) {
            val day = days[position]
            
            if (day.day != null) {
                holder.dayTextView.text = day.day.toString()
                holder.dayTextView.visibility = View.VISIBLE
                holder.dayTextView.setTextColor(Color.WHITE)
                
                // Show workout indicator for days with workouts
                if (day.hasWorkout) {
                    holder.workoutIndicator.visibility = View.VISIBLE
                } else {
                    holder.workoutIndicator.visibility = View.GONE
                }
            } else {
                holder.dayTextView.text = ""
                holder.dayTextView.visibility = View.INVISIBLE
                holder.workoutIndicator.visibility = View.GONE
            }
        }

        override fun getItemCount() = days.size
    }
}

