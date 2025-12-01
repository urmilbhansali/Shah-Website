package com.workouttracker

data class Exercise(
    val name: String,
    val isWeighted: Boolean = false,
    val notes: String = "",
    val sets: MutableList<WorkoutSet> = mutableListOf(),
    var completed: Boolean = false,
    val previousSets: MutableList<WorkoutSet> = mutableListOf()
)

data class WorkoutSet(
    var weight: Double = 0.0,
    var reps: Int = 0
)
