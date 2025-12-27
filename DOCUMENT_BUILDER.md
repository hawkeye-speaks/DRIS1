# Document Builder - User Guide

## Overview

The Document Builder is a left-sidebar panel in DRIS1 that allows you to compile HM6 synthesis outputs and custom content into structured documents for export.

## Features

### 1. **Persistent Storage**
- All document content is automatically saved to browser localStorage
- Content persists across page refreshes and browser sessions
- No server-side storage needed

### 2. **Drag & Drop Organization**
- Drag blocks from "Staging" to any section
- Drag blocks between sections to reorganize
- Visual feedback during drag operations

### 3. **Add Synthesis Results**
- Click "Add to Document" button on any completed HM6 synthesis
- Synthesis is added to Staging area with metadata (foundation, session ID)
- Manually add custom content using the textarea at bottom

### 4. **Section Management**
- Default sections: Introduction, Methodology, Results, Discussion
- Add custom sections with the section input
- Delete sections (moves content back to staging)
- Collapse/expand sections to focus on specific parts

### 5. **Export**
- Export entire document as Markdown (.md file)
- Includes:
  - All section content in order
  - Foundation metadata for each synthesis block
  - Timestamp of export
  - Unassigned content (if any)

### 6. **Clear All**
- Reset document to default state
- Confirmation dialog prevents accidental loss
- Clears all sections and staging area

## Usage Workflow

### Basic Workflow
1. **Run HM6 queries** through the main interface
2. **Add synthesis to document** using the "Add to Document" button
3. **Organize content** by dragging blocks from Staging into sections
4. **Arrange sections** by dragging blocks between sections
5. **Export document** when ready

### Advanced Workflow
1. **Create custom sections** for your specific document structure
2. **Add manual notes** using the textarea (citations, commentary, etc.)
3. **Delete unwanted blocks** using the trash icon
4. **Reorganize dynamically** as your document evolves
5. **Export multiple versions** by organizing differently

## Technical Details

### Event System
- DocumentBuilder listens for `add-to-document` custom events
- Any component can dispatch this event to add content:
  ```javascript
  const event = new CustomEvent('add-to-document', {
    detail: {
      text: 'Content to add',
      metadata: { foundation: 1, sessionId: 'abc123' }
    }
  })
  window.dispatchEvent(event)
  ```

### Data Structure
```javascript
{
  sections: [
    {
      id: number,
      title: string,
      blocks: Block[],
      collapsed: boolean
    }
  ],
  unassignedBlocks: Block[]
}

// Block structure
{
  id: number,
  text: string,
  timestamp: ISO8601,
  metadata: {
    foundation?: number,
    sessionId?: string
  }
}
```

### localStorage Key
- Key: `hm6-document-builder`
- Updated on every change
- Loaded on component mount

## Keyboard Shortcuts

- **Drag**: Click and hold, then drag block to new location
- **Delete**: Click trash icon on any block
- **Collapse/Expand**: Click section header

## Tips

1. **Start with structure**: Define your sections before adding content
2. **Use staging area**: Keep blocks in staging until you know where they belong
3. **Export frequently**: Save snapshots of different document versions
4. **Foundation tracking**: Metadata shows which pA foundation generated each synthesis
5. **Clear strategically**: Clear only when starting a completely new document

## Troubleshooting

**Q: Content disappeared after refresh**
- Check browser localStorage is enabled
- Some browsers clear localStorage in private/incognito mode

**Q: Can't drag blocks**
- Ensure you're clicking and holding before dragging
- Try refreshing the page

**Q: Export not working**
- Check browser allows downloads
- Disable popup blockers for this site

**Q: "Add to Document" button not showing**
- Button only appears after synthesis completes
- Ensure you're on a completed query (not processing)

## Future Enhancements (Potential)

- [ ] Multiple document tabs
- [ ] Cloud storage sync
- [ ] Collaborative editing
- [ ] Version history
- [ ] Rich text formatting
- [ ] Template library
- [ ] Auto-sectioning based on content type
- [ ] AI-assisted organization
