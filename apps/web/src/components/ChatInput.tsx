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

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter → send
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }

    // Ctrl+Enter or Shift+Enter → new line (default behavior)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="flex items-end gap-2 border rounded-2xl bg-white px-3 py-2 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask something..."
          className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </motion.form>
  )
}
