import { useState } from 'react'
import { useStore } from '../store/useStore'
import { TRAINING_TYPES } from '../data/mockData'
import { calcDailyTargets } from '../utils/nutritionCalc'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

const TODAY_INDEX = (new Date().getDay() + 6) % 7

export default function Training() {
  const { profile, schedule, updateScheduleDay } = useStore()
  const [editing, setEditing] = useState(null)

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Training Schedule</h1>
        <p className="text-sm text-gray-400 mt-1">Your weekly plan drives your calorie & macro targets each day</p>
      </div>

      <div className="space-y-3">
        {schedule.map((s, i) => {
          const t = TRAINING_TYPES[s.type]
          const targets = calcDailyTargets({ ...profile, trainingType: s.type, durationMin: s.durationMin })
          const isToday = i === TODAY_INDEX
          const isEditing = editing === i

          return (
            <Card key={s.day} className={`p-4 ${isToday ? 'ring-2 ring-green-400' : ''}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0
                    ${isToday ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {trainingEmoji(s.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${isToday ? 'text-green-700' : 'text-gray-700'}`}>
                        {s.day}
                      </span>
                      {isToday && <Badge label="Today" color="green" />}
                      <Badge label={t.label} color={t.color} />
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {s.durationMin > 0 ? `${s.durationMin} min` : 'No workout'} ·{' '}
                      <span className="text-orange-500 font-medium">{targets.kcal.toLocaleString()} kcal target</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(isEditing ? null : i)}
                  className="text-xs text-gray-400 hover:text-green-600 border border-gray-200 hover:border-green-300 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  {isEditing ? 'Done' : 'Edit'}
                </button>
              </div>

              {isEditing && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 font-medium block mb-1.5">Workout Type</label>
                    <select
                      value={s.type}
                      onChange={e => updateScheduleDay(i, { type: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                    >
                      {Object.entries(TRAINING_TYPES).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium block mb-1.5">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={600}
                      step={5}
                      value={s.durationMin}
                      onChange={e => updateScheduleDay(i, { durationMin: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div className="sm:col-span-2 bg-gray-50 rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-xs text-gray-400">Target kcal</p>
                      <p className="font-bold text-gray-900">{targets.kcal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-amber-500">Carbs</p>
                      <p className="font-bold text-gray-900">{targets.carbs}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-600">Protein</p>
                      <p className="font-bold text-gray-900">{targets.protein}g</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-500">Fat</p>
                      <p className="font-bold text-gray-900">{targets.fat}g</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <Card className="p-4 bg-green-50 border-green-200">
        <p className="text-sm text-green-800 font-medium">💡 Nutrition tip</p>
        <p className="text-sm text-green-700 mt-1">
          On long ride days (180+ min), aim to consume 60–90g of carbs per hour during the workout.
          Prioritise carb-rich meals the evening before.
        </p>
      </Card>
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
