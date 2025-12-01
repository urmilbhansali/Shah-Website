package com.workouttracker

data class CardioExercise(
    val name: String,
    var duration: Int = 0, // in minutes
    var avgBpm: Int = 0,
    var calories: Int = 0,
    var minHeartRate: Int = 0,
    var maxHeartRate: Int = 0,
    var zone1Time: Int = 0, // in minutes
    var zone2Time: Int = 0,
    var zone3Time: Int = 0,
    var zone4Time: Int = 0,
    var zone5Time: Int = 0,
    var completed: Boolean = false
)


