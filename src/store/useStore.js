import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultWeekSchedule, weightHistory } from '../data/mockData'

const defaultProfile = {
  name: 'Athlete',
  sport: 'Cycling',
  sex: 'male',
  ageYears: 35,
  weightKg: 78.8,
  heightCm: 178,
  goalMode: 'lose',    // 'lose' | 'maintain' | 'gain'
  goalWeightKg: 75,
}

export const useStore = create(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      schedule: defaultWeekSchedule,
      weights: weightHistory,
      activeMealPlanDay: null,

      updateProfile: (updates) =>
        set(s => ({ profile: { ...s.profile, ...updates } })),

      updateScheduleDay: (dayIndex, updates) =>
        set(s => {
          const schedule = [...s.schedule]
          schedule[dayIndex] = { ...schedule[dayIndex], ...updates }
          return { schedule }
        }),

      logWeight: (dateStr, weightKg) =>
        set(s => {
          const weights = s.weights.filter(w => w.date !== dateStr)
          weights.push({ date: dateStr, weight: weightKg })
          weights.sort((a, b) => a.date.localeCompare(b.date))
          return { weights }
        }),

      setActiveMealPlanDay: (day) => set({ activeMealPlanDay: day }),
    }),
    { name: 'fuelpad-storage' }
  )
)
