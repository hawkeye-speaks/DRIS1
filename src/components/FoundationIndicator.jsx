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
    switch(props.type) {
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
    switch(props.type) {
      case 'GENOTYPE': return 'var(--color-foundation-genotype)'
      case 'ALGOTYPE': return 'var(--color-foundation-algotype)'
      case 'PHENOTYPE': return 'var(--color-foundation-phenotype)'
      default: return 'var(--color-text-secondary)'
    }
  }};
  margin-bottom: 0.5rem;
`

const FoundationType = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
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
    type: 'GENOTYPE',
    description: 'Focuses on data, information, and energy patterns. Analyzes structural foundations and measurable signals.'
  },
  2: {
    number: 'pA2',
    type: 'ALGOTYPE',
    description: 'Examines status quo, narrative frameworks, and paradigmatic constraints. Questions established patterns.'
  },
  3: {
    number: 'pA3',
    type: 'PHENOTYPE',
    description: 'Explores embodied context, environmental interactions, and physical manifestation. Grounds theory in reality.'
  },
  4: {
    number: 'pA4',
    type: 'GENOTYPE',
    description: 'Returns to data patterns with enriched perspective. Synthesizes informational insights.'
  },
  5: {
    number: 'pA5',
    type: 'ALGOTYPE',
    description: 'Final paradigmatic analysis. Challenges and refines narrative coherence before synthesis.'
  }
}

function FoundationIndicator() {
  const { activeFoundation, isProcessing } = useHM6Store()
  
  const current = activeFoundation || (isProcessing ? null : 1)
  const info = current ? foundationInfo[current] : foundationInfo[1]
  
  return (
    <Container>
      <Title>Active Foundation</Title>
      
      <FoundationCard type={info.type}>
        <FoundationNumber type={info.type}>
          {info.number}
        </FoundationNumber>
        <FoundationType>{info.type}</FoundationType>
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
