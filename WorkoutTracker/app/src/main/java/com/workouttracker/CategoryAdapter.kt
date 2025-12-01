package com.workouttracker

import android.content.SharedPreferences
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import java.text.SimpleDateFormat

class CategoryAdapter(
    private val categories: MutableList<ExerciseCategory>,
    private val sharedPreferences: SharedPreferences,
    private val gson: Gson,
    private val dateFormat: SimpleDateFormat,
    private val onDataChanged: () -> Unit = {}
) : RecyclerView.Adapter<CategoryAdapter.CategoryViewHolder>() {

    private val expandedCategories = mutableSetOf<Int>()

    class CategoryViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val categoryNameTextView: TextView = itemView.findViewById(R.id.categoryNameTextView)
        val expandCollapseIcon: TextView = itemView.findViewById(R.id.expandCollapseIcon)
        val exercisesRecyclerView: RecyclerView = itemView.findViewById(R.id.exercisesRecyclerView)
        val categoryHeader: View = itemView.findViewById(R.id.categoryHeader)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CategoryViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_category, parent, false)
        return CategoryViewHolder(view)
    }

    override fun onBindViewHolder(holder: CategoryViewHolder, position: Int) {
        if (position < 0 || position >= categories.size) return
        
        val category = categories[position]
        holder.categoryNameTextView.text = category.name

        val isExpanded = expandedCategories.contains(position)
        holder.exercisesRecyclerView.visibility = if (isExpanded) View.VISIBLE else View.GONE
        holder.expandCollapseIcon.text = if (isExpanded) "▼" else "▶"

        // Setup exercise adapter - always create fresh to avoid stale references
        val exerciseAdapter = ExerciseAdapter(
            category.exercises,
            sharedPreferences,
            gson,
            dateFormat,
            onDataChanged
        )
        if (holder.exercisesRecyclerView.layoutManager == null) {
            holder.exercisesRecyclerView.layoutManager = LinearLayoutManager(holder.itemView.context)
        }
        holder.exercisesRecyclerView.adapter = exerciseAdapter

        // Toggle expand/collapse - clear previous listener first
        holder.categoryHeader.setOnClickListener(null)
        holder.categoryHeader.setOnClickListener {
            val currentPosition = holder.bindingAdapterPosition
            if (currentPosition == RecyclerView.NO_POSITION) return@setOnClickListener
            if (currentPosition < 0 || currentPosition >= categories.size) return@setOnClickListener
            
            val pos = currentPosition
            if (expandedCategories.contains(pos)) {
                expandedCategories.remove(pos)
            } else {
                expandedCategories.add(pos)
            }
            notifyItemChanged(pos)
        }
    }

    override fun getItemCount() = categories.size
}

