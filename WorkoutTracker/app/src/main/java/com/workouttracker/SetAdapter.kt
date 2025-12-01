package com.workouttracker

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class SetAdapter(
    private val sets: MutableList<WorkoutSet>,
    private val previousSets: MutableList<WorkoutSet> = mutableListOf(),
    private val isWeighted: Boolean,
    private val isCompleted: Boolean = false,
    private val onDataChanged: () -> Unit = {}
) : RecyclerView.Adapter<SetAdapter.SetViewHolder>() {

    class SetViewHolder(itemView: View, isWeighted: Boolean) : RecyclerView.ViewHolder(itemView) {
        val setNumberTextView: TextView = itemView.findViewById(R.id.setNumberTextView)
        val weightEditText: EditText? = if (isWeighted) itemView.findViewById(R.id.weightEditText) else null
        val repsEditText: EditText = itemView.findViewById(R.id.repsEditText)
        var currentSet: WorkoutSet? = null
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SetViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_set, parent, false)
        return SetViewHolder(view, isWeighted)
    }

    override fun onBindViewHolder(holder: SetViewHolder, position: Int) {
        if (position < 0 || position >= sets.size) return
        
        val set = sets[position]
        holder.currentSet = set // Store reference to the set
        val previousSet = if (position < previousSets.size) previousSets[position] else null
        holder.setNumberTextView.text = "Set ${position + 1}"
        
        if (isWeighted && holder.weightEditText != null) {
            // Prepopulate weight if exists, otherwise use previous value
            val weightValue = if (set.weight > 0) {
                set.weight
            } else if (previousSet != null && previousSet.weight > 0) {
                previousSet.weight
            } else {
                null
            }

            if (weightValue != null) {
                holder.weightEditText.setText(weightValue.toString())
                // Show in grey if using previous value and not completed
                if (!isCompleted && set.weight == 0.0 && previousSet != null) {
                    holder.weightEditText.setTextColor(Color.GRAY)
                } else {
                    holder.weightEditText.setTextColor(Color.WHITE)
                }
            } else {
                holder.weightEditText.text.clear()
                holder.weightEditText.setTextColor(Color.WHITE)
            }
            
            // Clear previous listener to prevent memory leaks
            holder.weightEditText.setOnFocusChangeListener(null)
            holder.weightEditText.setOnFocusChangeListener { _, hasFocus ->
                if (!hasFocus) {
                    val currentSet = holder.currentSet
                    if (currentSet != null) {
                        val newWeight = holder.weightEditText.text.toString().toDoubleOrNull() ?: 0.0
                        currentSet.weight = newWeight
                        holder.weightEditText.setTextColor(Color.WHITE)
                        onDataChanged()
                    }
                }
            }
        } else {
            holder.weightEditText?.visibility = View.GONE
        }
        
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
