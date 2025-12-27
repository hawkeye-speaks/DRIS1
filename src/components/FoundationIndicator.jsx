import styled from 'styled-components'
import { useHM6Store } from '../store/useHM6Store'

const Container = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  position: sticky;
  top: 2rem;
`

const Title = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--color-text);
`

const FoundationCard = styled.div`
  background: var(--color-bg);
  border: 2px solid ${props => {
    switch(props.$pb1Prompt) {
      case 'GENOTYPE': return 'var(--color-foundation-genotype)'
      case 'ALGOTYPE': return 'var(--color-foundation-algotype)'
      case 'PHENOTYPE': return 'var(--color-foundation-phenotype)'
      default: return 'var(--color-border)'
    }
  }};
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 1rem;
`

const FoundationNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => {
    switch(props.$pb1Prompt) {
      case 'GENOTYPE': return 'var(--color-foundation-genotype)'
      case 'ALGOTYPE': return 'var(--color-foundation-algotype)'
      case 'PHENOTYPE': return 'var(--color-foundation-phenotype)'
      default: return 'var(--color-text-secondary)'
    }
  }};
  margin-bottom: 0.5rem;
`

const PB1Prompt = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  
  &::before {
    content: 'pB1: ';
    font-weight: 600;
  }
`

const FoundationDescription = styled.p`
  font-size: 0.875rem;
  color: var(--color-text);
  line-height: 1.6;
`

const RotationInfo = styled.div`
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
  font-size: 0.875rem;
`

const RotationLabel = styled.div`
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
`

const RotationPattern = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const RotationDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active 
    ? 'var(--color-accent)' 
    : 'var(--color-border)'};
  transition: all 0.3s;
`

const foundationInfo = {
  1: {
    number: 'pA1',
    pb1Prompt: 'GENOTYPE',
    description: 'Universal triadic physics with pB1 GENOTYPE prompt - analyzes structural coherence S(t)'
  },
  2: {
    number: 'pA2',
    pb1Prompt: 'ALGOTYPE',
    description: 'Universal triadic physics with pB1 ALGOTYPE prompt - analyzes flow coherence Z⁻¹(t)'
  },
  3: {
    number: 'pA3',
    pb1Prompt: 'PHENOTYPE',
    description: 'Universal triadic physics with pB1 PHENOTYPE prompt - analyzes intentional coherence Φ(t)'
  },
  4: {
    number: 'pA4',
    pb1Prompt: 'GENOTYPE',
    description: 'Universal triadic physics with pB1 GENOTYPE prompt - synthesizes structural insights'
  },
  5: {
    number: 'pA5',
    pb1Prompt: 'ALGOTYPE',
    description: 'Universal triadic physics with pB1 ALGOTYPE prompt - refines algorithmic coherence'
  }
}

function FoundationIndicator() {
  const { activeFoundation, isProcessing } = useHM6Store()
  
  const current = activeFoundation || (isProcessing ? null : 1)
  const info = current ? foundationInfo[current] : foundationInfo[1]
  
  return (
    <Container>
      <Title>Active Foundation</Title>
      
      <FoundationCard $pb1Prompt={info.pb1Prompt}>
        <FoundationNumber $pb1Prompt={info.pb1Prompt}>
          {info.number}
        </FoundationNumber>
        <PB1Prompt>{info.pb1Prompt}</PB1Prompt>
        <FoundationDescription>
          {info.description}
        </FoundationDescription>
      </FoundationCard>
      
      <RotationInfo>
        <RotationLabel>Rotation Pattern (Automatic)</RotationLabel>
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
          Each query uses the next foundation in sequence
        </div>
        <RotationPattern>
          {[1, 2, 3, 4, 5].map(num => (
            <RotationDot key={num} active={current === num} />
          ))}
        </RotationPattern>
      </RotationInfo>
    </Container>
  )
}

export default FoundationIndicator
