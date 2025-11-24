import { useState } from 'react'
import styled from 'styled-components'
import { useHM6Store } from '../store/useHM6Store'

const Container = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const TextArea = styled.textarea`
  background: var(--color-bg);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }
  
  &::placeholder {
    color: var(--color-text-secondary);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`

const Button = styled.button`
  background: ${props => props.variant === 'secondary' 
    ? 'transparent' 
    : 'var(--color-accent)'};
  color: ${props => props.variant === 'secondary'
    ? 'var(--color-text-secondary)'
    : 'var(--color-bg)'};
  border: ${props => props.variant === 'secondary'
    ? '1px solid var(--color-border)'
    : 'none'};
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.variant === 'secondary'
      ? 'var(--color-border)'
      : 'var(--color-accent-secondary)'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const CharCount = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-align: right;
`

function QueryInput() {
  const [query, setQuery] = useState('')
  const { startQuery, isProcessing, reset } = useHM6Store()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && !isProcessing) {
      startQuery(query.trim())
    }
  }
  
  const handleReset = () => {
    setQuery('')
    reset()
  }
  
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask HM6 anything... (e.g., 'How can I improve soil health on my farm?')"
          disabled={isProcessing}
        />
        <CharCount>{query.length} characters</CharCount>
        <ButtonGroup>
          <Button 
            type="button" 
            variant="secondary"
            onClick={handleReset}
            disabled={!query && !isProcessing}
          >
            Reset
          </Button>
          <Button 
            type="submit"
            disabled={!query.trim() || isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Query HM6'}
          </Button>
        </ButtonGroup>
      </Form>
    </Container>
  )
}

export default QueryInput
