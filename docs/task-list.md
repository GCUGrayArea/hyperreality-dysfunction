# Task List: AI Math Tutor

**Project**: Hyperreality Dysfunction
**Generated**: 2025-11-03
**Timeline**: 5 days core + 2 days optional stretch

## PR Status Overview

Total PRs: 14 (11 core + 3 optional)
- Not Started: 12
- In Progress: 0
- Complete: 2
- Blocked: 0

## Critical Path

The following PRs are on the critical path and block other work:
1. PR-001 (blocks all other work)
2. PR-004 (CRITICAL VALIDATION - blocks PR-005, PR-006, PR-007)
3. PR-007 (blocks PR-008, PR-010)

**⚠️ BLOCKER ALERT**: PR-004 must validate that Socratic prompting works before building more features. If validation fails, must iterate on prompts/provider before proceeding with other PRs.

---

## Day 1: Foundation (PRs 001-003)

### PR-001: Project Setup and Structure
**Status**: Complete
**Priority**: P0 (Critical Path)
**Estimated**: 1-2 hours
**Assigned**: Agent White
**Completed**: 2025-11-03
**Blocks**: All other PRs

**Description**:
Initial project setup including framework selection, dependency management, and basic architecture.

**Scope**:
- Choose and initialize frontend framework
- Set up project structure (components, utils, styles, etc.)
- Configure build tooling
- Set up environment variables (.env.example)
- Create basic .gitignore
- Initialize package.json with initial dependencies

**Technical Decisions Made**:
- [x] Frontend framework selection - **React + Vite**
- [x] Build tool configuration - **Vite 6.0.5 with default config**
- [x] Project directory structure - **src/{components,services,utils,styles}**
- [x] Development server setup - **Vite dev server on port 5173**
- [x] LLM Provider - **OpenAI GPT-4 (with Vision for images)**
- [x] Styling approach - **CSS Modules**

**Deliverables**:
- [x] Working dev server
- [x] Basic project structure in place
- [x] Dependencies installed
- [x] README with setup instructions
- [x] .env.example with API key template
- [x] .gitignore updated with .env files
- [x] techContext.md documented with all decisions

**Files**:
- `package.json` (or equivalent)
- `.gitignore`
- `.env.example`
- `README.md` (basic)
- Framework config files
- Basic folder structure

---

### PR-002: Image Upload and Parsing Integration
**Status**: Not Started
**Priority**: P0 (Critical Path)
**Estimated**: 2-3 hours
**Assigned**: Unassigned
**Dependencies**: PR-001
**Blocks**: PR-003

**Description**:
Implement image upload capability and integrate vision/OCR parsing to extract math problems from uploaded images.

**Scope**:
- Build image upload UI component (drag-drop or click-to-upload)
- Integrate vision LLM or OCR service
- Extract text from uploaded images
- Display parsed text to user for confirmation
- Handle common image formats (PNG, JPG, WEBP)
- Error handling for upload/parsing failures

**Technical Decisions Required**:
- [ ] Vision/OCR provider selection (OpenAI Vision, Google Cloud Vision, Tesseract, etc.)
- [ ] File upload implementation approach
- [ ] Image preprocessing (if needed)
- [ ] API integration strategy

**Testing**:
- [ ] Test with printed math problems
- [ ] Test with various image formats
- [ ] Test error cases (invalid file, parsing failure)

**Deliverables**:
- [ ] Working image upload UI
- [ ] Successful text extraction from printed math problems
- [ ] Error handling for upload failures
- [ ] Parsed text display component

**Files**:
- Image upload component
- Vision/OCR integration module
- API route/service for image processing
- Error handling utilities

**Notes**:
- Start with printed text (easier than handwritten)
- >90% accuracy target for printed problems

---

### PR-003: Basic Chat UI
**Status**: Complete
**Priority**: P0 (Critical Path)
**Estimated**: 2-3 hours
**Assigned**: Agent White
**Completed**: 2025-11-03
**Dependencies**: PR-001, PR-002
**Blocks**: PR-004
**Note**: Built without PR-002 integration (image upload placeholder for later)

**Description**:
Build chat interface with message display, input field, and integration with image upload component.

**Scope**:
- Message display component (user vs. tutor distinction)
- Text input field with send button
- Scrollable conversation history
- Loading states during processing
- Basic styling (NO Tailwind per user prefs)
- Integration with image upload from PR-002

**Technical Decisions Made**:
- [x] Styling approach - **CSS Modules** (consistent with PR-001 decision)
- [x] State management - **React useState** (simple array of message objects)
- [x] Scroll behavior - **Auto-scroll with useRef + useEffect**

**Deliverables**:
- [x] Chat message display component (Message.jsx)
- [x] Text input component (ChatInput.jsx)
- [x] Message list with auto-scroll
- [x] Loading indicator (animated dots)
- [x] Clear visual distinction (blue for user, gray for tutor)
- [x] Responsive design (desktop/tablet support)

**Files**:
- Chat container component
- Message component
- Input component
- Basic styling files
- Message state management

**Notes**:
- Keep styling simple for MVP
- Focus on functionality over visual polish (polish in PR-008)

---

## Day 2-3: Core Dialogue (PRs 004-006)

### PR-004: LLM Integration with Socratic Prompts ⚠️ CRITICAL VALIDATION
**Status**: Not Started
**Priority**: P0 (Critical Path - BLOCKER)
**Estimated**: 3-4 hours
**Assigned**: Unassigned
**Dependencies**: PR-003
**Blocks**: PR-005, PR-006, PR-007

**Description**:
Integrate LLM with Socratic system prompts and validate that it guides without giving direct answers. THIS IS A VALIDATION GATE - if Socratic prompting doesn't work, must iterate before proceeding.

**Scope**:
- Choose LLM provider
- Implement API integration
- Design Socratic system prompt
- Test with hardcoded problem: "2x + 5 = 13"
- Validate multi-turn conversation flow
- Test that system asks guiding questions, not direct answers

**⚠️ VALIDATION GATE**:
Before marking this PR complete, system MUST:
- Guide through solution without giving direct answer
- Ask minimum 3 guiding questions
- Maintain context across turns
- Use encouraging language

If validation fails:
1. Iterate on system prompt
2. Try different LLM provider if needed
3. DO NOT proceed to other PRs until this works

**Technical Decisions Required**:
- [ ] LLM provider selection (OpenAI, Anthropic, etc.)
- [ ] API integration approach
- [ ] System prompt design
- [ ] Context management strategy
- [ ] Prompt engineering techniques

**Testing**:
- [ ] Test with hardcoded algebra problem
- [ ] Verify no direct answers given
- [ ] Verify guiding questions asked
- [ ] Test context maintained across 5+ turns
- [ ] Test hint progression when user stuck

**Deliverables**:
- [ ] Working LLM integration
- [ ] Validated Socratic system prompt
- [ ] Successful test conversation on hardcoded problem
- [ ] Context management working
- [ ] Documentation of prompt engineering approach (for PROMPTS.md)

**Files**:
- LLM API integration module
- System prompt definition
- Context management utilities
- API route/service for chat
- Test conversation logs

**Notes**:
- MOST CRITICAL PR - everything depends on this working
- Budget extra time for prompt iteration
- Document what works and what doesn't for PROMPTS.md

---

### PR-005: Response Evaluation and Hint System
**Status**: Not Started
**Priority**: P0
**Estimated**: 2-3 hours
**Assigned**: Unassigned
**Dependencies**: PR-004
**Blocks**: PR-009

**Description**:
Implement logic to evaluate student responses and provide progressively concrete hints when student is stuck for >2 turns.

**Scope**:
- Track student response quality (correct, partial, incorrect, off-track)
- Detect when student is stuck (>2 unsuccessful attempts)
- Implement hint progression system (vague → concrete)
- Ensure hints don't reveal full answer
- Integrate with Socratic conversation flow

**Technical Decisions Required**:
- [ ] Response evaluation approach (LLM-based, rule-based, hybrid)
- [ ] Stuck detection logic
- [ ] Hint progression strategy
- [ ] State tracking for hints

**Testing**:
- [ ] Test correct answer recognition
- [ ] Test hint progression (give intentionally wrong answers)
- [ ] Verify hints become more concrete after 2+ stuck turns
- [ ] Verify hints don't reveal answer

**Deliverables**:
- [ ] Response evaluation logic
- [ ] Hint progression system
- [ ] Stuck detection working
- [ ] Testing on multiple problem types

**Files**:
- Response evaluation module
- Hint generation logic
- State tracking utilities
- Test cases

---

### PR-006: Context Management Across Turns
**Status**: Not Started
**Priority**: P0
**Estimated**: 2-3 hours
**Assigned**: Unassigned
**Dependencies**: PR-004
**Blocks**: PR-009

**Description**:
Ensure conversation context is properly maintained across multiple turns, including problem state, student progress, and conversation history.

**Scope**:
- Maintain full conversation history
- Track problem-specific state (what's been covered, what's remaining)
- Ensure LLM receives relevant context in each turn
- Optimize context window usage
- Handle context truncation if conversation gets long

**Technical Decisions Required**:
- [ ] Context storage approach (session, local storage, database)
- [ ] Context truncation strategy
- [ ] State structure design
- [ ] Context passing to LLM

**Testing**:
- [ ] Test conversations >10 turns maintain context
- [ ] Test problem state tracking
- [ ] Test context doesn't get lost or confused
- [ ] Test with multiple problem types

**Deliverables**:
- [ ] Context management system
- [ ] Conversation history tracking
- [ ] Problem state tracking
- [ ] Context optimization for LLM calls

**Files**:
- Context management module
- Session/state management
- History tracking utilities

---

## Day 4: Polish (PRs 007-009)

### PR-007: Math Rendering Integration
**Status**: Not Started
**Priority**: P0 (Critical Path)
**Estimated**: 2-3 hours
**Assigned**: Unassigned
**Dependencies**: PR-004
**Blocks**: PR-008, PR-010

**Description**:
Integrate math rendering library to properly display equations in chat messages.

**Scope**:
- Choose and integrate math rendering library
- Support inline equations (within text)
- Support block equations (standalone)
- Handle LaTeX notation
- Render in both user and tutor messages
- Handle rendering errors gracefully

**Technical Decisions Required**:
- [ ] Math rendering library selection (KaTeX, MathJax, MathML)
- [ ] LaTeX parsing approach
- [ ] Rendering optimization

**Testing**:
- [ ] Test fractions, exponents, symbols
- [ ] Test inline and block modes
- [ ] Test complex equations
- [ ] Test error cases (malformed LaTeX)

**Deliverables**:
- [ ] Working math rendering
- [ ] Support for common math notation
- [ ] Rendering in chat messages
- [ ] Error handling for invalid LaTeX

**Files**:
- Math rendering component/utility
- LaTeX parser (if separate)
- Updated message components
- Rendering styles

---

### PR-008: UI Polish and Error Handling
**Status**: Not Started
**Priority**: P0
**Estimated**: 2-3 hours
**Assigned**: Unassigned
**Dependencies**: PR-007
**Blocks**: PR-010

**Description**:
Polish user interface, add comprehensive error handling, and improve overall UX.

**Scope**:
- Improve chat UI styling and layout
- Add comprehensive error handling (upload fails, API errors, parsing errors)
- Improve loading states
- Add user feedback for all actions
- Ensure responsive design (desktop/tablet)
- Accessibility improvements

**Technical Decisions Required**:
- [ ] Final styling decisions
- [ ] Error message strategy
- [ ] Responsive breakpoints

**Testing**:
- [ ] Test on different screen sizes
- [ ] Test all error scenarios
- [ ] Test loading states
- [ ] User testing if possible

**Deliverables**:
- [ ] Polished UI
- [ ] Comprehensive error handling
- [ ] Responsive design working
- [ ] Smooth interactions and transitions

**Files**:
- Updated styling files
- Error handling utilities
- Updated components with error states
- Responsive layout code

---

### PR-009: Multi-Problem Testing and Fixes
**Status**: Not Started
**Priority**: P0
**Estimated**: 3-4 hours
**Assigned**: Unassigned
**Dependencies**: PR-005, PR-006, PR-008

**Description**:
Test system on 5+ different problem types, identify and fix bugs, ensure Socratic behavior across problem types.

**Scope**:
- Test on all required problem types (algebra, fractions, word problems, geometry, multi-step)
- Document test conversations
- Fix bugs discovered during testing
- Validate Socratic behavior across all types
- Ensure math rendering works for all types

**Test Problems** (minimum):
1. Simple algebra: "2x + 5 = 13, solve for x"
2. Fractions: "1/3 + 1/4 = ?"
3. Word problem: "Sarah has 3 apples, gets 7 more, gives away 4. How many left?"
4. Geometry: "Area of rectangle with length 8 and width 5?"
5. Multi-step: "If 3x - 7 = 2x + 5, what is x + 10?"

**Validation Checklist**:
- [ ] Never gives direct answers
- [ ] Asks minimum 3 guiding questions per problem
- [ ] Provides hints when stuck >2 turns
- [ ] Maintains context across conversation
- [ ] Validates student answers correctly
- [ ] Math renders properly in all messages
- [ ] Uses encouraging language

**Deliverables**:
- [ ] Tested on 5+ problem types
- [ ] All bugs fixed
- [ ] Test conversation logs saved (for EXAMPLES.md)
- [ ] Socratic behavior validated across types

**Files**:
- Bug fixes across codebase
- Test conversation logs
- Updated documentation of findings

---

## Day 5: Documentation & Deploy (PRs 010-011)

### PR-010: Documentation
**Status**: Not Started
**Priority**: P0
**Estimated**: 2-3 hours
**Assigned**: Unassigned
**Dependencies**: PR-009

**Description**:
Complete all project documentation including setup, examples, and prompt engineering notes.

**Scope**:
- Complete README.md with full setup instructions
- Create EXAMPLES.md with 5+ problem walkthroughs
- Create PROMPTS.md with prompt engineering notes
- Create API.md if applicable
- Document technical decisions made
- Add code comments for complex logic

**Deliverables**:
- [ ] README.md: Setup, tech stack, architecture
- [ ] EXAMPLES.md: 5+ example conversations
- [ ] PROMPTS.md: Prompt engineering notes, iterations, what worked/didn't
- [ ] API.md: API documentation (if applicable)
- [ ] Updated PRD decision log
- [ ] Code comments for complex sections

**Files**:
- `README.md`
- `docs/EXAMPLES.md`
- `docs/PROMPTS.md`
- `docs/API.md` (if applicable)
- Updated `docs/prd.md` (decision log)
- Code comments throughout

---

### PR-011: Deployment and Demo Video
**Status**: Not Started
**Priority**: P0
**Estimated**: 2-3 hours
**Assigned**: Unassigned
**Dependencies**: PR-010

**Description**:
Deploy application and create demo video showing all core features.

**Scope**:
- Choose deployment platform (or finalize local setup)
- Deploy application OR create clear local setup instructions
- Record 5-minute demo video
- Test deployed version
- Final QA

**Technical Decisions Required**:
- [ ] Deployment platform (Vercel, Netlify, Railway, or local-only)
- [ ] Environment variable setup for production
- [ ] Demo video recording approach

**Demo Video Content** (5 minutes):
- [ ] Introduction and overview
- [ ] Text input workflow
- [ ] Image upload and parsing
- [ ] Full Socratic dialogue on a problem
- [ ] Math rendering showcase
- [ ] Stretch feature (if implemented)

**Deliverables**:
- [ ] Deployed application URL OR clear local setup docs
- [ ] 5-minute demo video
- [ ] Final QA checklist completed
- [ ] Production environment configured

**Files**:
- Deployment configuration
- Demo video file
- Updated README with deployment link/instructions
- Production environment setup

---

## Days 6-7: Stretch Features (PRs 012-014) - Optional

### PR-012: Interactive Whiteboard
**Status**: Not Started
**Priority**: P1 (Optional - High Impact)
**Estimated**: 4-6 hours
**Assigned**: Unassigned
**Dependencies**: PR-011

**Description**:
Add interactive whiteboard for visual explanations and diagrams.

**Scope**:
- Shared canvas component
- Basic drawing tools (pen, shapes, text)
- Clear/undo functionality
- Persistence across conversation
- Integration with chat flow

**Technical Decisions Required**:
- [ ] Canvas library selection
- [ ] Drawing tools implementation
- [ ] State persistence approach

**Deliverables**:
- [ ] Working whiteboard component
- [ ] Basic drawing tools
- [ ] Clear/undo working
- [ ] Integration with chat

**Files**:
- Whiteboard component
- Canvas utilities
- Drawing tools
- State management for canvas

**Notes**:
- HIGHEST PRIORITY stretch feature
- Focus on functionality over polish
- Time-box to 6 hours max

---

### PR-013: Voice Interface
**Status**: Not Started
**Priority**: P1 (Optional - Accessibility)
**Estimated**: 4-6 hours
**Assigned**: Unassigned
**Dependencies**: PR-011

**Description**:
Add text-to-speech for tutor responses and speech-to-text for student input.

**Scope**:
- Text-to-speech integration
- Speech-to-text integration
- Mute/unmute controls
- Natural conversation flow

**Technical Decisions Required**:
- [ ] TTS provider selection
- [ ] STT provider selection
- [ ] Voice activation strategy

**Deliverables**:
- [ ] TTS working for tutor messages
- [ ] STT working for student input
- [ ] Voice controls UI
- [ ] Natural flow maintained

**Files**:
- TTS integration module
- STT integration module
- Voice controls component
- Audio utilities

**Notes**:
- SECOND PRIORITY stretch feature
- Time-box to 6 hours max

---

### PR-014: Step Visualization
**Status**: Not Started
**Priority**: P1 (Optional - Pedagogical)
**Estimated**: 4-6 hours
**Assigned**: Unassigned
**Dependencies**: PR-011

**Description**:
Add animated step-by-step visualization of solution process.

**Scope**:
- Display solution broken into steps
- Animate transitions between steps
- Replay capability
- Toggle step-by-step vs full view

**Technical Decisions Required**:
- [ ] Animation library selection
- [ ] Step data structure design
- [ ] Step generation approach

**Deliverables**:
- [ ] Step visualization component
- [ ] Step generation logic
- [ ] Animation working
- [ ] Replay functionality

**Files**:
- Step visualization component
- Step generator module
- Animation utilities
- Step state management

**Notes**:
- THIRD PRIORITY stretch feature
- Time-box to 6 hours max

---

## Work Coordination Rules

### Agent Assignment
- Before starting work on a PR, check this file to ensure it's not already assigned
- Update status to "In Progress" and add your agent identity when starting
- Update status to "Complete" when done and commit this file

### Dependencies
- Do not start a PR until all its dependencies are complete
- PRs can be worked in parallel if they have no dependencies

### Parallel Work Opportunities
- PR-002 and PR-003 can be worked in parallel after PR-001
- PR-005 and PR-006 can be worked in parallel after PR-004
- PR-012, PR-013, PR-014 can be worked in parallel after PR-011

### Critical Path Priority
PRs on critical path should be prioritized:
1. PR-001 → PR-004 → PR-007 → PR-008 → PR-010 → PR-011

### Commit Policy
- Agents can auto-commit updates to this file (task-list.md)
- Agents can auto-commit updates to memory bank files (docs/memory/*.md)
- All other files require user permission before committing

---

## Progress Tracking

**Week 1 (Days 1-5)**: Core MVP
- Day 1: PRs 001-003 (Foundation)
- Day 2-3: PRs 004-006 (Dialogue Core)
- Day 4: PRs 007-009 (Polish)
- Day 5: PRs 010-011 (Documentation & Deploy)

**Week 2 (Days 6-7)**: Optional Stretch
- Day 6-7: PRs 012-014 (Choose 1-2 based on time)

---

**Last Updated**: 2025-11-03
**Updated By**: Planning Agent
