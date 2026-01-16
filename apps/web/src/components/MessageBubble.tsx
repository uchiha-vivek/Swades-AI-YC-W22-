import { motion } from 'framer-motion'
import type { Message } from '../types/chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


export function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === 'user'

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                <div className="w-7 h-7 rounded-full border bg-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-black rounded-full" />
                </div>
            )}

            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                        ? 'bg-black text-white'
                        : 'bg-[#f2f2f2] text-gray-900'
                    }`}
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                </ReactMarkdown>

            </div>
        </motion.div>
    )
}
