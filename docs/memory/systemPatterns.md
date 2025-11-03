# System Patterns

**Last Updated**: 2025-11-03 (PR-003)
**Status**: Foundation built, awaiting LLM integration
**Updated By**: Agent White

## Architecture Decisions

### Implemented Patterns (PR-001, PR-003)

**Component Architecture**:
- Functional components with React hooks (useState, useEffect, useRef)
- CSS Modules for scoped styling (no global CSS conflicts)
- Props-based component communication (parent → child via props, child → parent via callbacks)

**State Management** (PR-003):
- Message array stored in Chat component with useState
- Message structure: `{ id, role, content, timestamp }`
- Simple parent-child prop drilling (sufficient for MVP)
- Loading state managed in Chat component

**Auto-Scroll Pattern**:
- useRef to track messages end element
- useEffect triggers scroll on messages change
- Smooth scrolling for better UX

**Loading Indicator Pattern**:
- Animated dots (CSS keyframes)
- Disabled input during loading
- Visual feedback for async operations

### Planned Patterns

**Socratic Dialogue Flow** (PR-004):
- Parse → Inventory → Identify Goal → Guide Method → Step Through → Validate
- Never reveal direct answers
- Progressive hint system after 2+ stuck turns
- Encouraging language throughout

**Validation Gate Pattern** (PR-004):
- PR-004 acts as critical validation gate
- Must prove Socratic prompting works before building more features
- Iterate on prompts/provider until validation passes

### Decisions Still Needed

**Context Management**: TBD in PR-004/PR-006
**Error Handling Strategy**: TBD in PR-008
**Math Rendering Integration**: TBD in PR-007

---

## Component Patterns

### Message Display (PR-003)

**Component**: `Message.jsx`
- Role-based styling (user vs tutor)
- Timestamp formatting
- Fade-in animation on mount
- Responsive width (max-width: 80%)

**Props**:
```javascript
{
  role: 'user' | 'tutor',
  content: string,
  timestamp: number
}
```

### Input Handling (PR-003)

**Component**: `ChatInput.jsx`
- Controlled input with useState
- Enter to send, Shift+Enter for newlines
- Disabled state during loading
- Auto-clear after send

**Props**:
```javascript
{
  onSendMessage: (message: string) => void,
  disabled: boolean
}
```

### Chat Container (PR-003)

**Component**: `Chat.jsx`
- Manages message array state
- Handles send message logic
- Auto-scrolls to latest message
- Loading state management
- Contains placeholder for future LLM integration

**State**:
```javascript
messages: Array<{id, role, content, timestamp}>
isLoading: boolean
```

---

## Integration Patterns

*To be populated during implementation*

---

## Notes

This file will be updated by implementing agents as architectural patterns emerge and decisions are made. Focus areas:
- How Socratic prompts are structured
- How context is managed across turns
- How image parsing integrates with chat
- How math rendering is triggered
- Error handling strategies
