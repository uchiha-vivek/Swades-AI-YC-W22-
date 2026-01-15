import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [text, setText] = useState('')

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="flex items-end gap-3 bg-card border border-border rounded-2xl p-2 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder="Ask something..."
          className="flex-1 resize-none bg-transparent px-4 py-3 text-sm focus:outline-none"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center disabled:opacity-50"
        >
          <Send size={18} />
        </motion.button>
      </div>
    </motion.form>
  )
}
