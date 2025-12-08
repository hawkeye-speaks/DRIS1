import { useState } from 'react'
import styled from 'styled-components'
import { Send, Trash2, Settings } from 'lucide-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 240px;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  overflow: hidden;
`

const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-background);
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
`

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: var(--color-surface);
    color: var(--color-accent);
  }
`

const ModelSelector = styled.select`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
`

const Messages = styled.div`
  max-height: 120px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Message = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  max-width: 85%;
  ${props => props.$isUser ? `
    background: var(--color-accent);
    color: white;
    align-self: flex-end;
  ` : `
    background: var(--color-background);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    align-self: flex-start;
  `}
`

const MessageText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
`

const InputArea = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
`

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Input = styled.textarea`
  flex: 1;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: none;
  min-height: 60px;

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`

const SendButton = styled.button`
  background: var(--color-accent);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ActionBar = styled.div`
  padding: 0.5rem 1rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ActionLink = styled.button`
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.85rem;
  padding: 0;

  &:hover {
    color: var(--color-accent-hover);
  }
`

function ThreadingAssistant({ onSendToPortal }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'I\'m your Threading Assistant. I maintain session context to help you formulate queries, understand methodologies, and guide your exploration. Ask me anything about your current work.'
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [model, setModel] = useState('claude-sonnet-4')

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      const response = await fetch('http://localhost:3001/api/companion/threading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model
        })
      })

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('Threading error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error connecting to companion service. Using demo mode.'
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    if (confirm('Clear conversation history?')) {
      setMessages([{
        role: 'assistant',
        content: 'Session cleared. How can I help you with your next inquiry?'
      }])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Container>
      <Header>
        <Title>Threading Assistant</Title>
        <HeaderActions>
          <ModelSelector value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="claude-sonnet-4">Claude Sonnet 4</option>
            <option value="claude-opus">Claude Opus</option>
            <option value="gpt-4">GPT-4</option>
          </ModelSelector>
          <IconButton onClick={handleClear} title="Clear history">
            <Trash2 size={16} />
          </IconButton>
        </HeaderActions>
      </Header>

      <Messages>
        {messages.map((msg, i) => (
          <Message key={i} $isUser={msg.role === 'user'}>
            <MessageText>{msg.content}</MessageText>
          </Message>
        ))}
      </Messages>

      <InputArea>
        <InputContainer>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about methodology, formulate queries, explore concepts..."
            disabled={isProcessing}
          />
          <SendButton onClick={handleSend} disabled={isProcessing || !input.trim()}>
            <Send size={16} />
            Send
          </SendButton>
        </InputContainer>
      </InputArea>

      <ActionBar>
        <span>Session context preserved</span>
        <ActionLink onClick={() => onSendToPortal && onSendToPortal(input)}>
          Use Fresh Portal for this →
        </ActionLink>
      </ActionBar>
    </Container>
  )
}

export default ThreadingAssistant
