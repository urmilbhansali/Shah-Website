package com.workouttracker

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class CardioAdapter(
    private val cardioExercises: MutableList<CardioExercise>,
    private val onDataChanged: () -> Unit = {}
) : RecyclerView.Adapter<CardioAdapter.CardioViewHolder>() {

    class CardioViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val exerciseNameTextView: TextView = itemView.findViewById(R.id.exerciseNameTextView)
        val durationEditText: EditText = itemView.findViewById(R.id.durationEditText)
        val avgBpmEditText: EditText = itemView.findViewById(R.id.avgBpmEditText)
        val caloriesEditText: EditText = itemView.findViewById(R.id.caloriesEditText)
        val minHrEditText: EditText = itemView.findViewById(R.id.minHrEditText)
        val maxHrEditText: EditText = itemView.findViewById(R.id.maxHrEditText)
        val zone1EditText: EditText = itemView.findViewById(R.id.zone1EditText)
        val zone2EditText: EditText = itemView.findViewById(R.id.zone2EditText)
        val zone3EditText: EditText = itemView.findViewById(R.id.zone3EditText)
        val zone4EditText: EditText = itemView.findViewById(R.id.zone4EditText)
        val zone5EditText: EditText = itemView.findViewById(R.id.zone5EditText)
        var currentExercise: CardioExercise? = null
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CardioViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_cardio, parent, false)
        return CardioViewHolder(view)
    }

    override fun onBindViewHolder(holder: CardioViewHolder, position: Int) {
        if (position < 0 || position >= cardioExercises.size) return
        
        val exercise = cardioExercises[position]
        holder.currentExercise = exercise // Store reference to the exercise
        holder.exerciseNameTextView.text = exercise.name

        // Set card background to black (no conditional coloring)
        val cardView = holder.itemView as? com.google.android.material.card.MaterialCardView
        cardView?.setCardBackgroundColor(Color.BLACK)

        // Helper function to set text and handle focus - clear previous listeners first
        fun setupEditText(editText: EditText, value: Int, onUpdate: (Int) -> Unit) {
            // Clear previous listener to prevent memory leaks
            editText.setOnFocusChangeListener(null)
            
            if (value > 0) {
                editText.setText(value.toString())
            } else {
                editText.text.clear()
            }
            editText.setOnFocusChangeListener { _, hasFocus ->
                if (!hasFocus) {
                    val currentExercise = holder.currentExercise
                    if (currentExercise != null) {
                        val newValue = editText.text.toString().toIntOrNull() ?: 0
                        onUpdate(newValue)
                        currentExercise.completed = true
                        onDataChanged()
                    }
                }
            }
        }

        setupEditText(holder.durationEditText, exercise.duration) { exercise.duration = it }
        setupEditText(holder.avgBpmEditText, exercise.avgBpm) { exercise.avgBpm = it }
        setupEditText(holder.caloriesEditText, exercise.calories) { exercise.calories = it }
        setupEditText(holder.minHrEditText, exercise.minHeartRate) { exercise.minHeartRate = it }
        setupEditText(holder.maxHrEditText, exercise.maxHeartRate) { exercise.maxHeartRate = it }
        setupEditText(holder.zone1EditText, exercise.zone1Time) { exercise.zone1Time = it }
        setupEditText(holder.zone2EditText, exercise.zone2Time) { exercise.zone2Time = it }
        setupEditText(holder.zone3EditText, exercise.zone3Time) { exercise.zone3Time = it }
        setupEditText(holder.zone4EditText, exercise.zone4Time) { exercise.zone4Time = it }
        setupEditText(holder.zone5EditText, exercise.zone5Time) { exercise.zone5Time = it }
    }

    override fun getItemCount() = cardioExercises.size
}

