import { render, screen } from '@testing-library/react'
import { MessageBubble } from '../components/MessageBubble'

const userMessage = {
  role: 'user',
  content: 'Hello there',
}

const agentMessage = {
  role: 'agent',
  content: 'Hi! How can I help?',
}

describe('MessageBubble', () => {
  it('renders user message', () => {
    render(<MessageBubble message={userMessage as any} />)

    expect(screen.getByText('Hello there')).toBeInTheDocument()
  })

  it('renders agent message', () => {
    render(<MessageBubble message={agentMessage as any} />)

    expect(screen.getByText('Hi! How can I help?')).toBeInTheDocument()
  })
})
