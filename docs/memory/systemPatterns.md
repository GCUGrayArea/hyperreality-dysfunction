# System Patterns

**Last Updated**: 2025-11-03 (PR-004)
**Status**: LLM integrated, Socratic dialogue implemented
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

## PR-002 Patterns: Image Upload and Parsing

### Image Upload Flow
1. User drags/drops or clicks to upload image
2. Client-side validation (file type, size)
3. Convert to base64 using FileReader
4. Send to OpenAI GPT-4 Vision API
5. Extract math problem text from image
6. Display parsed text to user for confirmation
7. Add parsed problem to chat conversation

### Component Integration Pattern
- **ImageUpload** component handles upload + parsing independently
- Exposes `onParsedText` callback for integration
- **Chat** component conditionally shows ImageUpload initially
- Hides upload UI after first problem submitted
- Parsed text flows into existing message state

### Error Handling Pattern
- Validate early (file type/size before API call)
- Try/catch around API calls
- User-friendly error messages displayed inline
- Graceful degradation (upload UI resets on error)

### File Organization
- `src/services/openai.js` - API integration, reusable functions
- `src/components/ImageUpload.jsx` - Upload UI + parsing logic
- `src/styles/ImageUpload.module.css` - Scoped styles
- CSS Modules pattern maintained throughout


## PR-004 Patterns: LLM Integration & Socratic Dialogue

**Critical Validation Gate**: This PR validates that Socratic prompting works before proceeding.

### Socratic System Prompt Architecture

**Structure**: Multi-part system prompt with:
1. Identity & Goal (patient math tutor)
2. Critical Rules (5 prohibitions: NEVER give answers)
3. Socratic Method Flow (6-step process)
4. Stuck Student Protocol (progressive hints)
5. Language Style (encouraging, supportive)

**Key Design Decisions**:
- Explicit, repeated prohibitions prevent answer-giving
- Structured 6-step flow ensures consistency
- Progressive hints as questions (not statements)
- Temperature 0.7 balances consistency with variety

### Message Flow Pattern

```
User Input → Chat Component
  ↓
Add to messages array (role: 'user')
  ↓
Convert messages to OpenAI format
  ↓
  messages.map(msg => ({
    role: msg.role === 'tutor' ? 'assistant' : 'user',
    content: msg.content
  }))
  ↓
Prepend system prompt
  ↓
OpenAI API call (getSocraticResponse)
  ↓
Receive response
  ↓
Add to messages (role: 'tutor')
  ↓
UI update (auto-scroll)
```

### Context Management Pattern

**Approach**: Full conversation history
- All messages (except initial greeting) passed to API
- Format conversion: 'tutor' → 'assistant', 'user' → 'user'
- System prompt prepended to every request
- No truncation (relying on model's context window)

**Trade-offs**:
- ✅ Simple implementation
- ✅ Full context maintained
- ❌ API costs scale with conversation length
- ❌ May hit context limits on very long conversations

**Future Consideration**: Implement smart truncation in PR-006 if needed

### Error Handling Pattern

**Two-level error handling**:
1. **Service level** (`openai.js`): Try-catch around API call, return `{success, content, error}`
2. **Component level** (`Chat.jsx`): Try-catch around service call, display error messages

**Error Messages**:
- API errors: Show specific error with guidance to check API key
- Network errors: Generic "try again" message
- All errors logged to console for debugging

### Async Pattern

**Functions**: `handleSendMessage` and `handleParsedText` are now async
**Loading State**: `isLoading` prevents multiple simultaneous requests
**User Feedback**: Loading indicator (animated dots) during API call

### Integration Points

**With PR-002 (Image Upload)**:
- Both `handleSendMessage` and `handleParsedText` use same LLM call
- Parsed text becomes first user message
- Conversation flows identically regardless of input method

**For PR-007 (Math Rendering)**:
- Responses already include LaTeX notation ($...$ and $$...$$)
- Rendering layer will be added without changing LLM integration

**For PR-006 (Enhanced Context)**:
- Current pattern supports full history
- Can be enhanced with smart truncation or summarization

### Socratic Method Implementation

**Parse & Confirm**: LLM asks student to confirm problem understanding
**Inventory Knowns**: "What information do we have?"
**Identify Goal**: "What are we trying to find?"
**Guide Method**: "What operation might help?"
**Step Through**: "What should we do first?"
**Validate**: "Does that make sense?"

**Enforcement**: System prompt with examples prevents direct answers

### Testing & Validation

**Test Protocol**: See `docs/TESTING-PR-004.md`
**Validation Criteria**:
- Never gives direct answers
- Minimum 3 guiding questions
- Maintains context across turns
- Uses encouraging language
- Progressive hints when stuck

**Status**: Implementation complete, awaiting user validation

---

## Notes for Future PRs

### PR-005 (Response Evaluation)
- Can build on existing message history
- May want to track "stuck count" for hint progression
- System prompt already handles basic evaluation

### PR-006 (Context Management)
- Current pattern: full history to API
- Consider: smart truncation for very long conversations
- Consider: conversation summarization for context compression

### PR-007 (Math Rendering)
- LaTeX already in responses from LLM
- Need to parse and render $...$ and $$...$$ blocks
- Won't require changes to LLM integration

### PR-008 (Error Handling)
- Basic error handling already in place
- Can enhance with more specific error types
- Can add retry logic for transient failures
