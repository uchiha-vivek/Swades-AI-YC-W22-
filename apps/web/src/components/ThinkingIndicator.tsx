import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb } from "lucide-react"

export function ThinkingIndicator({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex items-center gap-2 text-sm text-gray-500"
        >
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-yellow-500"
          >
            <Lightbulb size={14} />
          </motion.div>

          <span className="tracking-wide">Thinking</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
