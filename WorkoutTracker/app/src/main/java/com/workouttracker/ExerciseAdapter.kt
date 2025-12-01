package com.workouttracker

import android.content.SharedPreferences
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import java.text.SimpleDateFormat

class ExerciseAdapter(
    private val exercises: MutableList<Exercise>,
    private val sharedPreferences: SharedPreferences,
    private val gson: Gson,
    private val dateFormat: SimpleDateFormat,
    private val onDataChanged: () -> Unit = {}
) : RecyclerView.Adapter<ExerciseAdapter.ExerciseViewHolder>() {

    class ExerciseViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val exerciseNameTextView: TextView = itemView.findViewById(R.id.exerciseNameTextView)
        val exerciseNotesTextView: TextView = itemView.findViewById(R.id.exerciseNotesTextView)
        val weightedLayout: LinearLayout = itemView.findViewById(R.id.weightedLayout)
        val simpleLayout: LinearLayout = itemView.findViewById(R.id.simpleLayout)
        val setsRecyclerView: RecyclerView = itemView.findViewById(R.id.setsRecyclerView)
        val simpleSetsRecyclerView: RecyclerView = itemView.findViewById(R.id.simpleSetsRecyclerView)
        val addSetButton: Button = itemView.findViewById(R.id.addSetButton)
        val addSimpleSetButton: Button = itemView.findViewById(R.id.addSimpleSetButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ExerciseViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_exercise, parent, false)
        return ExerciseViewHolder(view)
    }

    override fun onBindViewHolder(holder: ExerciseViewHolder, position: Int) {
        if (position < 0 || position >= exercises.size) return
        
        val exercise = exercises[position]
        holder.exerciseNameTextView.text = exercise.name
        
        // Display notes if available
        if (exercise.notes.isNotEmpty()) {
            holder.exerciseNotesTextView.text = exercise.notes
            holder.exerciseNotesTextView.visibility = View.VISIBLE
        } else {
            holder.exerciseNotesTextView.visibility = View.GONE
        }

        // Set card background to black (no conditional coloring)
        val cardView = holder.itemView as? com.google.android.material.card.MaterialCardView
        cardView?.setCardBackgroundColor(Color.BLACK)

        if (exercise.isWeighted) {
            // Show weighted layout
            holder.weightedLayout.visibility = View.VISIBLE
            holder.simpleLayout.visibility = View.GONE

            // Initialize sets if empty, use previous values if available
            if (exercise.sets.isEmpty()) {
                if (exercise.previousSets.isNotEmpty()) {
                    // Copy previous sets as starting point
                    exercise.previousSets.forEach { prevSet ->
                        exercise.sets.add(WorkoutSet(prevSet.weight, prevSet.reps))
                    }
                } else {
                    exercise.sets.add(WorkoutSet())
                }
            }

            // Setup sets RecyclerView - always create fresh adapter
            val setAdapter = SetAdapter(
                exercise.sets,
                exercise.previousSets,
                true,
                exercise.completed
            ) { 
                // Mark as completed when data changes
                exercise.completed = true
                onDataChanged() 
            }
            
            if (holder.setsRecyclerView.layoutManager == null) {
                holder.setsRecyclerView.layoutManager = LinearLayoutManager(holder.itemView.context)
            }
            holder.setsRecyclerView.adapter = setAdapter

            // Add set button - store adapter reference in tag to avoid stale references
            holder.addSetButton.tag = setAdapter
            holder.addSetButton.setOnClickListener {
                val currentSize = exercise.sets.size
                exercise.sets.add(WorkoutSet())
                
                val adapter = it.tag as? SetAdapter
                if (adapter != null && adapter === holder.setsRecyclerView.adapter) {
                    // Adapter is still valid, use it
                    adapter.notifyItemInserted(currentSize)
                } else {
                    // Adapter is stale or null, recreate
                    val newAdapter = SetAdapter(
                        exercise.sets,
                        exercise.previousSets,
                        true,
                        exercise.completed
                    ) { 
                        exercise.completed = true
                        onDataChanged() 
                    }
                    holder.setsRecyclerView.adapter = newAdapter
                    holder.addSetButton.tag = newAdapter
                    newAdapter.notifyDataSetChanged()
                }
                exercise.completed = true
                onDataChanged()
            }
        } else {
            // Show simple layout with multiple sets
            holder.weightedLayout.visibility = View.GONE
            holder.simpleLayout.visibility = View.VISIBLE

            // Initialize sets if empty, use previous values if available
            if (exercise.sets.isEmpty()) {
                if (exercise.previousSets.isNotEmpty()) {
                    // Copy previous sets as starting point
                    exercise.previousSets.forEach { prevSet ->
                        exercise.sets.add(WorkoutSet(reps = prevSet.reps))
                    }
                } else {
                    exercise.sets.add(WorkoutSet())
                }
            }

            // Setup simple sets RecyclerView - always create fresh adapter
            val simpleSetAdapter = SimpleSetAdapter(
                exercise.sets,
                exercise.previousSets,
                exercise.completed
            ) { 
                exercise.completed = true
                onDataChanged() 
            }
            
            if (holder.simpleSetsRecyclerView.layoutManager == null) {
                holder.simpleSetsRecyclerView.layoutManager = LinearLayoutManager(holder.itemView.context)
            }
            holder.simpleSetsRecyclerView.adapter = simpleSetAdapter

            // Add set button - store adapter reference in tag to avoid stale references
            holder.addSimpleSetButton.tag = simpleSetAdapter
            holder.addSimpleSetButton.setOnClickListener {
                val currentSize = exercise.sets.size
                exercise.sets.add(WorkoutSet())
                
                val adapter = it.tag as? SimpleSetAdapter
                if (adapter != null && adapter === holder.simpleSetsRecyclerView.adapter) {
                    // Adapter is still valid, use it
                    adapter.notifyItemInserted(currentSize)
                } else {
                    // Adapter is stale or null, recreate
                    val newAdapter = SimpleSetAdapter(
                        exercise.sets,
                        exercise.previousSets,
                        exercise.completed
                    ) { 
                        exercise.completed = true
                        onDataChanged() 
                    }
                    holder.simpleSetsRecyclerView.adapter = newAdapter
                    holder.addSimpleSetButton.tag = newAdapter
                    newAdapter.notifyDataSetChanged()
                }
                exercise.completed = true
                onDataChanged()
            }
        }
    }

    override fun getItemCount() = exercises.size
}
