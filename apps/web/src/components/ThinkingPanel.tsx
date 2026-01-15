import { motion} from 'framer-motion';

export function ThinkingPanel({
  steps,
}: {
  steps: { label: string; value: string }[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-gray-50 p-4 space-y-2"
    >
      <div className="text-xs text-muted-foreground mb-2">
        Thinking...
      </div>

      {steps.map((s, i) => (
        <div
          key={i}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm mr-2"
        >
          <span className="font-medium text-muted-foreground">
            {s.label}:
          </span>
          <span className="text-foreground">{s.value}</span>
        </div>
      ))}
    </motion.div>
  )
}
