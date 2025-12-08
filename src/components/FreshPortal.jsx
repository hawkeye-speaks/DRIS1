import { useState } from 'react'
import styled from 'styled-components'
import { Zap, RefreshCw, Check, X } from 'lucide-react'

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
  background: var(--color-background);
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const StatusBadge = styled.span`
  background: ${props => props.$active ? 'var(--color-accent)' : 'var(--color-border)'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-secondary)'};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
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

const Content = styled.div`
  max-height: 140px;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  color: var(--color-text-secondary);
  text-align: center;
  gap: 0.5rem;
`

const QueryDisplay = styled.div`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
`

const QueryLabel = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`

const QueryText = styled.div`
  color: var(--color-text);
  font-size: 0.9rem;
  line-height: 1.5;
`

const ResponseDisplay = styled.div`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
`

const ResponseText = styled.div`
  color: var(--color-text);
  font-size: 0.9rem;
  line-height: 1.6;
  white-space: pre-wrap;
`

const VerdictBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: ${props => props.$verdict === 'PASS' 
    ? 'rgba(34, 197, 94, 0.1)' 
    : props.$verdict === 'FAIL' 
    ? 'rgba(239, 68, 68, 0.1)'
    : 'rgba(234, 179, 8, 0.1)'};
  border: 1px solid ${props => props.$verdict === 'PASS' 
    ? 'rgba(34, 197, 94, 0.3)' 
    : props.$verdict === 'FAIL' 
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(234, 179, 8, 0.3)'};
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const VerdictIcon = styled.div`
  flex-shrink: 0;
  color: ${props => props.$verdict === 'PASS' 
    ? '#22c55e' 
    : props.$verdict === 'FAIL' 
    ? '#ef4444'
    : '#eab308'};
`

const VerdictText = styled.div`
  flex: 1;
  font-size: 0.9rem;
  color: var(--color-text);
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

const PortalButton = styled.button`
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(245, 158, 11, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const InfoText = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
`

function FreshPortal({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '')
  const [response, setResponse] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [model, setModel] = useState('grok-2')

  const handlePortalQuery = async () => {
    if (!query.trim() || isProcessing) return

    setIsProcessing(true)
    setResponse(null)

    try {
      const res = await fetch('http://localhost:3001/api/companion/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, model })
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error('Portal error:', error)
      setResponse({
        message: 'Demo mode: Portal would verify this query independently with no session context.',
        verdict: 'NEEDS_REVIEW',
        reasoning: 'Backend service not available'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResponse(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handlePortalQuery()
    }
  }

  const getVerdictIcon = (verdict) => {
    switch(verdict) {
      case 'PASS': return <Check size={20} />
      case 'FAIL': return <X size={20} />
      default: return <RefreshCw size={20} />
    }
  }

  return (
    <Container>
      <Header>
        <Title>
          <Zap size={16} />
          Fresh Portal
          <StatusBadge $active={!response}>
            {response ? 'USED' : 'READY'}
          </StatusBadge>
        </Title>
        <ModelSelector value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="grok-2">Grok 2 (XAI)</option>
          <option value="claude-sonnet-4">Claude Sonnet 4</option>
          <option value="gpt-4">GPT-4</option>
        </ModelSelector>
      </Header>

      <Content>
        <InfoText>
          <strong>Stateless verification:</strong> Portal has no memory of previous queries. 
          Can't remember what it never knew = can't hallucinate context. 
          Perfect for independent fact-checking and grounding.
        </InfoText>

        {response ? (
          <>
            <QueryDisplay>
              <QueryLabel>Your Query</QueryLabel>
              <QueryText>{query}</QueryText>
            </QueryDisplay>

            <ResponseDisplay>
              <QueryLabel>Fresh Response</QueryLabel>
              <ResponseText>{response.message}</ResponseText>
              
              {response.verdict && (
                <VerdictBox $verdict={response.verdict}>
                  <VerdictIcon $verdict={response.verdict}>
                    {getVerdictIcon(response.verdict)}
                  </VerdictIcon>
                  <VerdictText>
                    <strong>{response.verdict}:</strong> {response.reasoning}
                  </VerdictText>
                </VerdictBox>
              )}
            </ResponseDisplay>
          </>
        ) : (
          <EmptyState>
            <Zap size={48} />
            <div>Portal ready for single-use verification</div>
            <small>Clears after each use</small>
          </EmptyState>
        )}
      </Content>

      <InputArea>
        <InputContainer>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a fact-checking question, verify a claim, or ground a concept..."
            disabled={isProcessing}
          />
          <PortalButton 
            onClick={response ? handleClear : handlePortalQuery}
            disabled={isProcessing || (!response && !query.trim())}
          >
            <Zap size={16} />
            {response ? 'Clear & Reset' : isProcessing ? 'Querying...' : 'Portal Query'}
          </PortalButton>
        </InputContainer>
      </InputArea>
    </Container>
  )
}

export default FreshPortal
