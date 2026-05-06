const colorMap = {
  gray:   'bg-gray-100 text-gray-600',
  blue:   'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  red:    'bg-red-100 text-red-700',
  green:  'bg-green-100 text-green-700',
  cyan:   'bg-cyan-100 text-cyan-700',
  purple: 'bg-purple-100 text-purple-700',
  amber:  'bg-amber-100 text-amber-700',
}

export default function Badge({ label, color = 'gray', size = 'sm' }) {
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sz} ${colorMap[color] || colorMap.gray}`}>
      {label}
    </span>
  )
}
