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

## PR-008 Patterns: UI Polish and Error Handling

**Comprehensive Error Handling System** (2025-11-03):

### Error Detection and Classification
**Implementation**: `Chat.jsx` - `getErrorDetails()` function
- Analyzes error messages to determine type (API key, rate limit, network, timeout, unknown)
- Returns structured error object: `{title, message, recoverable}`
- Provides actionable guidance for each error type

**Error Types Handled**:
1. **API Key Errors** (401/unauthorized): Non-recoverable, directs to .env setup
2. **Rate Limit** (429): Recoverable, suggests waiting
3. **Network Errors**: Recoverable, suggests connection check
4. **Timeout Errors**: Recoverable, suggests retry
5. **Unknown Errors**: Recoverable with generic guidance

### Retry Mechanism Pattern
**State Management**:
- `lastError`: Stores current error details for display
- `retryPayload`: Stores {type, data} to replay failed request
- `handleRetry()`: Executes retry based on payload type

**Retry Flow**:
1. Error occurs → Store error + payload
2. Display error UI with "Try Again" button
3. User clicks → handleRetry() replays original request
4. Clear error state on new request

### Accessibility (ARIA) Patterns

**Semantic HTML**:
- `<article>` for messages (was `<div>`)
- `<header>` for chat header (was `<div>`)
- `<time>` for timestamps (was `<span>`)
- `role="main"` on chat container
- `role="log"` + `aria-live="polite"` on messages container

**ARIA Labels**:
- All interactive elements have `aria-label`
- Form inputs have `aria-describedby` for hints
- Loading states have descriptive labels
- Error alerts use `role="alert"`

**Screen Reader Support**:
- `.sr-only` utility class for visually hidden hints
- Math equations labeled with raw LaTeX for screen readers
- Message sender and time announced properly

### Responsive Design Patterns

**Breakpoints**:
- Desktop: >768px (default styles)
- Tablet: ≤768px (adjusted padding, font sizes)
- Mobile: ≤640px (further optimization)

**Mobile-Specific**:
- Increased touch targets (padding adjustments)
- Scrollable math equations with momentum scrolling
- No box shadow on mobile (cleaner edge-to-edge)
- Smaller font sizes optimized for small screens

**Print Styles**:
- Hide header, input, and upload sections
- Show only conversation history
- Remove shadows and backgrounds

### Loading State Enhancements
**Accessibility**: `aria-label="Tutor is thinking"` on loading indicator
**Visual**: Existing animated dots pattern maintained
**State Management**: Unified loading state prevents concurrent requests

### Error UI Pattern
**Visual Design**:
- Red-themed error box (`#ffebee` background)
- Left border accent (`#f44336`)
- Title + detailed message + optional retry button
- Retry button styled with error color scheme

**Placement**: Appears above loading indicator, below messages
**Dismissal**: Auto-clears on new request

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

### PR-008 (Error Handling)
- Basic error handling already in place
- Can enhance with more specific error types
- Can add retry logic for transient failures

---

## PR-007 Patterns: Math Rendering Integration

**Library Choice**: KaTeX (v0.16+)
- **Rationale**: Faster than MathJax (~300KB vs ~1MB), no runtime typesetting, better for interactive apps
- **Installation**: `npm install katex`
- **CSS Import**: `import 'katex/dist/katex.min.css'` in Message component

### LaTeX Parsing Pattern

**Implementation**: `src/utils/latexRenderer.js`

**Supported Syntax**:
- Inline math: `$...$` (e.g., `$x^2 + 3x + 2$`)
- Block math: `$$...$$` (e.g., `$$\frac{a}{b}$$`)

**Parse Algorithm**:
1. Search for block math (`$$...$$`) and inline math (`$...$`) markers
2. Determine which comes first in remaining text
3. Split text into parts: `{type: 'text'|'math', content: string, display: boolean}`
4. Repeat until all text is processed

**Rendering Function**:
```javascript
renderLatex(latex, displayMode) {
  return katex.renderToString(latex, {
    displayMode,      // true for block, false for inline
    throwOnError: false,  // Show errors in output instead of throwing
    errorColor: '#cc0000',
    strict: false,    // Allow some non-standard LaTeX
    trust: false,     // Security: disable \href, \url
  });
}
```

### Message Component Integration

**Pattern**: Parse → Render → Display
1. Parse content into text/math parts using `parseLatex(content)`
2. Map over parts array
3. Render text parts as `<span>` with `whiteSpace: 'pre-wrap'`
4. Render math parts using `dangerouslySetInnerHTML` with KaTeX HTML output

**Why dangerouslySetInnerHTML?**
- KaTeX outputs sanitized HTML (safe from XSS)
- React needs to render KaTeX's HTML structure
- Alternative (mounting to DOM node) would be more complex

**CSS Classes**:
- `.mathInline` - inline equations with small horizontal margins
- `.mathBlock` - block equations, centered, with vertical margins, horizontal scroll for overflow
- `:global(.latex-error)` - error display for malformed LaTeX (red text, pink background, monospace)

### Error Handling Pattern

**Approach**: Graceful degradation
- `throwOnError: false` in KaTeX config shows error in rendered output
- Try-catch in renderLatex falls back to raw LaTeX with error styling
- Console error logged for debugging
- User sees red-highlighted LaTeX if rendering fails (not a broken UI)

**Error Display**:
```html
<span class="latex-error" title="LaTeX rendering failed">x^{2</span>
```

### Integration with PR-004 (Socratic Dialogue)

**No changes needed to LLM integration**:
- GPT-4 already outputs LaTeX in responses
- Rendering happens purely client-side in Message component
- LLM dialogue flow unchanged

**Testing Recommendation**:
Ask tutor about equation like "2x + 5 = 13" and verify:
- Equations render visually (not as `$...$` text)
- Inline math appears within text flow
- Block math appears centered on its own line
- Complex notation (fractions, exponents) renders correctly

### Performance Considerations

**KaTeX rendering is synchronous and fast**:
- Typical equation renders in <5ms
- No noticeable lag in message display
- No need for loading states or async rendering

**Bundle size**:
- KaTeX core: ~300KB minified
- Fonts: ~100KB
- Total impact: ~400KB added to bundle

### Future Enhancements (Out of Scope for PR-007)

**Not implemented** (can add in future PRs if needed):
- LaTeX syntax highlighting in input field
- LaTeX equation editor UI
- Copy-rendered-equation functionality
- Support for `\(...\)` and `\[...\]` delimiters (only `$` supported now)
- Math rendering in image parsing (currently only in chat messages)
