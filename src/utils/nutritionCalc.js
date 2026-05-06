import { TRAINING_TYPES } from '../data/mockData'

/**
 * Calculate daily calorie target using Mifflin-St Jeor + training load.
 * Weight loss deficit is capped at 300 kcal to protect performance.
 */
export function calcDailyTargets({ weightKg, heightCm, ageYears, sex, trainingType, durationMin, goalMode }) {
  const bmr =
    sex === 'female'
      ? 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161
      : 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5

  const tdee = bmr * 1.4 // moderate base activity

  const training = TRAINING_TYPES[trainingType] || TRAINING_TYPES.rest
  const MET = 4 + training.intensityFactor * 8 // roughly 4–12
  const trainingKcal = durationMin > 0 ? (MET * weightKg * durationMin) / 60 : 0

  let totalKcal = tdee + trainingKcal

  if (goalMode === 'lose') totalKcal = Math.max(totalKcal - 300, bmr * 1.1)
  if (goalMode === 'gain') totalKcal += 200

  // Macro split: carb-heavy on hard days, balanced on rest/easy
  const intensityFactor = training.intensityFactor
  const carbPct = 0.45 + intensityFactor * 0.15  // 45–60%
  const proteinPct = 0.25 - intensityFactor * 0.03 // 22–25%
  const fatPct = 1 - carbPct - proteinPct

  return {
    kcal: Math.round(totalKcal),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    trainingKcal: Math.round(trainingKcal),
    carbs: Math.round((totalKcal * carbPct) / 4),
    protein: Math.round((totalKcal * proteinPct) / 4),
    fat: Math.round((totalKcal * fatPct) / 9),
    carbPct: Math.round(carbPct * 100),
    proteinPct: Math.round(proteinPct * 100),
    fatPct: Math.round(fatPct * 100),
  }
}

export function calcHydrationLiters({ weightKg, trainingType, durationMin }) {
  const training = TRAINING_TYPES[trainingType] || TRAINING_TYPES.rest
  const base = weightKg * 0.033
  const sweatLoss = durationMin > 0 ? (training.intensityFactor * durationMin) / 60 * 0.8 : 0
  return Math.round((base + sweatLoss) * 10) / 10
}

export function bmi(weightKg, heightCm) {
  return Math.round((weightKg / Math.pow(heightCm / 100, 2)) * 10) / 10
}

export function weeklyAvgKcal(schedule, profile) {
  const targets = schedule.map(s =>
    calcDailyTargets({ ...profile, trainingType: s.type, durationMin: s.durationMin })
  )
  return Math.round(targets.reduce((sum, t) => sum + t.kcal, 0) / 7)
}
