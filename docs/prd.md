# Product Requirements Document: AI Math Tutor

**Project**: Hyperreality Dysfunction - Socratic Math Learning Assistant
**Timeline**: 3-5 days core + optional stretch features
**Date**: November 3, 2025
**Contact**: John Chen (john.chen@superbuilders.school)

## Vision

Build an AI-powered math tutor that uses Socratic questioning to guide students through problem-solving without giving direct answers. Inspired by the OpenAI x Khan Academy demo, the system helps students discover solutions through guided dialogue rather than passive learning.

**Success Criteria**:
- Guides students through 5+ different problem types without revealing direct answers
- Maintains conversation context across multi-turn dialogues
- Adapts questioning based on student understanding level
- Successfully parses problems from both text and images

## Core Features (MVP - Days 1-5)

### 1. Problem Input System
**Priority**: P0 (Critical Path)

**Requirements**:
- Accept math problems via text entry
- Accept math problems via image upload (screenshot/photo)
- Parse text from uploaded images
- Display parsed content to student for confirmation

**Constraints**:
- Support common image formats (PNG, JPG, WEBP minimum)
- Start with printed text (easier than handwritten for MVP)

**Technical Decisions Deferred**:
- Vision/OCR provider selection → **Decision Point: Day 1 setup**
- Image processing pipeline architecture → **Decision Point: Day 1 implementation**
- File upload mechanism → **Decision Point: When building UI**

### 2. Socratic Dialogue Engine
**Priority**: P0 (Critical Path - VALIDATE FIRST)

**Requirements**:
- Maintain conversation context across multiple question/answer turns
- Ask guiding questions without revealing answers
- Evaluate student responses and provide appropriate feedback
- Provide progressively concrete hints after student stuck >2 turns
- Use encouraging, patient language throughout

**Core System Behavior**:
```
You are a patient math tutor. NEVER give direct answers. Guide through questions:
- 'What information do we have?'
- 'What method might help?'
- 'What happens if we...?'
If stuck >2 turns, provide concrete hint without revealing full solution.
Use encouraging language.
```

**Standard Flow**:
1. Parse problem → Confirm understanding with student
2. Inventory knowns → "What information do we have?"
3. Identify goal → "What are we trying to find?"
4. Guide method selection → "Which approach might work?"
5. Step through solution → "What should we do next?"
6. Validate answer → "Does that make sense? How can we check?"

**Technical Decisions Deferred**:
- LLM provider (OpenAI, Anthropic, other) → **Decision Point: Day 1, before other work**
- Prompt engineering approach → **CRITICAL: Must validate Day 2 before building full UI**
- Context management strategy → **Decision Point: Day 2 during implementation**
- Response evaluation logic → **Decision Point: Day 3 when implementing validation**

**⚠️ CRITICAL VALIDATION**: Test Socratic prompting on Day 2 with minimal prototype before building full UI. If LLM keeps giving direct answers, iterate on prompts/provider before proceeding.

### 3. Math Rendering
**Priority**: P0 (Critical Path)

**Requirements**:
- Display mathematical equations properly formatted
- Support inline and block equation modes
- Handle fractions, exponents, symbols, special notation
- Render equations in both student and tutor messages

**Technical Decisions Deferred**:
- Math rendering library choice → **Decision Point: Day 4 UI polish phase**
- LaTeX parsing approach → **Decision Point: When implementing rendering**
- Copy-paste support for equations → **Optional enhancement, decide Day 4**

### 4. Web Interface
**Priority**: P0 (Critical Path)

**Requirements**:
- Chat-style message display (user/tutor distinction clear)
- Text input field with send capability
- Image upload capability (drag-drop or click-to-upload)
- Scrollable conversation history
- Loading states during LLM processing
- Error handling for failed operations
- Responsive to different screen sizes (desktop/tablet minimum)

**Technical Decisions Deferred**:
- Frontend framework → **Decision Point: Day 1 project setup**
- UI component library (if any) → **Decision Point: Day 1 setup**
- Styling approach → **Decision Point: Day 1 setup** (Constraint: NO Tailwind per user prefs)
- Session persistence mechanism → **Decision Point: Day 4-5, optional**
- Backend architecture → **Decision Point: Day 1 based on LLM integration needs**

## Stretch Features (If Time Permits)

### High Value Features

#### Interactive Whiteboard
**Priority**: P1 (High Impact)
**Estimated**: 4-6 hours

**Requirements**:
- Shared visual canvas
- Basic drawing tools (pen, shapes, text)
- Clear/undo functionality
- Persistent across conversation

**Value Proposition**: Visual learning significantly improves comprehension for geometry and graphing.

**Technical Decisions Deferred**:
- Canvas implementation → **Decision Point: Day 6 if pursuing**
- Real-time sync needs → **Decision Point: Day 6 based on architecture**

#### Step Visualization
**Priority**: P1 (High Impact)
**Estimated**: 4-6 hours

**Requirements**:
- Display solution steps broken down
- Animate or highlight transitions between steps
- Replay capability
- Toggle between step-by-step and full view

**Value Proposition**: Shows logical progression without revealing full answer.

**Technical Decisions Deferred**:
- Animation library → **Decision Point: Day 6 if pursuing**
- Step data structure → **Decision Point: Day 6 when designing**

#### Voice Interface
**Priority**: P1 (Accessibility)
**Estimated**: 4-6 hours

**Requirements**:
- Text-to-speech for tutor responses
- Speech-to-text for student input
- Mute/unmute controls
- Natural conversation flow

**Value Proposition**: Accessibility + more natural tutoring experience.

**Technical Decisions Deferred**:
- TTS/STT provider → **Decision Point: Day 6 if pursuing**
- Voice activation strategy → **Decision Point: Day 6 implementation**

### Polish Features

#### Animated Avatar
**Priority**: P2 (Polish)
**Estimated**: 6-8 hours

**Requirements**:
- Visual tutor character
- Context-appropriate expressions (thinking, encouraging, celebrating)
- Optional/disableable

**Technical Decisions Deferred**: All → **Decision Point: Day 7 only if time remains**

#### Difficulty Modes
**Priority**: P2 (Enhancement)
**Estimated**: 3-4 hours

**Requirements**:
- Grade level selection
- Adjust scaffolding amount per level
- Control hint frequency/directness

**Technical Decisions Deferred**: All → **Decision Point: Day 7 only if time remains**

#### Problem Generation
**Priority**: P2 (Practice)
**Estimated**: 4-6 hours

**Requirements**:
- Generate similar practice problems
- Vary difficulty
- Suggest problem types for practice

**Technical Decisions Deferred**: All → **Decision Point: Day 7 only if time remains**

## Problem Type Coverage

**Must Support (MVP)**:
1. Simple arithmetic (addition, subtraction, multiplication, division)
2. Basic algebra (solving for x, linear equations)
3. Fractions and decimals
4. Simple word problems
5. Multi-step problems

**Should Support (Stretch)**:
6. Geometry (area, perimeter, angles)
7. Polynomials and factoring
8. Systems of equations
9. Quadratic equations
10. Basic calculus (derivatives, integrals)

## Technical Architecture (High Level)

**Component Requirements**:
- Web-based frontend (browser accessible)
- LLM integration (API-based)
- Image processing capability
- Math rendering capability
- Optional: Backend/API layer if needed
- Optional: Data persistence if needed

**Constraints**:
- NO Tailwind CSS (per user preferences)
- Must handle API rate limiting
- Must protect API keys (no commits to repo)

**Major Technical Decision Points**:

1. **Day 1 - Foundation Stack** → Must decide:
   - Frontend framework
   - LLM provider
   - Image parsing approach
   - Basic architecture (SPA, SSR, API structure)

2. **Day 2 - Prompt Engineering** → Must validate:
   - Socratic prompting works with chosen LLM
   - Context management strategy
   - **BLOCKER**: If prompting doesn't work, must iterate before proceeding

3. **Day 4 - Rendering & Polish** → Must decide:
   - Math rendering library
   - Styling approach details
   - Session persistence (if implementing)

4. **Day 6-7 - Stretch Features** → Must decide:
   - Which stretch feature(s) to pursue
   - Implementation approach for chosen features

## Success Metrics

### Pedagogical Quality (35%)
- System never reveals solution outright
- Questions genuinely guide toward solution
- Hints become more concrete when student stuck
- Uses encouraging language consistently

### Technical Implementation (30%)
- Image parsing >90% accuracy on printed text
- Conversation maintains context across turns
- All equations display correctly
- Graceful error handling with helpful messages

### User Experience (20%)
- First-time users can start without tutorial
- System feels responsive, not laggy
- Math is readable and properly formatted
- Works on target devices (desktop/tablet minimum)

### Innovation (15%)
- Creative implementation of stretch features
- Novel approaches to Socratic tutoring
- Delightful details and polish

## Deliverables

### 1. Deployed Application
- Live deployment OR local setup with clear instructions
- Working demo ready to show

### 2. GitHub Repository
- Clean code structure and organization
- Proper gitignore (no API keys)
- Commented code for complex logic

### 3. Documentation
- **README.md**: Setup instructions, tech stack, architecture overview
- **EXAMPLES.md**: 5+ example problem walkthroughs showing Socratic dialogue
- **PROMPTS.md**: System prompt engineering notes and iterations
- **API.md**: API documentation (if applicable)

### 4. Demo Video (5 minutes)
- Text input workflow
- Image upload and parsing
- Full Socratic dialogue on a problem
- Stretch feature (if implemented)
- Screen recording with voiceover

## Development Timeline

### Day 1: Foundation
**Goal**: Image parsing working, can extract problem text

**Must Decide**:
- Frontend framework
- LLM provider
- Image parsing approach
- Project structure

**Tasks**:
- Set up project structure
- Integrate image parsing capability
- Build minimal upload UI
- Test OCR on printed math problems

**Milestone**: Upload image → see parsed text

### Day 2: Dialogue Core
**Goal**: Basic chat + LLM integration with hardcoded problem

**⚠️ CRITICAL VALIDATION POINT**:
- Test Socratic prompting with chosen LLM
- Validate it guides without giving answers
- If fails: iterate on prompt/provider before building more

**Tasks**:
- Build chat UI components
- Integrate LLM with Socratic system prompt
- Test dialogue flow on single hardcoded problem
- Implement message history

**Milestone**: Type problem → have Socratic conversation

### Day 3: Socratic Logic
**Goal**: Questions not answers, response validation

**Tasks**:
- Refine system prompt based on Day 2 findings
- Implement response evaluation logic
- Add hint progression system (after 2+ stuck turns)
- Test on multiple problem types

**Milestone**: System guides without revealing answers on 3+ problem types

### Day 4: Polish & Rendering
**Goal**: UI polish + math rendering, tested on 5+ problems

**Must Decide**:
- Math rendering library
- Final styling approach
- Session persistence (if implementing)

**Tasks**:
- Integrate math rendering
- Polish chat UI and interactions
- Add loading states and error handling
- Test on 5+ different problem types

**Milestone**: Production-ready core features

### Day 5: Documentation & Deploy
**Goal**: Documentation, demo video, deployment

**Must Decide**:
- Deployment platform (if deploying)

**Tasks**:
- Write all documentation
- Record demo video
- Deploy to hosting OR finalize local setup
- Final testing and bug fixes

**Milestone**: Publicly shareable project

### Days 6-7 (Optional): Stretch Features
**Recommended Priority**: Whiteboard > Voice > Avatar

**Must Decide**:
- Which stretch feature to pursue
- Implementation details for chosen feature

**Tasks**:
- Implement highest-impact stretch feature
- Polish and test
- Update documentation

**Milestone**: Enhanced learning experience

## Risk Assessment & Mitigation

### High Risk Items

**Risk**: Image parsing fails on handwritten/complex notation
- **Mitigation**: Start with printed text for MVP
- **Decision Point**: Day 1 - choose parser with best tradeoffs

**Risk**: LLM gives direct answers despite Socratic prompts
- **Mitigation**: Validate early (Day 2) before building full UI
- **Decision Point**: Day 2 - iterate prompts or try different provider

**Risk**: Multi-turn context gets lost
- **Mitigation**: Test context management on Day 2-3
- **Decision Point**: Day 2 - design context strategy early

### Medium Risk Items

**Risk**: Math rendering edge cases break display
- **Mitigation**: Build test suite of problem types
- **Decision Point**: Day 4 - choose robust rendering library

**Risk**: API costs exceed budget
- **Mitigation**: Implement rate limiting, monitor usage
- **Decision Point**: Day 1 - set up cost controls from start

**Risk**: Scope creep on stretch features
- **Mitigation**: Strict time-boxing (4-6 hours per feature max)
- **Decision Point**: Day 6 - commit to ONE stretch feature only

## Testing Strategy

### Core Validation Test Suite

Test system on minimum 5 problems across types:

1. **Simple Algebra**: "2x + 5 = 13, solve for x"
2. **Fractions**: "1/3 + 1/4 = ?"
3. **Word Problem**: "Sarah has 3 apples, gets 7 more, gives away 4. How many left?"
4. **Geometry**: "Area of rectangle with length 8 and width 5?"
5. **Multi-step**: "If 3x - 7 = 2x + 5, what is x + 10?"

### Socratic Behavior Checklist

- [ ] System never gives direct answer
- [ ] Asks minimum 3 guiding questions per problem
- [ ] Provides hint when stuck >2 turns
- [ ] Maintains context across conversation
- [ ] Validates student answers correctly
- [ ] Uses encouraging language
- [ ] Adapts to student understanding level

### Technical Checklist

- [ ] Math renders properly in all messages
- [ ] Image upload and parsing works (printed text)
- [ ] Handles errors gracefully (upload fails, parsing fails, API errors)
- [ ] Loading states display during LLM calls
- [ ] Conversation scrolls properly
- [ ] Works on desktop and tablet

## Development Strategy

### Phase 1: Prove Socratic Concept (4-6 hours)
**⚠️ MOST CRITICAL PHASE**

1. Set up minimal project
2. Integrate LLM with basic UI
3. Hardcode problem: "2x + 5 = 13"
4. Test Socratic prompting
5. **DECISION GATE**: Does it guide without giving answers?
   - YES → Continue to Phase 2
   - NO → Iterate on prompt/provider, don't build more yet

### Phase 2: Build Core Features (8-12 hours)

6. Add image upload + parsing
7. Connect parsed problems to chat
8. Add math rendering
9. Polish UI
10. Add error handling

### Phase 3: Test & Deploy (4-6 hours)

11. Test on 5+ problem types
12. Fix bugs and edge cases
13. Write documentation
14. Deploy or finalize setup
15. Record demo video

### Phase 4: Stretch (8-12 hours optional)

16. Choose ONE stretch feature (recommend Whiteboard)
17. Build minimal viable version
18. Test and polish
19. Update docs

## Example Interaction Flow

**Student**: [uploads image: "2x + 5 = 13"]

**Tutor**: "I see you have the equation 2x + 5 = 13. Let's work through this together! First, what are we trying to find in this problem?"

**Student**: "x"

**Tutor**: "Exactly right! So we need to get x by itself. Right now, x is being multiplied by 2, and then 5 is added. To isolate x, we need to undo both of these operations. Which operation should we undo first - the +5 or the ×2?"

**Student**: "the +5?"

**Tutor**: "Perfect! We should undo the addition first. How do we undo adding 5 to both sides of an equation?"

**Student**: "subtract 5?"

**Tutor**: "Yes! Subtracting 5 from both sides will undo the +5. What do you get when you subtract 5 from both sides?"

**Student**: "2x = 8"

**Tutor**: "Excellent work! Now x is still being multiplied by 2. How can we undo that multiplication to get x by itself?"

**Student**: "divide by 2"

**Tutor**: "Perfect! What's your final answer?"

**Student**: "x = 4"

**Tutor**: "Outstanding! Let's verify: if x = 4, then 2(4) + 5 = 8 + 5 = 13 ✓ You solved it correctly! Great job working through each step!"

## Key Decision Log

This section is updated as decisions are made. Format:

**[Decision Point]** - **When**: [Date/Day] - **Decision**: [What was chosen] - **Rationale**: [Why]

### PR-001 Decisions (2025-11-03)

- **Frontend Framework** - When: PR-001 (Day 1) - Decision: React 18.3.1 + Vite 6.0.5 - Rationale: Fast dev server, modern tooling, simple SPA setup, large ecosystem. Rejected Next.js as too heavyweight for MVP.

- **LLM Provider** - When: PR-001 (Day 1) - Decision: OpenAI GPT-4 - Rationale: Single API handles both image parsing (GPT-4 Vision) and Socratic dialogue (GPT-4). Considered Anthropic Claude but would need separate OCR solution.

- **Image Parsing** - When: PR-001 (Day 1) - Decision: OpenAI GPT-4 Vision - Rationale: Integrated with LLM provider, handles printed math text well. Starting focus on printed text (easier than handwritten).

- **Architecture** - When: PR-001 (Day 1) - Decision: Client-side SPA with direct API calls - Rationale: Simpler deployment, fewer moving parts for MVP. May add backend proxy in production for API key security.

- **Styling Approach** - When: PR-001 (Day 1) - Decision: CSS Modules - Rationale: Scoped styles, no extra dependencies, meets "NO Tailwind" user constraint.

- **State Management** - When: PR-001 (Day 1) - Decision: React built-in (useState, useContext) - Rationale: Sufficient for MVP complexity. May add Zustand if needed later.

### PR-007 Decisions (2025-11-03)

- **Math Rendering Library** - When: PR-007 (Day 4) - Decision: KaTeX - Rationale: Faster than MathJax (~300KB vs ~1MB), synchronous rendering (no async complexity), better performance for interactive apps. Supports all standard LaTeX notation.

- **LaTeX Parsing Strategy** - When: PR-007 (Day 4) - Decision: Custom parser splitting on `$` and `$$` delimiters - Rationale: Full control over parsing logic, easier debugging than complex regex, clear separation of text vs math content.

- **Error Handling for LaTeX** - When: PR-007 (Day 4) - Decision: Graceful degradation with `throwOnError: false` - Rationale: Malformed LaTeX shows in red with error styling instead of breaking UI. Better UX than error boundaries.

### Future Decisions

- **Deployment Platform** - When: Day 5 (PR-011) - Decision: TBD - Rationale: TBD
- **Stretch Features** - When: Day 6-7 (PR-012+) - Decision: TBD - Rationale: TBD

---

**Generated by**: Claude Code Planning Agent
**Source Spec**: spec.md
**Generated On**: 2025-11-03
