import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import { calcDailyTargets } from '../utils/nutritionCalc'
import { TRAINING_TYPES, MEALS, WEEK_DAYS } from '../data/mockData'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import MacroBar from '../components/ui/MacroBar'

const TODAY_INDEX = (new Date().getDay() + 6) % 7

const MEAL_SLOTS = [
  { key: 'breakfast',       label: 'Breakfast',         icon: '🌅', always: true },
  { key: 'pre_workout',     label: 'Pre-Workout',       icon: '⚡', onlyIfTraining: true },
  { key: 'during_workout',  label: 'During Workout',    icon: '🚴', onlyIfLong: true },
  { key: 'lunch',           label: 'Lunch',             icon: '☀️', always: true },
  { key: 'snack',           label: 'Snack',             icon: '🍎', always: true },
  { key: 'post_workout',    label: 'Post-Workout',      icon: '💪', onlyIfTraining: true },
  { key: 'dinner',          label: 'Dinner',            icon: '🌙', always: true },
]

export default function MealPlan() {
  const { profile, schedule } = useStore()
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX)
  const [selectedMeals, setSelectedMeals] = useState({})

  const daySchedule = schedule[selectedDay]
  const training = TRAINING_TYPES[daySchedule.type]
  const isTraining = daySchedule.type !== 'rest'
  const isLong = daySchedule.durationMin >= 90

  const targets = useMemo(() =>
    calcDailyTargets({ ...profile, trainingType: daySchedule.type, durationMin: daySchedule.durationMin }),
    [profile, daySchedule]
  )

  const slots = MEAL_SLOTS.filter(s => {
    if (s.always) return true
    if (s.onlyIfLong && isLong) return true
    if (s.onlyIfTraining && isTraining) return true
    return false
  })

  function getSelected(slotKey) {
    const key = `${selectedDay}-${slotKey}`
    if (selectedMeals[key] !== undefined) return MEALS[slotKey][selectedMeals[key]]
    return MEALS[slotKey][0]
  }

  function setMeal(slotKey, idx) {
    setSelectedMeals(prev => ({ ...prev, [`${selectedDay}-${slotKey}`]: idx }))
  }

  const totalMeals = slots.reduce((acc, s) => {
    const m = getSelected(s.key)
    return {
      kcal: acc.kcal + m.kcal,
      carbs: acc.carbs + m.carbs,
      protein: acc.protein + m.protein,
      fat: acc.fat + m.fat,
    }
  }, { kcal: 0, carbs: 0, protein: 0, fat: 0 })

  const kcalDiff = totalMeals.kcal - targets.kcal

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
        <p className="text-sm text-gray-400 mt-1">Meals adapt to your training type and duration each day</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {WEEK_DAYS.map((day, i) => {
          const t = TRAINING_TYPES[schedule[i].type]
          const isToday = i === TODAY_INDEX
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(i)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl border transition-all shrink-0
                ${selectedDay === i
                  ? 'bg-green-500 border-green-500 text-white'
                  : isToday
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
            >
              <span className="text-xs font-medium">{day}</span>
              <span className="text-lg mt-0.5">{trainingEmoji(schedule[i].type)}</span>
            </button>
          )
        })}
      </div>

      {/* Day summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800">{WEEK_DAYS[selectedDay]} — {training.label}</span>
              <Badge label={daySchedule.durationMin > 0 ? `${daySchedule.durationMin} min` : 'Rest'} color={training.color} />
            </div>
            <p className="text-sm text-gray-400 mt-0.5">Target: <span className="font-medium text-gray-700">{targets.kcal.toLocaleString()} kcal</span></p>
          </div>
          <div className={`text-sm font-semibold px-3 py-1 rounded-full
            ${Math.abs(kcalDiff) < 100
              ? 'bg-green-100 text-green-700'
              : kcalDiff > 0 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
            }`}>
            Plan total: {totalMeals.kcal} kcal ({kcalDiff >= 0 ? '+' : ''}{kcalDiff})
          </div>
        </div>
        <div className="mt-3">
          <MacroBar carbs={totalMeals.carbs} protein={totalMeals.protein} fat={totalMeals.fat} />
        </div>
      </Card>

      {/* Meal slots */}
      <div className="space-y-3">
        {slots.map(slot => {
          const options = MEALS[slot.key]
          const selectedIdx = selectedMeals[`${selectedDay}-${slot.key}`] ?? 0
          const meal = options[selectedIdx]

          return (
            <Card key={slot.key} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{slot.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{slot.label}</p>
                    <p className="text-xs text-gray-400">{meal.kcal} kcal · {meal.carbs}g C · {meal.protein}g P · {meal.fat}g F</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMeal(slot.key, idx)}
                    className={`shrink-0 text-sm px-3 py-2 rounded-lg border transition-all text-left
                      ${selectedIdx === idx
                        ? 'bg-green-50 border-green-400 text-green-800 font-medium'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {isLong && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-sm text-amber-800 font-medium">🚴 Long session fueling reminder</p>
          <p className="text-sm text-amber-700 mt-1">
            For {daySchedule.durationMin} minutes of riding, aim for 60–90g carbs/hour on the bike.
            Start fueling after 45 minutes; don't wait until you're hungry.
          </p>
        </Card>
      )}
    </div>
  )
}

function trainingEmoji(type) {
  const map = {
    rest: '😴', easy_run: '🏃', tempo_run: '🏃', long_run: '🏃',
    easy_bike: '🚴', long_bike: '🚴', interval_bike: '🚴',
    swim: '🏊', strength: '💪', yoga: '🧘',
  }
  return map[type] || '🏋️'
}
