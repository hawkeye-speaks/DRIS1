import styled from 'styled-components'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import QueryInput from './components/QueryInput'
import ProgressStream from './components/ProgressStream'
import SynthesisDisplay from './components/SynthesisDisplay'
import FoundationIndicator from './components/FoundationIndicator'
import CreditDisplay from './components/CreditDisplay'
import { useHM6Store } from './store/useHM6Store'

const AppContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
`

const UserNav = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const SignInBtn = styled.button`
  padding: 0.5rem 1.5rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: scale(1.05);
  }
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

const WelcomeCard = styled.div`
  background: rgba(138, 180, 248, 0.05);
  border: 2px solid var(--color-accent);
  border-radius: 12px;
  padding: 3rem;
  max-width: 600px;
  margin: 2rem auto;
  text-align: center;
`

const WelcomeTitle = styled.h2`
  color: var(--color-accent);
  font-size: 2rem;
  margin-bottom: 1rem;
`

const WelcomeText = styled.p`
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
`

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`

const Feature = styled.div`
  color: var(--color-text);
  font-size: 1rem;
  text-align: left;
  padding: 0.5rem;
`

const GetStartedBtn = styled.button`
  padding: 1rem 2rem;
  background: var(--color-accent);
  color: var(--color-bg);
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(138, 180, 248, 0.3);
  }
`

function App() {
  const { isProcessing, synthesis } = useHM6Store()
  
  return (
    <AppContainer>
      <Header>
        <UserNav>
          <SignedIn>
            <CreditDisplay />
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <SignInBtn>Sign In</SignInBtn>
            </SignInButton>
          </SignedOut>
        </UserNav>
        
        <Title>DRIS1</Title>
        <Subtitle>Distributed Relational Intelligence System</Subtitle>
      </Header>
      
      <SignedOut>
        <WelcomeCard>
          <WelcomeTitle>Welcome to DRIS1</WelcomeTitle>
          <WelcomeText>
            Sign in to access the HM6 Multi-Agent Orchestrator - the world's most advanced 
            distributed AI reasoning system.
          </WelcomeText>
          <FeatureList>
            <Feature>🧠 15 AI agents working in parallel</Feature>
            <Feature>🔄 Criss-cross cross-pollination protocol</Feature>
            <Feature>⚡ Phase-locked cognitive synthesis</Feature>
            <Feature>🎯 Maximum coherence output</Feature>
          </FeatureList>
          <SignInButton mode="modal">
            <GetStartedBtn>Get Started - 10 Free Credits</GetStartedBtn>
          </SignInButton>
        </WelcomeCard>
      </SignedOut>
      
      <SignedIn>
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
      </SignedIn>
    </AppContainer>
  )
}

export default App
