import { useState } from 'react'
import styled from 'styled-components'
import QueryInput from './components/QueryInput'
import ProgressStream from './components/ProgressStream'
import SynthesisDisplay from './components/SynthesisDisplay'
import FoundationSelector from './components/FoundationSelector'
import CoherenceDashboard from './components/CoherenceDashboard'
import ThreadingAssistant from './components/ThreadingAssistant'
import FreshPortal from './components/FreshPortal'
import DocumentBuilder from './components/DocumentBuilder'
import { useHM6Store } from './store/useHM6Store'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Simplified test mode - no auth required

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const TopBar = styled.div`
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
`

const TopBarGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  height: 240px;
`

const DRISSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
`

const Sidebar = styled.div`
  width: ${props => props.$collapsed ? '0' : '350px'};
  transition: width 0.3s ease;
  overflow: hidden;
  border-right: ${props => props.$collapsed ? 'none' : '1px solid var(--color-border)'};
  background: var(--color-surface);
`

const SidebarToggle = styled.button`
  position: fixed;
  left: ${props => props.$collapsed ? '0' : '350px'};
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-accent);
  border: none;
  color: white;
  padding: 1rem 0.5rem;
  border-radius: ${props => props.$collapsed ? '0 8px 8px 0' : '8px 0 0 8px'};
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;

  &:hover {
    background: var(--color-accent-hover);
    padding-left: ${props => props.$collapsed ? '0.75rem' : '0.5rem'};
    padding-right: ${props => props.$collapsed ? '0.5rem' : '0.75rem'};
  }
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 3px solid #0f3460;
`

const TestBadge = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #1a1a1a;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 1rem;
  vertical-align: middle;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  display: inline-block;
`

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0.5rem 0 0;
`

const MainGrid = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
  const { 
    isProcessing, 
    synthesis, 
    coherenceMetrics,
    selectedFoundation, 
    autoRotateFoundation,
    setFoundation,
    toggleAutoRotate
  } = useHM6Store()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [portalQuery, setPortalQuery] = useState('')
  
  return (
    <AppContainer>
      <Sidebar $collapsed={sidebarCollapsed}>
        <DocumentBuilder />
      </Sidebar>

      <SidebarToggle 
        $collapsed={sidebarCollapsed}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        {sidebarCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </SidebarToggle>

      <MainContent>
        <Header>
          <Title>DRIS1</Title>
          <TestBadge>🧪 Test Environment</TestBadge>
          <Subtitle>Distributed Relational Intelligence System + Dual Companions</Subtitle>
        </Header>

        {/* Dual Companion Top Bar */}
        <TopBar>
          <TopBarGrid>
            <ThreadingAssistant onSendToPortal={setPortalQuery} />
            <FreshPortal initialQuery={portalQuery} />
          </TopBarGrid>
        </TopBar>

        {/* Main DRIS1 Content */}
        <MainGrid>
          <LeftColumn>
            <QueryInput />
            {isProcessing && <ProgressStream />}
            {synthesis && <SynthesisDisplay />}
          </LeftColumn>
          
          <RightColumn>
            <FoundationSelector 
              currentFoundation={selectedFoundation}
              onFoundationSelect={setFoundation}
              autoRotate={autoRotateFoundation}
              onAutoToggle={toggleAutoRotate}
            />
            <CoherenceDashboard sessionMetrics={coherenceMetrics} />
          </RightColumn>
        </MainGrid>
      </MainContent>
    </AppContainer>
  )
}

export default App
