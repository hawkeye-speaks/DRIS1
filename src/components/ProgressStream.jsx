import styled, { keyframes } from 'styled-components'
import { useHM6Store } from '../store/useHM6Store'

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

const Container = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
`

const Title = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--color-text);
`

const StageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const PathLabel = styled.div`
  grid-column: 1 / -1;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: ${props => props.first ? '0' : '1rem'};
  margin-bottom: 0.5rem;
  font-weight: 600;
`

const StageCell = styled.div`
  background: var(--color-bg);
  border: 1px solid ${props => {
    if (props.active) return 'var(--color-accent)'
    if (props.completed) return 'var(--color-success)'
    return 'var(--color-border)'
  }};
  border-radius: var(--radius);
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  transition: all 0.3s;
  animation: ${props => props.active ? pulse : 'none'} 2s infinite;
  
  ${props => props.active && `
    background: var(--color-accent);
    color: var(--color-bg);
    font-weight: 600;
  `}
  
  ${props => props.completed && `
    opacity: 0.7;
  `}
`

const CurrentStageInfo = styled.div`
  background: var(--color-bg);
  border-left: 3px solid var(--color-accent);
  padding: 1rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
`

const InfoLabel = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`

const InfoValue = styled.span`
  color: var(--color-accent);
  font-weight: 600;
  margin-left: 0.5rem;
`

const UpdatesList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-bg);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 3px;
  }
`

const UpdateItem = styled.div`
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

const UpdateMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  margin-top: 0.25rem;
`

function ProgressStream() {
  const { currentStage, currentPath, stageUpdates, wsConnected } = useHM6Store()
  
  const stages = ['pB1', 'pB2', 'pB3', 'pB4', 'pB5']
  const paths = ['Path 1', 'Path 2', 'Path 3']
  
  const isStageCompleted = (path, stage) => {
    return stageUpdates.some(update => 
      update.path === path.replace('Path ', '') && update.stage === stage
    )
  }
  
  const isStageActive = (path, stage) => {
    return currentPath === path.replace('Path ', '') && currentStage === stage
  }
  
  return (
    <Container>
      <Title>
        Processing Status
        {wsConnected && <span style={{ color: 'var(--color-success)', marginLeft: '0.5rem' }}>●</span>}
      </Title>
      
      {currentStage && (
        <CurrentStageInfo>
          <div>
            <InfoLabel>Current:</InfoLabel>
            <InfoValue>Path {currentPath} - {currentStage}</InfoValue>
          </div>
        </CurrentStageInfo>
      )}
      
      <StageGrid>
        {paths.map((path, pathIdx) => (
          <>
            <PathLabel key={`label-${path}`} first={pathIdx === 0}>
              {path}
            </PathLabel>
            {stages.map(stage => (
              <StageCell
                key={`${path}-${stage}`}
                active={isStageActive(path, stage)}
                completed={isStageCompleted(path, stage)}
              >
                {stage}
              </StageCell>
            ))}
          </>
        ))}
      </StageGrid>
      
      {stageUpdates.length > 0 && (
        <>
          <Title style={{ fontSize: '1rem', marginTop: '1rem' }}>Recent Updates</Title>
          <UpdatesList>
            {stageUpdates.slice().reverse().map((update, idx) => (
              <UpdateItem key={idx}>
                <div>
                  Path {update.path} - {update.stage} completed
                </div>
                <UpdateMeta>
                  <span>{update.tokens} tokens</span>
                  <span>{(update.latency / 1000).toFixed(2)}s</span>
                </UpdateMeta>
              </UpdateItem>
            ))}
          </UpdatesList>
        </>
      )}
    </Container>
  )
}

export default ProgressStream
