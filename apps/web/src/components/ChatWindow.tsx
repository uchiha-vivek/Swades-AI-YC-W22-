import { useChatStream } from "../hooks/useChatStream"
import { ChatInput } from "./ChatInput"
import { MessageBubble } from "./MessageBubble"
import { ThinkingPanel } from "./ThinkingPanel"

export function ChatWindow() {
  const { messages, sendMessage, thinking } = useChatStream()

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && !thinking && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <p className="text-muted-foreground text-sm">
                Start a conversation
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}

          {thinking && (
            <ThinkingPanel
              steps={[
                { label: 'Thinking', value: 'Analyzing request' },
                { label: 'Planning', value: 'Selecting agent' },
                { label: 'Tool', value: 'Querying database' },
              ]}
            />
          )}
        </div>
      </div>

      <div className="border-t bg-card">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  )
}
