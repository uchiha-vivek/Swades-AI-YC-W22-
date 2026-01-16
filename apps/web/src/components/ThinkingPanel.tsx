import { motion } from 'framer-motion'
import { Brain, Route, Database, Clock } from 'lucide-react'


export function ThinkingPanel({
  steps,
  duration,
}: {
  steps: { label: string; value: string }[]
  duration?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-[#f7f7f7] px-5 py-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-2">
          <Brain size={14} />
          Thinking Completed
        </span>

        {duration !== undefined && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {duration.toFixed(1)} Seconds
          </span>
        )}
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-gray-700 bg-white border rounded-lg px-3 py-2"
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-md border bg-gray-50">
              {s.label === 'Thinking' && <Brain size={14} />}
              {s.label === 'Planning' && <Route size={14} />}
              {s.label === 'Tool' && <Database size={14} />}
            </div>

            <span className="font-medium">{s.label} :</span>
            <span className="text-gray-500">{s.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
