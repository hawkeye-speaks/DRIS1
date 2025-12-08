import { useState } from 'react'
import styled from 'styled-components'
import { FileText, Plus, Trash2, Download, ChevronRight, ChevronDown } from 'lucide-react'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
`

const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
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

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background: var(--color-background);
    color: var(--color-accent);
  }
`

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`

const Section = styled.div`
  margin-bottom: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  overflow: hidden;
`

const SectionHeader = styled.div`
  padding: 0.75rem 1rem;
  background: var(--color-surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: var(--color-background);
  }
`

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
`

const SectionContent = styled.div`
  padding: 1rem;
  display: ${props => props.$collapsed ? 'none' : 'flex'};
  flex-direction: column;
  gap: 0.5rem;
`

const Block = styled.div`
  padding: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.5rem;

  &:hover {
    border-color: var(--color-accent);
  }
`

const BlockText = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    color: #ef4444;
  }
`

const AddBlockArea = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
`

const AddInput = styled.textarea`
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: var(--color-accent);
  }

  &::placeholder {
    color: var(--color-text-secondary);
  }
`

const AddButton = styled.button`
  background: var(--color-accent);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  width: 100%;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ExportButton = styled.button`
  background: var(--color-accent);
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  justify-content: center;
  width: 100%;
  transition: all 0.2s;

  &:hover {
    background: var(--color-accent-hover);
  }
`

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`

function DocumentBuilder() {
  const [sections, setSections] = useState([
    { id: 1, title: 'Introduction', blocks: [], collapsed: false },
    { id: 2, title: 'Methodology', blocks: [], collapsed: false },
    { id: 3, title: 'Results', blocks: [], collapsed: false },
    { id: 4, title: 'Discussion', blocks: [], collapsed: false },
  ])
  const [unassignedBlocks, setUnassignedBlocks] = useState([])
  const [newBlockText, setNewBlockText] = useState('')
  const [newSectionName, setNewSectionName] = useState('')

  const addBlock = () => {
    if (!newBlockText.trim()) return

    const newBlock = {
      id: Date.now(),
      text: newBlockText,
      timestamp: new Date().toISOString()
    }

    setUnassignedBlocks(prev => [...prev, newBlock])
    setNewBlockText('')
  }

  const deleteBlock = (blockId, fromSection = null) => {
    if (fromSection) {
      setSections(prev => prev.map(sec =>
        sec.id === fromSection
          ? { ...sec, blocks: sec.blocks.filter(b => b.id !== blockId) }
          : sec
      ))
    } else {
      setUnassignedBlocks(prev => prev.filter(b => b.id !== blockId))
    }
  }

  const moveBlockToSection = (blockId, sectionId) => {
    const block = unassignedBlocks.find(b => b.id === blockId)
    if (!block) return

    setSections(prev => prev.map(sec =>
      sec.id === sectionId
        ? { ...sec, blocks: [...sec.blocks, block] }
        : sec
    ))
    setUnassignedBlocks(prev => prev.filter(b => b.id !== blockId))
  }

  const toggleSection = (sectionId) => {
    setSections(prev => prev.map(sec =>
      sec.id === sectionId
        ? { ...sec, collapsed: !sec.collapsed }
        : sec
    ))
  }

  const addSection = () => {
    if (!newSectionName.trim()) return

    const newSection = {
      id: Date.now(),
      title: newSectionName,
      blocks: [],
      collapsed: false
    }

    setSections(prev => [...prev, newSection])
    setNewSectionName('')
  }

  const deleteSection = (sectionId) => {
    if (!confirm('Delete this section?')) return
    setSections(prev => prev.filter(s => s.id !== sectionId))
  }

  const exportDocument = () => {
    let markdown = '# Document Export\n\n'
    
    sections.forEach(section => {
      markdown += `## ${section.title}\n\n`
      section.blocks.forEach(block => {
        markdown += `${block.text}\n\n`
      })
    })

    if (unassignedBlocks.length > 0) {
      markdown += `## Unassigned Content\n\n`
      unassignedBlocks.forEach(block => {
        markdown += `${block.text}\n\n`
      })
    }

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Container>
      <Header>
        <Title>
          <FileText size={16} />
          Document Builder
        </Title>
        <HeaderActions>
          <IconButton onClick={exportDocument} title="Export as Markdown">
            <Download size={16} />
          </IconButton>
        </HeaderActions>
      </Header>

      <Content>
        {/* Unassigned Blocks */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              📋 Staging ({unassignedBlocks.length})
            </SectionTitle>
          </SectionHeader>
          <SectionContent>
            {unassignedBlocks.length === 0 ? (
              <EmptyState>No unassigned content</EmptyState>
            ) : (
              unassignedBlocks.map(block => (
                <Block key={block.id}>
                  <BlockText>{block.text}</BlockText>
                  <DeleteButton onClick={() => deleteBlock(block.id)}>
                    <Trash2 size={14} />
                  </DeleteButton>
                </Block>
              ))
            )}
          </SectionContent>
        </Section>

        {/* Sections */}
        {sections.map(section => (
          <Section key={section.id}>
            <SectionHeader onClick={() => toggleSection(section.id)}>
              <SectionTitle>
                {section.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                {section.title} ({section.blocks.length})
              </SectionTitle>
              <DeleteButton onClick={(e) => { e.stopPropagation(); deleteSection(section.id) }}>
                <Trash2 size={14} />
              </DeleteButton>
            </SectionHeader>
            <SectionContent $collapsed={section.collapsed}>
              {section.blocks.length === 0 ? (
                <EmptyState>No content yet</EmptyState>
              ) : (
                section.blocks.map(block => (
                  <Block key={block.id}>
                    <BlockText>{block.text}</BlockText>
                    <DeleteButton onClick={() => deleteBlock(block.id, section.id)}>
                      <Trash2 size={14} />
                    </DeleteButton>
                  </Block>
                ))
              )}
            </SectionContent>
          </Section>
        ))}
      </Content>

      <AddBlockArea>
        <AddInput
          value={newBlockText}
          onChange={(e) => setNewBlockText(e.target.value)}
          placeholder="Add content block (synthesis output, notes, references...)"
        />
        <AddButton onClick={addBlock} disabled={!newBlockText.trim()}>
          <Plus size={16} />
          Add to Staging
        </AddButton>
      </AddBlockArea>
    </Container>
  )
}

export default DocumentBuilder
