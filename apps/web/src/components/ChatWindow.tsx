import { useChatStream } from "../hooks/useChatStream"
import { ChatInput } from "./ChatInput"
import { MessageBubble } from "./MessageBubble"
import { ThinkingPanel } from "./ThinkingPanel"
import { useEffect, useRef, useState } from 'react'


export function ChatWindow() {
    const { messages, sendMessage, thinking } = useChatStream()
    const startTimeRef = useRef<number | null>(null)
    const [duration, setDuration] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (thinking) {
            startTimeRef.current = performance.now()
            setDuration(undefined)
        } else if (!thinking && startTimeRef.current) {
            const end = performance.now()
            setDuration((end - startTimeRef.current) / 1000)
            startTimeRef.current = null
        }
    }, [thinking])

    return (
        <div className="flex flex-col h-screen bg-[#fafafa]">
            <div className="flex-1 overflow-y-auto px-6 py-10">
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.length === 0 && !thinking && (
                        <div className="flex items-center justify-center min-h-[60vh] text-center text-sm text-gray-400">
                            Start a conversation
                        </div>
                    )}

                    {messages.map((m, i) => (
                        <MessageBubble key={i} message={m} />
                    ))}

                    {thinking && messages.length > 0 && (
                        <ThinkingPanel
                            steps={[
                                { label: 'Thinking', value: 'Finding open incidents' },
                                { label: 'Planning', value: 'Execute query in New Relic' },
                                { label: 'Tool', value: 'New Relic connected' },
                            ]}
                            duration={duration}
                        />
                    )}

                </div>
            </div>

            <div className="border-t bg-white">
                <div className="max-w-3xl mx-auto px-6 py-4">
                    <ChatInput onSend={sendMessage} />
                </div>
            </div>
        </div>
    )
}

