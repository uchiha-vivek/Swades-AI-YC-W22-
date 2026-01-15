import { motion } from 'framer-motion'
import { Brain, Route, Database, Clock } from 'lucide-react'
import type { JSX } from 'react';

export function ThinkingPanel({
  steps,
  duration,
}: {
  steps: { label: string; value: string }[]
  duration?: number
}) {
  const iconMap: Record<string, JSX.Element> = {
    Thinking: <Brain size={18} />,
    Planning: <Route size={18} />,
    Tool: <Database size={18} />,
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-gray-50 px-5 py-4 space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <Brain size={14} className="opacity-70" />
          Thinking…
        </span>

        {duration !== undefined && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {duration.toFixed(1)}s
          </span>
        )}
      </div>

      {/* Icons row */}
      <div className="flex items-center gap-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-lg border bg-white flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title={`${s.label}: ${s.value}`}
          >
            {iconMap[s.label]}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
