import { useChatStream } from "../hooks/useChatStream"
import { ChatInput } from "./ChatInput"
import { MessageBubble } from "./MessageBubble"
import { ThinkingIndicator } from "./ThinkingIndicator"
import { useEffect, useRef, useState } from "react"

export function ChatWindow() {
  const { messages, sendMessage, thinking } = useChatStream()
  const startTimeRef = useRef<number | null>(null)
  const [duration, setDuration] = useState<number | undefined>(undefined)

  const isEmpty = messages.length === 0

  useEffect(() => {
    if (thinking && messages.length > 0) {
      startTimeRef.current = performance.now()
      setDuration(undefined)
    } else if (!thinking && startTimeRef.current) {
      const end = performance.now()
      setDuration((end - startTimeRef.current) / 1000)
      startTimeRef.current = null
    }
  }, [thinking, messages.length])

  return (
    <div className="h-screen bg-[#fafafa] flex flex-col">
      {/* ================= DEFAULT STATE ================= */}
      {isEmpty && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <h1 className="text-[36px] font-semibold text-gray-900 mb-2">
            Hi, Welcome to swades.ai
          </h1>

          <p className="text-gray-500 mb-8">
            Your all in one Contact Support !
          </p>

          <div className="w-full max-w-3xl">
            <ChatInput onSend={sendMessage} />
          </div>
        </div>
      )}

      {/* ================= CHAT STATE ================= */}
      {!isEmpty && (
        <>
          <div className="flex-1 overflow-y-auto px-6 py-10">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}
                <ThinkingIndicator visible={thinking && messages.length > 0} />
            </div>
          </div>

          {/* ================= INPUT AT BOTTOM ================= */}
          <div className="border-t bg-white">
            <div className="max-w-3xl mx-auto px-6 py-4">
              <ChatInput onSend={sendMessage} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
