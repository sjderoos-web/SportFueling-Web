import { useState } from 'react'
import { useStore } from '../store/useStore'
import { calcDailyTargets, weeklyAvgKcal } from '../utils/nutritionCalc'
import { SPORT_TYPES, TRAINING_TYPES } from '../data/mockData'
import Card from '../components/ui/Card'

export default function Profile() {
  const { profile, schedule, updateProfile } = useStore()
  const [form, setForm] = useState({ ...profile })
  const [saved, setSaved] = useState(false)

  function handleSave() {
    updateProfile({
      ...form,
      ageYears: Number(form.ageYears),
      weightKg: Number(form.weightKg),
      heightCm: Number(form.heightCm),
      goalWeightKg: Number(form.goalWeightKg),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const avgKcal = weeklyAvgKcal(schedule, { ...form, ageYears: Number(form.ageYears), weightKg: Number(form.weightKg), heightCm: Number(form.heightCm) })

  const fieldClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
  const labelClass = "text-xs text-gray-500 font-medium block mb-1.5"

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Goals</h1>
        <p className="text-sm text-gray-400 mt-1">Your stats are used to calculate personalised nutrition targets</p>
      </div>

      <Card className="p-5 space-y-4">
        <h2 className="font-semibold text-gray-800">Personal info</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input className={fieldClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Primary sport</label>
            <select className={fieldClass} value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))}>
              {SPORT_TYPES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Age</label>
            <input type="number" min={10} max={100} className={fieldClass} value={form.ageYears}
              onChange={e => setForm(f => ({ ...f, ageYears: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Sex</label>
            <select className={fieldClass} value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Height (cm)</label>
            <input type="number" min={100} max={250} className={fieldClass} value={form.heightCm}
              onChange={e => setForm(f => ({ ...f, heightCm: e.target.value }))} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Current weight (kg)</label>
            <input type="number" step={0.1} className={fieldClass} value={form.weightKg}
              onChange={e => setForm(f => ({ ...f, weightKg: e.target.value }))} />
          </div>
          <div>
            <label className={labelClass}>Goal weight (kg)</label>
            <input type="number" step={0.1} className={fieldClass} value={form.goalWeightKg}
              onChange={e => setForm(f => ({ ...f, goalWeightKg: e.target.value }))} />
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Goal mode</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'lose',     label: 'Lose weight',  icon: '📉', desc: '−300 kcal/day deficit' },
            { value: 'maintain', label: 'Maintain',     icon: '⚖️',  desc: 'Match daily expenditure' },
            { value: 'gain',     label: 'Build',        icon: '📈', desc: '+200 kcal/day surplus' },
          ].map(g => (
            <button
              key={g.value}
              onClick={() => setForm(f => ({ ...f, goalMode: g.value }))}
              className={`p-4 rounded-xl border text-left transition-all
                ${form.goalMode === g.value
                  ? 'bg-green-50 border-green-400 text-green-800'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
            >
              <div className="text-2xl mb-1">{g.icon}</div>
              <div className="font-semibold text-sm">{g.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{g.desc}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Weekly calorie preview */}
      <Card className="p-5 bg-gray-50">
        <h2 className="font-semibold text-gray-700 mb-3">Weekly nutrition preview</h2>
        <p className="text-sm text-gray-500 mb-3">Avg daily target across your current schedule: <span className="font-bold text-gray-900">{avgKcal.toLocaleString()} kcal</span></p>
        <div className="grid grid-cols-7 gap-1">
          {schedule.map((s, i) => {
            const t = calcDailyTargets({ ...form, ageYears: Number(form.ageYears), weightKg: Number(form.weightKg), heightCm: Number(form.heightCm), trainingType: s.type, durationMin: s.durationMin })
            return (
              <div key={s.day} className="text-center">
                <p className="text-xs text-gray-400 mb-1">{s.day}</p>
                <div className="bg-white border border-gray-200 rounded-lg py-2 px-1">
                  <p className="text-xs font-bold text-gray-800">{(t.kcal / 1000).toFixed(1)}k</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
          ${saved ? 'bg-green-400 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
      >
        {saved ? '✓ Saved!' : 'Save changes'}
      </button>
    </div>
  )
}
