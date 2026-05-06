export default function MacroBar({ carbs, protein, fat }) {
  const total = carbs + protein + fat
  const cp = Math.round((carbs / total) * 100)
  const pp = Math.round((protein / total) * 100)
  const fp = 100 - cp - pp

  return (
    <div className="space-y-1">
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        <div className="bg-amber-400 transition-all" style={{ width: `${cp}%` }} />
        <div className="bg-green-500 transition-all" style={{ width: `${pp}%` }} />
        <div className="bg-blue-400 transition-all" style={{ width: `${fp}%` }} />
      </div>
      <div className="flex gap-4 text-xs text-gray-500">
        <span><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1" />Carbs {cp}%</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />Protein {pp}%</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />Fat {fp}%</span>
      </div>
    </div>
  )
}
