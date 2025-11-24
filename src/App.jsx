import styled from 'styled-components'
import QueryInput from './components/QueryInput'
import ProgressStream from './components/ProgressStream'
import SynthesisDisplay from './components/SynthesisDisplay'
import FoundationIndicator from './components/FoundationIndicator'
import { useHM6Store } from './store/useHM6Store'

const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
`

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

function App() {
  const { isProcessing, synthesis } = useHM6Store()
  
  return (
    <AppContainer>
      <Header>
        <Title>HM6 Multi-Agent Orchestrator</Title>
        <Subtitle>Criss-Cross Cross-Pollination Protocol</Subtitle>
      </Header>
      
      <MainGrid>
        <LeftColumn>
          <QueryInput />
          {isProcessing && <ProgressStream />}
          {synthesis && <SynthesisDisplay />}
        </LeftColumn>
        
        <RightColumn>
          <FoundationIndicator />
        </RightColumn>
      </MainGrid>
    </AppContainer>
  )
}

export default App
