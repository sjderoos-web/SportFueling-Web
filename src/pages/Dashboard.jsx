import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Droplets, TrendingDown, ChevronRight, Zap } from 'lucide-react'
import { useStore } from '../store/useStore'
import { calcDailyTargets, calcHydrationLiters } from '../utils/nutritionCalc'
import { TRAINING_TYPES } from '../data/mockData'

const TODAY_INDEX = (new Date().getDay() + 6) % 7

const INTENSITY_COLORS = {
  rest:           { ring: '#374151', dot: 'bg-gray-500',   text: 'text-gray-400' },
  easy_run:       { ring: '#3b82f6', dot: 'bg-blue-400',   text: 'text-blue-400' },
  tempo_run:      { ring: '#f97316', dot: 'bg-orange-400', text: 'text-orange-400' },
  long_run:       { ring: '#ef4444', dot: 'bg-red-500',    text: 'text-red-400' },
  easy_bike:      { ring: '#3b82f6', dot: 'bg-blue-400',   text: 'text-blue-400' },
  long_bike:      { ring: '#ef4444', dot: 'bg-red-500',    text: 'text-red-400' },
  interval_bike:  { ring: '#f97316', dot: 'bg-orange-400', text: 'text-orange-400' },
  swim:           { ring: '#06b6d4', dot: 'bg-cyan-400',   text: 'text-cyan-400' },
  strength:       { ring: '#a855f7', dot: 'bg-purple-400', text: 'text-purple-400' },
  yoga:           { ring: '#22c55e', dot: 'bg-green-400',  text: 'text-green-400' },
}

function CalorieRing({ kcal, trainingKcal, tdee, size = 180 }) {
  const r = (size - 20) / 2
  const circ = 2 * Math.PI * r
  // Three arcs stacked: base TDEE (gray), training (orange), shown as single filled ring
  // Ring fills based on training fraction of total
  const trainingFrac = Math.min(trainingKcal / kcal, 1)
  const baseFrac = Math.min(tdee / kcal, 1)

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1f2937" strokeWidth={14} />
        {/* Base TDEE arc */}
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#4b5563" strokeWidth={14} strokeLinecap="round"
          strokeDasharray={`${baseFrac * circ} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        {/* Training arc */}
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#f97316" strokeWidth={14} strokeLinecap="round"
          strokeDasharray={`${trainingFrac * circ} ${circ}`}
          strokeDashoffset={-baseFrac * circ}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-white leading-none">{(kcal / 1000).toFixed(1)}k</span>
        <span className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">kcal</span>
      </div>
    </div>
  )
}

function MacroRow({ label, grams, total, color, bgColor }) {
  const pct = Math.round((grams / total) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-white font-bold">{grams}g <span className="text-gray-500 font-normal text-xs">{pct}%</span></span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${bgColor} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { profile, schedule, weights } = useStore()
  const todaySchedule = schedule[TODAY_INDEX]
  const training = TRAINING_TYPES[todaySchedule.type]
  const ic = INTENSITY_COLORS[todaySchedule.type] || INTENSITY_COLORS.rest

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
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO (Whoop-style dark) ── */}
      <div className="bg-gray-900 px-5 pt-6 pb-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{dateStr}</p>
            <h1 className="text-xl font-bold mt-0.5">Good {greeting()}, {profile.name}</h1>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm font-bold">
            {profile.name[0]}
          </div>
        </div>

        {/* Today's session pill */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Today</span>
          <span className="h-px flex-1 bg-gray-800" />
          <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gray-800 ${ic.text}`}>
            {training.label}
          </span>
          {todaySchedule.durationMin > 0 && (
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
              {todaySchedule.durationMin} min
            </span>
          )}
        </div>

        {/* Calorie ring + breakdown */}
        <div className="flex items-center gap-6">
          <CalorieRing
            kcal={targets.kcal}
            trainingKcal={targets.trainingKcal}
            tdee={targets.tdee}
          />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Base</p>
              <p className="text-lg font-bold text-gray-300">{targets.tdee.toLocaleString()} <span className="text-xs font-normal text-gray-500">kcal</span></p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Training</p>
              <p className="text-lg font-bold text-orange-400">+{targets.trainingKcal.toLocaleString()} <span className="text-xs font-normal text-gray-500">kcal</span></p>
            </div>
            {profile.goalMode === 'lose' && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Deficit</p>
                <p className="text-lg font-bold text-blue-400">−300 <span className="text-xs font-normal text-gray-500">kcal</span></p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MACROS ── */}
      <div className="px-5 py-5 bg-gray-900 mt-px space-y-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Macros</p>
        <MacroRow label="Carbohydrates" grams={targets.carbs} total={targets.carbs + targets.protein + targets.fat} bgColor="bg-orange-400" />
        <MacroRow label="Protein"       grams={targets.protein} total={targets.carbs + targets.protein + targets.fat} bgColor="bg-green-400" />
        <MacroRow label="Fat"           grams={targets.fat}    total={targets.carbs + targets.protein + targets.fat} bgColor="bg-blue-400" />
      </div>

      {/* ── STATS CARDS (Strava-style white) ── */}
      <div className="px-4 pt-5 grid grid-cols-2 gap-3">

        <div className="bg-white rounded-2xl p-4 text-gray-900">
          <div className="flex items-center gap-1.5 mb-2">
            <Droplets size={14} className="text-blue-400" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hydration</span>
          </div>
          <p className="text-3xl font-black text-gray-900 leading-none">{hydration}</p>
          <p className="text-xs text-gray-400 mt-1">litres today</p>
          <p className="text-xs text-blue-500 mt-0.5">{Math.round(hydration * 0.4 * 10) / 10}L during workout</p>
        </div>

        <div className="bg-white rounded-2xl p-4 text-gray-900">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingDown size={14} className="text-green-500" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Weight</span>
          </div>
          <p className="text-3xl font-black text-gray-900 leading-none">{currentWeight}</p>
          <p className="text-xs text-gray-400 mt-1">kg current</p>
          <div className="flex gap-2 mt-0.5 flex-wrap">
            {totalLost > 0 && <span className="text-xs text-green-600 font-semibold">−{totalLost} kg lost</span>}
            {toGoal > 0 && <span className="text-xs text-gray-400">{toGoal} to goal</span>}
          </div>
        </div>

        <Link to="/weight" className="col-span-2">
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Goal</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-900">{profile.goalWeightKg} kg target</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                  ${profile.goalMode === 'lose' ? 'bg-blue-50 text-blue-600' :
                    profile.goalMode === 'gain' ? 'bg-orange-50 text-orange-600' :
                    'bg-green-50 text-green-600'}`}>
                  {profile.goalMode === 'lose' ? 'Weight loss' : profile.goalMode === 'gain' ? 'Building' : 'Maintain'}
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full w-48 overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((totalLost / (firstWeight - profile.goalWeightKg)) * 100))}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{Math.round((totalLost / (firstWeight - profile.goalWeightKg)) * 100)}% of goal reached</p>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        </Link>
      </div>

      {/* ── WEEK STRIP ── */}
      <div className="px-4 pt-5 pb-6">
        <div className="bg-gray-900 rounded-2xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">This Week</p>
          <div className="grid grid-cols-7 gap-1">
            {schedule.map((s, i) => {
              const ic = INTENSITY_COLORS[s.type] || INTENSITY_COLORS.rest
              const isToday = i === TODAY_INDEX
              return (
                <div key={s.day} className="flex flex-col items-center gap-2">
                  <span className={`text-xs font-medium ${isToday ? 'text-white' : 'text-gray-600'}`}>
                    {s.day}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${isToday ? 'ring-2 ring-offset-2 ring-offset-gray-900' : ''}
                    ${isToday ? `ring-[${ic.ring}]` : ''}
                    bg-gray-800`}
                    style={isToday ? { boxShadow: `0 0 0 2px #111827, 0 0 0 4px ${ic.ring}` } : {}}
                  >
                    <span className="text-sm">{trainingEmoji(s.type)}</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${isToday ? ic.dot : 'bg-gray-700'}`} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── MEAL PLAN CTA (Strava activity card style) ── */}
      <div className="px-4 pb-8">
        <Link to="/meals">
          <div className="bg-orange-500 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-orange-500/20">
            <div>
              <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1">Ready to eat?</p>
              <p className="text-white font-bold text-base">View today's meal plan</p>
              <p className="text-orange-200 text-xs mt-0.5">Tailored to your {training.label.toLowerCase()}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ChevronRight size={20} className="text-white" />
            </div>
          </div>
        </Link>
      </div>

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
