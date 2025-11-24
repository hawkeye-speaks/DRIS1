import styled from 'styled-components'
import { useHM6Store } from '../store/useHM6Store'

const Container = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
`

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-accent);
`

const Content = styled.div`
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 1rem;
  
  h1, h2, h3 {
    color: var(--color-accent);
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.5rem; }
  h3 { font-size: 1.25rem; }
  
  p {
    margin-bottom: 1rem;
  }
  
  ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }
  
  code {
    background: var(--color-bg);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.9em;
  }
  
  pre {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 1rem;
    overflow-x: auto;
    margin-bottom: 1rem;
  }
  
  blockquote {
    border-left: 3px solid var(--color-accent);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--color-text-secondary);
  }
`

const Metadata = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
`

const MetaItem = styled.div`
  background: var(--color-bg);
  padding: 0.75rem;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
`

const MetaLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`

const MetaValue = styled.div`
  color: var(--color-text);
  font-weight: 600;
  font-size: 1.1rem;
`

const DownloadButton = styled.button`
  background: transparent;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background: var(--color-accent);
    color: var(--color-bg);
  }
`

function SynthesisDisplay() {
  const { synthesis, sessionMetadata } = useHM6Store()
  
  const handleDownload = () => {
    const blob = new Blob([synthesis], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hm6-synthesis-${sessionMetadata?.sessionId || Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  if (!synthesis) return null
  
  return (
    <Container>
      <Title>HM6 Synthesis</Title>
      
      <Content dangerouslySetInnerHTML={{ __html: formatMarkdown(synthesis) }} />
      
      {sessionMetadata && (
        <Metadata>
          <MetaItem>
            <MetaLabel>Total Tokens</MetaLabel>
            <MetaValue>{sessionMetadata.totalTokens?.toLocaleString() || 'N/A'}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Processing Time</MetaLabel>
            <MetaValue>
              {sessionMetadata.processingTime 
                ? `${(sessionMetadata.processingTime / 1000).toFixed(1)}s`
                : 'N/A'}
            </MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Outputs</MetaLabel>
            <MetaValue>{sessionMetadata.outputCount || 15}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Foundation</MetaLabel>
            <MetaValue>{sessionMetadata.foundation || 'N/A'}</MetaValue>
          </MetaItem>
        </Metadata>
      )}
      
      <DownloadButton onClick={handleDownload}>
        Download Synthesis (Markdown)
      </DownloadButton>
    </Container>
  )
}

// Simple markdown-to-HTML formatter
function formatMarkdown(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|p])/gim, '<p>')
    .replace(/$/gim, '</p>')
}

export default SynthesisDisplay
