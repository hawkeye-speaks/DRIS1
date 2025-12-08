import { useState } from 'react'
import styled from 'styled-components'
import { ChevronRight, RotateCw, Info } from 'lucide-react'

const Container = styled.div`
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
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

const InfoButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: var(--color-background);
    color: var(--color-accent);
  }
`

const InfoPanel = styled.div`
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
  display: ${props => props.$show ? 'block' : 'none'};
  
  strong {
    color: var(--color-text);
    font-weight: 600;
  }
  
  p {
    margin: 0 0 0.75rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const FoundationDisplay = styled.div`
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-secondary) 100%);
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    animation: ${props => props.$rotating ? 'shimmer 2s infinite' : 'none'};
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`

const FoundationLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 0.25rem;
  position: relative;
  z-index: 1;
`

const FoundationType = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  position: relative;
  z-index: 1;
`

const FoundationName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
  position: relative;
  z-index: 1;
`

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
`

const AdvanceButton = styled.button`
  flex: 1;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const AutoToggle = styled.button`
  background: ${props => props.$active ? 'var(--color-accent)' : 'var(--color-background)'};
  border: 1px solid ${props => props.$active ? 'var(--color-accent)' : 'var(--color-border)'};
  color: ${props => props.$active ? 'white' : 'var(--color-text)'};
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const ModeIndicator = styled.div`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: center;
  padding: 0.5rem;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
`

const foundations = [
  { id: 1, type: 'ALGOTYPE', name: 'Algorithmic Pattern Recognition', description: 'Optimizes for computational efficiency and logical coherence' },
  { id: 2, type: 'PHENOTYPE', name: 'Observable Expression Analysis', description: 'Focuses on measurable outcomes and practical manifestations' },
  { id: 3, type: 'GENOTYPE', name: 'Underlying Structure Mapping', description: 'Reveals fundamental mechanisms and causal relationships' },
  { id: 4, type: 'ALGOTYPE', name: 'Advanced Computational Synthesis', description: 'Higher-order pattern detection and optimization' },
  { id: 5, type: 'PHENOTYPE', name: 'Emergent Behavior Modeling', description: 'Complex system dynamics and adaptive responses' }
]

export default function FoundationSelector({ currentFoundation, onFoundationSelect, autoRotate, onAutoToggle }) {
  const [showInfo, setShowInfo] = useState(false)
  
  const foundation = foundations[currentFoundation - 1] || foundations[0]
  
  const handleAdvance = () => {
    const next = currentFoundation >= 5 ? 1 : currentFoundation + 1
    onFoundationSelect(next)
  }
  
  return (
    <Container>
      <Header>
        <Title>
          Foundation Mode
          <InfoButton onClick={() => setShowInfo(!showInfo)}>
            <Info size={16} />
          </InfoButton>
        </Title>
      </Header>
      
      <InfoPanel $show={showInfo}>
        <p>
          <strong>Foundation Selection</strong> determines how HM6 approaches your query across three epistemic modes:
        </p>
        <p>
          <strong>ALGOTYPE:</strong> Computational pattern recognition - optimizes for logical coherence and algorithmic efficiency
        </p>
        <p>
          <strong>PHENOTYPE:</strong> Observable expression analysis - focuses on measurable outcomes and practical applications
        </p>
        <p>
          <strong>GENOTYPE:</strong> Underlying structure mapping - reveals fundamental mechanisms and causal relationships
        </p>
        <p>
          The system cycles through pA1-pA5 (private coherence gates) on the backend. You see the epistemic mode rotation and can advance it manually or let it auto-cycle.
        </p>
      </InfoPanel>
      
      <FoundationDisplay $rotating={autoRotate}>
        <FoundationLabel>pA{foundation.id}</FoundationLabel>
        <FoundationType>{foundation.type}</FoundationType>
        <FoundationName>{foundation.name}</FoundationName>
      </FoundationDisplay>
      
      <Controls>
        <AdvanceButton onClick={handleAdvance}>
          <ChevronRight size={16} />
          Advance
        </AdvanceButton>
        <AutoToggle 
          $active={autoRotate}
          onClick={onAutoToggle}
          title={autoRotate ? 'Auto-cycle enabled' : 'Auto-cycle disabled'}
        >
          <RotateCw size={16} />
        </AutoToggle>
      </Controls>
      
      <ModeIndicator>
        {autoRotate ? '🔄 Auto-cycling enabled' : '🎯 Manual selection active'}
      </ModeIndicator>
    </Container>
  )
}
