import { useState } from 'react'
import { useStore } from '../store/useStore'
import { bmi } from '../utils/nutritionCalc'
import Card from '../components/ui/Card'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts'

export default function Weight() {
  const { profile, weights, logWeight } = useStore()
  const [newWeight, setNewWeight] = useState('')

  const current = weights[weights.length - 1]?.weight ?? profile.weightKg
  const start = weights[0]?.weight ?? profile.weightKg
  const totalLost = Math.round((start - current) * 10) / 10
  const toGoal = Math.round((current - profile.goalWeightKg) * 10) / 10
  const bmiVal = bmi(current, profile.heightCm)

  const chartData = weights.map(w => ({
    date: w.date.slice(5),
    weight: w.weight,
  }))

  function handleLog() {
    const val = parseFloat(newWeight)
    if (!val || val < 30 || val > 300) return
    const today = new Date().toISOString().slice(0, 10)
    logWeight(today, val)
    setNewWeight('')
  }

  const bmiCategory = bmiVal < 18.5 ? 'Underweight' :
    bmiVal < 25 ? 'Healthy weight' :
    bmiVal < 30 ? 'Overweight' : 'Obese'

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weight Tracker</h1>
        <p className="text-sm text-gray-400 mt-1">Gradual loss of 0.3–0.5 kg/week protects muscle and performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Current', value: `${current} kg`, sub: '', color: 'text-gray-900' },
          { label: 'Goal', value: `${profile.goalWeightKg} kg`, sub: '', color: 'text-green-600' },
          { label: 'Lost so far', value: totalLost > 0 ? `−${totalLost} kg` : '−', sub: '', color: 'text-orange-500' },
          { label: 'To goal', value: toGoal > 0 ? `${toGoal} kg` : '✓ Reached!', sub: '', color: 'text-gray-700' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Progress Chart</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis
              domain={[Math.floor(profile.goalWeightKg - 2), Math.ceil(start + 1)]}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              unit=" kg"
            />
            <Tooltip
              formatter={(v) => [`${v} kg`, 'Weight']}
              contentStyle={{ borderRadius: '8px', fontSize: 12 }}
            />
            <ReferenceLine
              y={profile.goalWeightKg}
              stroke="#22c55e"
              strokeDasharray="4 4"
              label={{ value: 'Goal', fontSize: 11, fill: '#16a34a', position: 'insideTopRight' }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#ea580c"
              strokeWidth={2}
              dot={{ r: 3, fill: '#ea580c' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Log weight */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Log today's weight</h3>
        <div className="flex gap-3">
          <input
            type="number"
            min={30}
            max={300}
            step={0.1}
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            placeholder="e.g. 78.6"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <span className="flex items-center text-gray-400 text-sm">kg</span>
          <button
            onClick={handleLog}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Log
          </button>
        </div>
      </Card>

      {/* BMI */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-700 mb-3">BMI</h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-black text-gray-900">{bmiVal}</div>
          <div>
            <Badge label={bmiCategory} />
            <p className="text-xs text-gray-400 mt-1">Based on {current} kg / {profile.heightCm} cm</p>
          </div>
        </div>
        <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden relative">
          <div className="h-full flex">
            <div className="bg-blue-300 flex-1" style={{ flexBasis: '18.5%' }} />
            <div className="bg-green-400 flex-1" style={{ flexBasis: '6.5%' }} />
            <div className="bg-amber-400 flex-1" style={{ flexBasis: '5%' }} />
            <div className="bg-red-400 flex-1" />
          </div>
          <div
            className="absolute top-0 h-full w-1 bg-gray-900 rounded-full transition-all"
            style={{ left: `${Math.min(Math.max(((bmiVal - 15) / 25) * 100, 0), 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
        </div>
      </Card>
    </div>
  )
}

function Badge({ label }) {
  const colorMap = {
    'Underweight': 'bg-blue-100 text-blue-700',
    'Healthy weight': 'bg-green-100 text-green-700',
    'Overweight': 'bg-amber-100 text-amber-700',
    'Obese': 'bg-red-100 text-red-700',
  }
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colorMap[label] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  )
}
