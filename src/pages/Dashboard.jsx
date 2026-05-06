import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Settings, Droplets, Flame, TrendingDown, ChevronRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { calcDailyTargets, calcHydrationLiters } from '../utils/nutritionCalc'
import { TRAINING_TYPES, MEALS } from '../data/mockData'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const TODAY_INDEX = (new Date().getDay() + 6) % 7

function Ring({ pct, color, size = 52 }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f3f4f6" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={6} strokeLinecap="round"
          strokeDasharray={`${(Math.min(pct, 100) / 100) * circ} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.7s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-700">{pct}%</span>
      </div>
    </div>
  )
}

function MiniBarChart({ values, color, highlightIndex }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex items-end gap-0.5 h-9">
      {values.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: i === highlightIndex ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { profile, schedule, weights } = useStore()
  const todaySchedule = schedule[TODAY_INDEX]
  const training = TRAINING_TYPES[todaySchedule.type]

  const targets = useMemo(() =>
    calcDailyTargets({ ...profile, trainingType: todaySchedule.type, durationMin: todaySchedule.durationMin }),
    [profile, todaySchedule]
  )

  const hydration = calcHydrationLiters({
    weightKg: profile.weightKg,
    trainingType: todaySchedule.type,
    durationMin: todaySchedule.durationMin,
  })

  const weeklyData = useMemo(() =>
    schedule.map((s, i) => {
      const t = calcDailyTargets({ ...profile, trainingType: s.type, durationMin: s.durationMin })
      return { day: s.day, kcal: t.kcal, training: t.trainingKcal }
    }),
    [profile, schedule]
  )

  const currentWeight = weights[weights.length - 1]?.weight ?? profile.weightKg
  const firstWeight = weights[0]?.weight ?? profile.weightKg
  const totalLost = Math.round((firstWeight - currentWeight) * 10) / 10
  const goalProgress = Math.min(
    Math.round((totalLost / Math.max(firstWeight - profile.goalWeightKg, 0.1)) * 100),
    100
  )

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const mealCards = [
    { slot: 'breakfast',   label: 'Breakfast',   icon: '🥣', from: 'from-amber-100',  to: 'to-orange-50' },
    { slot: 'lunch',       label: 'Lunch',        icon: '🍝', from: 'from-blue-100',   to: 'to-sky-50' },
    { slot: 'dinner',      label: 'Dinner',       icon: '🥗', from: 'from-violet-100', to: 'to-purple-50' },
    ...(todaySchedule.type !== 'rest'
      ? [{ slot: 'pre_workout', label: 'Pre-Workout', icon: '⚡', from: 'from-green-100', to: 'to-emerald-50' }]
      : [{ slot: 'snack',      label: 'Snack',        icon: '🍎', from: 'from-pink-100',  to: 'to-rose-50' }]
    ),
  ]

  return (
    <div className="min-h-screen bg-stone-50 p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Good {greeting()}, {profile.name} 👋</h1>
          <p className="text-sm text-gray-400">{dateStr}</p>
        </div>
        <div className="flex items-center gap-2">
          {[Settings, Bell].map((Icon, i) => (
            <button key={i} className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
              <Icon size={16} />
            </button>
          ))}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {profile.name[0]}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
              <Flame size={14} className="text-orange-400" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Daily target</span>
          </div>
          <p className="text-2xl font-black text-gray-900 leading-none">
            {targets.kcal.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">
            {profile.goalMode === 'lose' ? '−300 kcal deficit' : 'Maintenance'}
          </p>
          <MiniBarChart values={weeklyData.map(d => d.kcal)} color="#f97316" highlightIndex={TODAY_INDEX} />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <Droplets size={14} className="text-blue-400" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Hydration</span>
          </div>
          <p className="text-2xl font-black text-gray-900 leading-none">{hydration}</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">litres · {Math.round(hydration * 0.4 * 10) / 10}L workout</p>
          <div className="flex items-end gap-0.5 h-9">
            {[0.5, 0.65, 0.7, 0.9, 0.75, 0.55, 0.8].map((v, i) => (
              <div key={i} className="flex-1 rounded-sm"
                style={{ height: `${v * 100}%`, backgroundColor: i === TODAY_INDEX ? '#60a5fa' : '#bfdbfe' }} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-base leading-none">
              {trainingEmoji(todaySchedule.type)}
            </div>
            <span className="text-xs text-gray-400 font-medium">Training burn</span>
          </div>
          <p className="text-2xl font-black text-gray-900 leading-none">
            {targets.trainingKcal.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">
            {training.label}{todaySchedule.durationMin > 0 ? ` · ${todaySchedule.durationMin} min` : ''}
          </p>
          <MiniBarChart values={weeklyData.map(d => d.training + 1)} color="#f59e0b" highlightIndex={TODAY_INDEX} />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingDown size={14} className="text-green-500" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Weight</span>
          </div>
          <p className="text-2xl font-black text-gray-900 leading-none">{currentWeight}</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">
            kg · goal {profile.goalWeightKg} kg{totalLost > 0 ? ` · −${totalLost} lost` : ''}
          </p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-400 rounded-full transition-all duration-700"
              style={{ width: `${goalProgress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{goalProgress}% of goal reached</p>
        </div>

      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Activity area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Activity</h3>
              <p className="text-xs text-gray-400">Calorie targets (kcal)</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg font-medium">Weekly</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="kcalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={v => [`${v.toLocaleString()} kcal`, 'Target']}
                contentStyle={{ borderRadius: 10, fontSize: 11, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="kcal" stroke="#60a5fa" strokeWidth={2.5}
                fill="url(#kcalGrad)" dot={false} activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Progress dots */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-sm">Progress</h3>
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg font-medium">Weekly</span>
          </div>
          <div className="flex items-start gap-5">
            <div>
              <p className="text-5xl font-black text-gray-900 leading-none">{goalProgress}%</p>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Weekly Plan<br />Progress
              </p>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-2 font-medium">Training days</p>
              <div className="grid grid-cols-5 gap-1.5">
                {schedule.flatMap((s, dayIdx) =>
                  Array.from({ length: Math.ceil(25 / 7) }).map((_, j) => {
                    const idx = dayIdx * Math.ceil(25 / 7) + j
                    if (idx >= 25) return null
                    const isTraining = s.type !== 'rest'
                    const isPast = dayIdx < TODAY_INDEX
                    const isToday = dayIdx === TODAY_INDEX
                    return (
                      <div key={idx}
                        className={`w-5 h-5 rounded-full transition-colors
                          ${isPast && isTraining ? 'bg-orange-400' :
                            isPast ? 'bg-gray-200' :
                            isToday ? 'bg-orange-200' : 'bg-gray-100'}`}
                      />
                    )
                  }).filter(Boolean)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Macro rings */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1 justify-center">
          {[
            { label: 'Carbs',   pct: targets.carbPct,    color: '#f97316', sub: `${targets.carbs}g` },
            { label: 'Protein', pct: targets.proteinPct, color: '#22c55e', sub: `${targets.protein}g` },
            { label: 'Goal',    pct: goalProgress,        color: '#a855f7', sub: `${profile.goalWeightKg} kg` },
          ].map(r => (
            <div key={r.label}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
              <Ring pct={r.pct} color={r.color} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{r.label}</p>
                <p className="text-xs text-gray-400">{r.sub}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Meal cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Today's meals</h3>
          <Link to="/meals"
            className="text-xs text-orange-500 font-semibold flex items-center gap-0.5 hover:underline">
            See all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {mealCards.map(m => {
            const meal = MEALS[m.slot]?.[0]
            return (
              <Link key={m.slot} to="/meals">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                  <div className={`bg-gradient-to-br ${m.from} ${m.to} h-28 flex items-center justify-center`}>
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
                      {m.icon}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <p className="font-semibold text-gray-800 text-sm">{m.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{meal?.name}</p>
                    <p className="text-xs text-gray-500 font-medium mt-1.5">
                      {meal?.kcal} kcal
                      <span className="text-gray-300 mx-1">·</span>
                      {meal?.carbs}g carbs
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
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
