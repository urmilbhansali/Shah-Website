package com.workouttracker

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.viewpager2.adapter.FragmentStateAdapter

class ViewPagerAdapter(fragmentActivity: FragmentActivity) : FragmentStateAdapter(fragmentActivity) {
    override fun getItemCount(): Int = 4 // 4 tabs: Workout, Cardio, Analytics, Calendar

    override fun createFragment(position: Int): Fragment {
        return when (position) {
            0 -> WorkoutFragment()
            1 -> CardioFragment()
            2 -> AnalyticsFragment()
            3 -> CalendarFragment()
            else -> WorkoutFragment()
        }
    }
}

