import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FileText, Plus, Trash2, Download, ChevronRight, ChevronDown, FolderPlus } from 'lucide-react'

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
  min-height: ${props => props.$collapsed ? '0' : '60px'};
  transition: all 0.2s;
  
  &.drag-over {
    background: var(--color-accent-light);
    border: 2px dashed var(--color-accent);
  }
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
  cursor: move;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-accent);
    background: var(--color-background);
  }
  
  &.dragging {
    opacity: 0.5;
  }
  
  &.drag-over {
    border-color: var(--color-accent);
    background: var(--color-accent);
    color: white;
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
  console.log('DocumentBuilder: Component mounting')
  
  const STORAGE_KEY = 'hm6-document-builder'
  
  // Load from localStorage on mount
  const loadSavedData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        return data
      }
    } catch (error) {
      console.error('Failed to load document builder data:', error)
    }
    return null
  }
  
  const initialData = loadSavedData() || {
    sections: [
      { id: 1, title: 'Introduction', blocks: [], collapsed: false },
      { id: 2, title: 'Methodology', blocks: [], collapsed: false },
      { id: 3, title: 'Results', blocks: [], collapsed: false },
      { id: 4, title: 'Discussion', blocks: [], collapsed: false },
    ],
    unassignedBlocks: []
  }
  
  const [sections, setSections] = useState(initialData.sections)
  const [unassignedBlocks, setUnassignedBlocks] = useState(initialData.unassignedBlocks)
  const [newBlockText, setNewBlockText] = useState('')
  const [newSectionName, setNewSectionName] = useState('')
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      const dataToSave = {
        sections,
        unassignedBlocks
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Failed to save document builder data:', error)
    }
  }, [sections, unassignedBlocks])
  
  // Listen for custom event to add synthesis results
  useEffect(() => {
    const handleAddToDocument = (event) => {
      console.log('DocumentBuilder: Received add-to-document event', event.detail)
      
      const { text, metadata } = event.detail
      
      const newBlock = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toISOString(),
        metadata: metadata || {}
      }
      
      setUnassignedBlocks(prev => [newBlock, ...prev])
    }
    
    window.addEventListener('add-to-document', handleAddToDocument)
    return () => window.removeEventListener('add-to-document', handleAddToDocument)
  }, [])

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
    let markdown = '# HM6 Document Export\n\n'
    markdown += `*Generated: ${new Date().toLocaleString()}*\n\n`
    
    sections.forEach(section => {
      if (section.blocks.length > 0) {
        markdown += `## ${section.title}\n\n`
        section.blocks.forEach(block => {
          markdown += `${block.text}\n\n`
          if (block.metadata?.foundation) {
            markdown += `*Foundation: pA${block.metadata.foundation}*\n\n`
          }
        })
      }
    })

    if (unassignedBlocks.length > 0) {
      markdown += `## Unassigned Content\n\n`
      unassignedBlocks.forEach(block => {
        markdown += `${block.text}\n\n`
        if (block.metadata?.foundation) {
          markdown += `*Foundation: pA${block.metadata.foundation}*\n\n`
        }
      })
    }

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hm6-document-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }
  
  const clearAll = () => {
    if (!confirm('Clear all document content? This cannot be undone.')) return
    setSections([
      { id: Date.now(), title: 'Introduction', blocks: [], collapsed: false },
      { id: Date.now() + 1, title: 'Methodology', blocks: [], collapsed: false },
      { id: Date.now() + 2, title: 'Results', blocks: [], collapsed: false },
      { id: Date.now() + 3, title: 'Discussion', blocks: [], collapsed: false },
    ])
    setUnassignedBlocks([])
  }
  
  // Drag and drop handlers
  const handleDragStart = (e, blockId, fromSection = null) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('blockId', blockId.toString())
    e.dataTransfer.setData('fromSection', fromSection ? fromSection.toString() : '')
    e.target.classList.add('dragging')
  }
  
  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = (e, targetSectionId) => {
    e.preventDefault()
    const blockId = parseInt(e.dataTransfer.getData('blockId'))
    const fromSection = e.dataTransfer.getData('fromSection')
    
    if (!fromSection) {
      // From unassigned to section
      moveBlockToSection(blockId, targetSectionId)
    } else {
      // From section to section
      const fromSectionId = parseInt(fromSection)
      if (fromSectionId !== targetSectionId) {
        const sourceSection = sections.find(s => s.id === fromSectionId)
        const block = sourceSection?.blocks.find(b => b.id === blockId)
        
        if (block) {
          // Remove from source
          setSections(prev => prev.map(sec =>
            sec.id === fromSectionId
              ? { ...sec, blocks: sec.blocks.filter(b => b.id !== blockId) }
              : sec
          ))
          
          // Add to target
          setSections(prev => prev.map(sec =>
            sec.id === targetSectionId
              ? { ...sec, blocks: [...sec.blocks, block] }
              : sec
          ))
        }
      }
    }
  }

  return (
    <Container>
      <Header>
        <Title>
          <FileText size={16} />
          Document Builder
        </Title>
        <HeaderActions>
          <IconButton onClick={clearAll} title="Clear All">
            <Trash2 size={16} />
          </IconButton>
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
              <EmptyState>
                No unassigned content<br/>
                <small style={{marginTop: '0.5rem', display: 'block'}}>
                  Add synthesis results using the button below or from completed queries
                </small>
              </EmptyState>
            ) : (
              unassignedBlocks.map(block => (
                <Block 
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.id)}
                  onDragEnd={handleDragEnd}
                >
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
            <SectionContent 
              $collapsed={section.collapsed}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, section.id)}
            >
              {section.blocks.length === 0 ? (
                <EmptyState>
                  Drag content here or it will remain empty
                </EmptyState>
              ) : (
                section.blocks.map(block => (
                  <Block 
                    key={block.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, block.id, section.id)}
                    onDragEnd={handleDragEnd}
                  >
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
