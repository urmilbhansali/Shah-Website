package com.workouttracker

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class SimpleSetAdapter(
    private val sets: MutableList<WorkoutSet>,
    private val previousSets: MutableList<WorkoutSet> = mutableListOf(),
    private val isCompleted: Boolean = false,
    private val onDataChanged: () -> Unit = {}
) : RecyclerView.Adapter<SimpleSetAdapter.SimpleSetViewHolder>() {

    class SimpleSetViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val setNumberTextView: TextView = itemView.findViewById(R.id.setNumberTextView)
        val repsEditText: EditText = itemView.findViewById(R.id.repsEditText)
        var currentSet: WorkoutSet? = null
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SimpleSetViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_simple_set, parent, false)
        return SimpleSetViewHolder(view)
    }

    override fun onBindViewHolder(holder: SimpleSetViewHolder, position: Int) {
        if (position < 0 || position >= sets.size) return
        
        val set = sets[position]
        holder.currentSet = set // Store reference to the set
        val previousSet = if (position < previousSets.size) previousSets[position] else null
        holder.setNumberTextView.text = "Set ${position + 1}"
        
        // Prepopulate reps if exists, otherwise use previous value
        val repsValue = if (set.reps > 0) {
            set.reps
        } else if (previousSet != null && previousSet.reps > 0) {
            previousSet.reps
        } else {
            null
        }

        if (repsValue != null) {
            holder.repsEditText.setText(repsValue.toString())
            // Show in grey if using previous value and not completed
            if (!isCompleted && set.reps == 0 && previousSet != null) {
                holder.repsEditText.setTextColor(Color.GRAY)
            } else {
                holder.repsEditText.setTextColor(Color.WHITE)
            }
        } else {
            holder.repsEditText.text.clear()
            holder.repsEditText.setTextColor(Color.WHITE)
        }
        
        // Clear previous listener to prevent memory leaks
        holder.repsEditText.setOnFocusChangeListener(null)
        holder.repsEditText.setOnFocusChangeListener { _, hasFocus ->
            if (!hasFocus) {
                val currentSet = holder.currentSet
                if (currentSet != null) {
                    val newReps = holder.repsEditText.text.toString().toIntOrNull() ?: 0
                    currentSet.reps = newReps
                    holder.repsEditText.setTextColor(Color.WHITE)
                    onDataChanged()
                }
            }
        }
    }

    override fun getItemCount() = sets.size
}

