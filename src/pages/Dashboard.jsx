import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Droplets, Flame, TrendingDown, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { calcDailyTargets, calcHydrationLiters, bmi } from '../utils/nutritionCalc'
import { TRAINING_TYPES, WEEK_DAYS } from '../data/mockData'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import MacroBar from '../components/ui/MacroBar'
import StatPill from '../components/ui/StatPill'

const TODAY_INDEX = (new Date().getDay() + 6) % 7 // Mon=0

export default function Dashboard() {
  const { profile, schedule, weights } = useStore()
  const todaySchedule = schedule[TODAY_INDEX]
  const training = TRAINING_TYPES[todaySchedule.type]

  const targets = useMemo(() =>
    calcDailyTargets({
      ...profile,
      trainingType: todaySchedule.type,
      durationMin: todaySchedule.durationMin,
    }),
    [profile, todaySchedule]
  )

  const hydration = calcHydrationLiters({
    weightKg: profile.weightKg,
    trainingType: todaySchedule.type,
    durationMin: todaySchedule.durationMin,
  })

  const currentWeight = weights[weights.length - 1]?.weight ?? profile.weightKg
  const firstWeight = weights[0]?.weight ?? profile.weightKg
  const totalLost = Math.round((firstWeight - currentWeight) * 10) / 10
  const toGoal = Math.round((currentWeight - profile.goalWeightKg) * 10) / 10

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm text-gray-400">{dateStr}</p>
        <h1 className="text-2xl font-bold text-gray-900">Good {greeting()}, {profile.name} 👋</h1>
      </div>

      {/* Today's training banner */}
      <Card className="p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Today's session</p>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{training.label}</h2>
              <Badge label={todaySchedule.durationMin > 0 ? `${todaySchedule.durationMin} min` : 'Rest'} color={training.color} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Estimated burn</p>
            <p className="text-2xl font-bold text-orange-500">{targets.trainingKcal} <span className="text-sm font-normal text-gray-400">kcal</span></p>
          </div>
        </div>
      </Card>

      {/* Main calorie target */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-orange-500" size={20} />
          <h2 className="font-semibold text-gray-700">Daily Energy Target</h2>
        </div>
        <div className="flex items-end gap-2 mb-1">
          <span className="text-5xl font-black text-gray-900">{targets.kcal.toLocaleString()}</span>
          <span className="text-lg text-gray-400 mb-1">kcal</span>
        </div>
        <p className="text-xs text-gray-400 mb-5">
          BMR {targets.bmr} + base activity {targets.tdee - targets.bmr} + training {targets.trainingKcal}
          {profile.goalMode === 'lose' ? ' − 300 deficit' : ''}
        </p>

        <MacroBar carbs={targets.carbs} protein={targets.protein} fat={targets.fat} />

        <div className="grid grid-cols-3 gap-3 mt-5">
          <StatPill label="Carbs" value={targets.carbs} unit="g" color="amber" />
          <StatPill label="Protein" value={targets.protein} unit="g" color="green" />
          <StatPill label="Fat" value={targets.fat} unit="g" color="blue" />
        </div>
      </Card>

      {/* Hydration + Weight row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Droplets className="text-blue-400" size={18} />
            <h3 className="font-semibold text-gray-700">Hydration</h3>
          </div>
          <p className="text-4xl font-bold text-blue-500">{hydration} <span className="text-base font-normal text-gray-400">litres</span></p>
          <p className="text-xs text-gray-400 mt-1">Including {Math.round(hydration * 0.4 * 10) / 10}L during workout</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="text-green-500" size={18} />
            <h3 className="font-semibold text-gray-700">Weight Progress</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{currentWeight} <span className="text-base font-normal text-gray-400">kg</span></p>
          <div className="flex gap-3 mt-2 text-xs text-gray-500">
            {totalLost > 0 && <span className="text-green-600 font-medium">−{totalLost} kg lost</span>}
            {toGoal > 0 && <span>{toGoal} kg to goal</span>}
          </div>
          <Link to="/weight" className="text-xs text-green-600 font-medium mt-2 flex items-center gap-0.5 hover:underline">
            View progress <ChevronRight size={12} />
          </Link>
        </Card>
      </div>

      {/* Week overview */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-700 mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {schedule.map((s, i) => {
            const t = TRAINING_TYPES[s.type]
            const isToday = i === TODAY_INDEX
            return (
              <div
                key={s.day}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all
                  ${isToday ? 'bg-green-50 border-green-300' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <span className={`text-xs font-medium ${isToday ? 'text-green-700' : 'text-gray-400'}`}>{s.day}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base
                  ${isToday ? 'bg-green-500' : 'bg-gray-100'}`}>
                  {trainingEmoji(s.type)}
                </div>
                {s.durationMin > 0 && (
                  <span className="text-xs text-gray-400 leading-none">{s.durationMin}m</span>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Quick link to meals */}
      <Link to="/meals">
        <Card className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer">
          <div>
            <p className="font-semibold text-gray-800">View today's meal plan</p>
            <p className="text-sm text-gray-400">Tailored to your {training.label.toLowerCase()} day</p>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </Card>
      </Link>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

function trainingEmoji(type) {
  const map = {
    rest: '😴', easy_run: '🏃', tempo_run: '🏃', long_run: '🏃',
    easy_bike: '🚴', long_bike: '🚴', interval_bike: '🚴',
    swim: '🏊', strength: '💪', yoga: '🧘',
  }
  return map[type] || '🏋️'
}
