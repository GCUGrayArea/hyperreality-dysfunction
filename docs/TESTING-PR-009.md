# PR-009 Testing Scheme: Multi-Problem Testing and Fixes

**Created**: 2025-11-03
**Status**: Ready for Execution
**Estimated Time**: 3-4 hours
**Goal**: Validate system works correctly across 5+ problem types, identify bugs, ensure consistent Socratic behavior

---

## Overview

PR-009 is a comprehensive validation phase that tests the entire system end-to-end across multiple problem types. This is the final technical validation before documentation and deployment.

**Success Criteria**:
- System successfully guides students through 5+ different problem types
- No crashes or critical bugs
- Socratic behavior consistent across all problem types
- Math rendering works correctly for all notation types
- Error handling works properly
- All bugs discovered are documented and fixed

---

## Test Problems

### Required Test Set (Minimum 5 Problems)

#### Test 1: Simple Algebra
**Problem**: "Solve for x: 2x + 5 = 13"

**Why This Problem**:
- Tests basic algebraic manipulation
- Simple enough for quick validation
- Already used in PR-004, good for regression testing
- Tests inline math rendering: `$2x + 5 = 13$`, `$x = 4$`

**Expected Solution Path**:
1. Identify goal (solve for x)
2. Subtract 5 from both sides → `2x = 8`
3. Divide by 2 → `x = 4`
4. Verify solution

**Validation Focus**:
- Basic Socratic flow works
- Simple math renders correctly
- Solution verification works

---

#### Test 2: Fractions
**Problem**: "What is 1/3 + 1/4?"

**Why This Problem**:
- Tests fraction notation rendering
- Tests common denominator concept
- More complex than algebra (tests hint progression)

**Expected Solution Path**:
1. Recognize need for common denominator
2. Find LCD (12)
3. Convert: `1/3 = 4/12`, `1/4 = 3/12`
4. Add: `4/12 + 3/12 = 7/12`

**Validation Focus**:
- Fraction rendering: `$\frac{1}{3}$`, `$\frac{7}{12}$`
- Multi-step guidance
- Hint progression if student struggles

---

#### Test 3: Word Problem
**Problem**: "Sarah has 3 apples. She gets 7 more apples from her friend. Then she gives 4 apples to her brother. How many apples does Sarah have now?"

**Why This Problem**:
- Tests comprehension and translation to math
- Tests multi-step reasoning
- No complex notation (focuses on logic)

**Expected Solution Path**:
1. Identify starting amount (3)
2. Add received apples: `3 + 7 = 10`
3. Subtract given apples: `10 - 4 = 6`
4. Verify makes sense

**Validation Focus**:
- Helps translate words to math operations
- Tracks state across operations
- No math rendering needed (pure text)

---

#### Test 4: Geometry
**Problem**: "What is the area of a rectangle with length 8 cm and width 5 cm?"

**Why This Problem**:
- Tests formula knowledge
- Tests units
- Simple but different domain

**Expected Solution Path**:
1. Recall/derive formula: `Area = length × width`
2. Substitute: `A = 8 × 5`
3. Calculate: `A = 40`
4. Include units: `40 cm²`

**Validation Focus**:
- Formula guidance (not revealed directly)
- Units handling
- Superscript rendering: `$\text{cm}^2$`

---

#### Test 5: Multi-Step Algebra
**Problem**: "If 3x - 7 = 2x + 5, what is x + 10?"

**Why This Problem**:
- Tests variable on both sides
- Tests multi-step with final transformation
- More complex than Test 1

**Expected Solution Path**:
1. Subtract 2x from both sides: `x - 7 = 5`
2. Add 7 to both sides: `x = 12`
3. Calculate `x + 10 = 22`

**Validation Focus**:
- Handles variables on both sides
- Guides through intermediate steps
- Completes final calculation

---

### Extended Test Set (Optional - Time Permitting)

#### Test 6: Systems of Equations
**Problem**: "Solve the system: x + y = 10 and x - y = 2"

**Why**: Tests multi-equation problems, more advanced rendering

#### Test 7: Quadratic Equation
**Problem**: "Solve: x² - 5x + 6 = 0"

**Why**: Tests factoring or quadratic formula, complex notation

#### Test 8: Calculus (Basic Derivative)
**Problem**: "Find the derivative of f(x) = 3x² + 2x"

**Why**: Tests advanced notation, symbol rendering

---

## Testing Protocol

### Phase 1: Clean Slate Testing (Each Problem)

For each test problem, follow this protocol:

#### 1.1 Setup
- [ ] Clear browser localStorage (fresh session)
- [ ] Open dev console (check for errors)
- [ ] Verify dev server running
- [ ] Start screen recording (optional but recommended)

#### 1.2 Problem Input
- [ ] Enter problem via text input (Tests 1-5 required)
- [ ] If time permits, also test via image upload (optional)
- [ ] Verify problem displays correctly
- [ ] Check tutor's initial response

#### 1.3 Solution Dialogue
- [ ] Follow tutor's guidance authentically (don't just give correct answers)
- [ ] Test with 1-2 intentional wrong answers to trigger hints
- [ ] Note number of exchanges until solution
- [ ] Verify tutor never gives direct answer
- [ ] Check math rendering at each step

#### 1.4 Completion
- [ ] Reach solution
- [ ] Verify tutor confirms solution
- [ ] Check for celebration/encouragement

#### 1.5 Documentation
- [ ] Save conversation transcript
- [ ] Screenshot any rendering issues
- [ ] Note any bugs in Bug Log (see below)
- [ ] Record test results in Test Results section

---

### Phase 2: Stress Testing

#### 2.1 Wrong Answer Progression
**Test**: Give 3+ wrong answers in a row on Test 1

**Validate**:
- [ ] Hints become more concrete
- [ ] System remains patient
- [ ] Eventually provides enough guidance to unstick student
- [ ] Never gives direct answer

#### 2.2 Off-Topic Response
**Test**: During Test 2, respond with something unrelated ("What's the weather?")

**Validate**:
- [ ] System redirects to problem
- [ ] Maintains encouragement
- [ ] Doesn't get confused

#### 2.3 Rapid Context Switching
**Test**: Start Test 1, then mid-problem say "Actually, let's do this problem: [Test 2]"

**Validate**:
- [ ] System handles context switch
- [ ] Doesn't mix up problems
- [ ] Adapts to new problem

#### 2.4 Very Long Conversation
**Test**: Extend Test 3 to 15+ exchanges (ask clarifying questions, make mistakes)

**Validate**:
- [ ] Context maintained throughout
- [ ] No memory loss
- [ ] Performance doesn't degrade

---

### Phase 3: Error Scenario Testing

#### 3.1 Network Interruption
**Test**: Start Test 1, disconnect network before response

**Validate**:
- [ ] Error message appears
- [ ] Error is clear and actionable
- [ ] "Try Again" button works
- [ ] Retry succeeds after reconnecting

#### 3.2 Invalid API Key
**Test**: Temporarily corrupt API key in .env, restart server

**Validate**:
- [ ] Specific API key error message
- [ ] Directs to .env setup
- [ ] No retry button (non-recoverable)

---

### Phase 4: UI/UX Testing

#### 4.1 Responsive Design
**Test**: Test each problem type at different screen widths

**Validate**:
- [ ] Desktop (1920px): Full layout works
- [ ] Tablet (768px): Responsive adjustments work
- [ ] Mobile (375px): Touch targets adequate, no overflow

#### 4.2 Math Rendering
**Test**: Verify all math notation in problems renders correctly

**Validate**:
- [ ] Inline math: `$x + 5$`
- [ ] Block math: `$$\frac{a}{b}$$`
- [ ] Superscripts: `$x^2$`
- [ ] Fractions: `$\frac{1}{3}$`
- [ ] Complex expressions: `$$\int_0^1 x^2 dx$$`
- [ ] No LaTeX source visible (all rendered)

#### 4.3 Loading States
**Test**: Observe loading indicator during API calls

**Validate**:
- [ ] Loading dots appear immediately
- [ ] Input disabled during loading
- [ ] Smooth transition when response arrives

#### 4.4 Print Functionality
**Test**: Print conversation (Ctrl+P / Cmd+P)

**Validate**:
- [ ] Only conversation history shown
- [ ] Header/input hidden
- [ ] Clean formatting

---

## Socratic Behavior Checklist

For **each** of the 5 required test problems, validate:

### Core Socratic Principles
- [ ] **Never gives direct answer** - Even when asked directly, deflects with questions
- [ ] **Asks guiding questions** - Minimum 3 questions before solution reached
- [ ] **Helps student discover** - Student articulates solution steps, not tutor
- [ ] **Validates student reasoning** - Confirms correct steps, points out errors
- [ ] **Uses encouraging language** - Positive tone throughout

### Hint Progression
- [ ] **Initial hints vague** - "What operation might help?"
- [ ] **Hints become concrete if stuck** - After 2+ wrong answers, more specific
- [ ] **Never reveals full solution** - Even concrete hints are partial

### Context Management
- [ ] **Remembers problem** - References original problem in later exchanges
- [ ] **Tracks progress** - Acknowledges which steps completed
- [ ] **Builds on previous answers** - References student's earlier responses

### Domain-Specific Behavior
- [ ] **Algebra**: Guides toward isolation of variable
- [ ] **Fractions**: Hints at common denominator without stating it
- [ ] **Word Problems**: Helps translate words to operations
- [ ] **Geometry**: Guides to formula without stating it
- [ ] **Multi-step**: Breaks into manageable sub-steps

---

## Test Results Log

### Test 1: Simple Algebra (2x + 5 = 13)

**Date**: ___________
**Tester**: ___________

**Results**:
- [ ] PASS - Socratic behavior consistent
- [ ] PASS - Math rendering correct
- [ ] PASS - Solution reached successfully
- [ ] PASS - No bugs encountered

**Notes**:
```
Exchange count: ___
Wrong answers tested: ___
Bugs found: (see Bug Log #___)
Math rendering issues: ___
```

**Transcript**: (Save to `docs/test-logs/test-1-algebra.md`)

---

### Test 2: Fractions (1/3 + 1/4)

**Date**: ___________
**Tester**: ___________

**Results**:
- [ ] PASS - Socratic behavior consistent
- [ ] PASS - Fraction rendering correct
- [ ] PASS - Solution reached successfully
- [ ] PASS - No bugs encountered

**Notes**:
```
Exchange count: ___
Wrong answers tested: ___
Bugs found: (see Bug Log #___)
Fraction rendering: ___
```

**Transcript**: (Save to `docs/test-logs/test-2-fractions.md`)

---

### Test 3: Word Problem (Sarah's Apples)

**Date**: ___________
**Tester**: ___________

**Results**:
- [ ] PASS - Socratic behavior consistent
- [ ] PASS - Logic guidance clear
- [ ] PASS - Solution reached successfully
- [ ] PASS - No bugs encountered

**Notes**:
```
Exchange count: ___
Wrong answers tested: ___
Bugs found: (see Bug Log #___)
Translation guidance: ___
```

**Transcript**: (Save to `docs/test-logs/test-3-word-problem.md`)

---

### Test 4: Geometry (Rectangle Area)

**Date**: ___________
**Tester**: ___________

**Results**:
- [ ] PASS - Socratic behavior consistent
- [ ] PASS - Formula guidance appropriate
- [ ] PASS - Solution reached successfully
- [ ] PASS - No bugs encountered

**Notes**:
```
Exchange count: ___
Wrong answers tested: ___
Bugs found: (see Bug Log #___)
Units handling: ___
```

**Transcript**: (Save to `docs/test-logs/test-4-geometry.md`)

---

### Test 5: Multi-Step Algebra (3x - 7 = 2x + 5)

**Date**: ___________
**Tester**: ___________

**Results**:
- [ ] PASS - Socratic behavior consistent
- [ ] PASS - Multi-step guidance clear
- [ ] PASS - Solution reached successfully
- [ ] PASS - No bugs encountered

**Notes**:
```
Exchange count: ___
Wrong answers tested: ___
Bugs found: (see Bug Log #___)
Variable handling: ___
```

**Transcript**: (Save to `docs/test-logs/test-5-multi-step.md`)

---

## Bug Log

### Bug #1
**Severity**: Critical / High / Medium / Low
**Component**: Chat / LLM / Rendering / Upload / Styling
**Description**:
**Steps to Reproduce**:
**Expected Behavior**:
**Actual Behavior**:
**Screenshot/Console Error**:
**Status**: Open / Fixed / Won't Fix
**Fix Commit** (if fixed): ___________

---

### Bug #2
**Severity**: Critical / High / Medium / Low
**Component**: Chat / LLM / Rendering / Upload / Styling
**Description**:
**Steps to Reproduce**:
**Expected Behavior**:
**Actual Behavior**:
**Screenshot/Console Error**:
**Status**: Open / Fixed / Won't Fix
**Fix Commit** (if fixed): ___________

---

## Bug Severity Guidelines

**Critical**: Blocks core functionality, prevents testing
- System crashes
- Cannot send messages
- Cannot parse problems
- Complete rendering failure

**High**: Significantly impacts user experience
- Socratic behavior breaks (gives direct answers)
- Math rendering fails for common notation
- Context lost mid-conversation
- Error handling doesn't work

**Medium**: Noticeable but doesn't prevent core functionality
- Minor rendering glitches
- Awkward phrasing in responses
- UI polish issues
- Non-critical accessibility issues

**Low**: Minor polish issues
- Typos
- Inconsistent spacing
- Minor CSS tweaks needed

---

## Fix Protocol

For each bug found:

1. **Document** - Add to Bug Log with full details
2. **Prioritize** - Assign severity (Critical → Low)
3. **Reproduce** - Confirm reproducible
4. **Fix** - Implement fix in relevant file(s)
5. **Test** - Verify fix resolves issue
6. **Regress** - Re-run original test to ensure no regression
7. **Commit** - Commit fix with reference to bug number
8. **Update** - Mark bug as "Fixed" with commit hash

---

## Success Criteria Summary

PR-009 is considered **COMPLETE** when:

### Required
- [x] All 5 required test problems completed successfully
- [x] All test problems pass Socratic Behavior Checklist
- [x] All Critical and High severity bugs fixed
- [x] Test transcripts saved for at least 3 problems
- [x] Math rendering verified for all notation types used
- [x] Responsive design tested at 3 breakpoints
- [x] Error handling tested (at least network error)

### Optional (Time Permitting)
- [ ] Extended test set (Tests 6-8) completed
- [ ] All Medium severity bugs fixed
- [ ] All test transcripts saved
- [ ] Image upload tested for all problems
- [ ] Stress tests completed (Phase 2)
- [ ] Full error scenario testing (Phase 3)

---

## Deliverables

Upon completion of PR-009:

1. **This Document** (TESTING-PR-009.md) - Filled out with results
2. **Test Transcripts** - `docs/test-logs/test-N-[name].md` for each test
3. **Bug Log** - Comprehensive list in this document or separate file
4. **Fix Commits** - All bugs fixed and committed
5. **Updated Memory Bank** - `progress.md` and `systemPatterns.md` updated with findings

---

## Notes for Tester

**Tips for Authentic Testing**:
- Don't just speedrun to correct answers - test the Socratic flow
- Make realistic mistakes (off-by-one errors, wrong operations)
- Ask clarifying questions like a real student would
- Test edge cases (very wrong answers, confusion, etc.)

**Console Monitoring**:
- Keep DevTools console open throughout testing
- Note any warnings or errors (even non-breaking)
- Check Network tab for API calls (timing, errors)

**Time Management**:
- Required tests: ~2 hours (30 min per problem + setup)
- Bug fixing: ~1 hour (depends on bugs found)
- Documentation: ~30 minutes
- Buffer: ~30 minutes
- **Total**: 3-4 hours

**When to Stop**:
- If Critical bugs found: Fix immediately before continuing
- If High bugs found: Document, continue testing, fix in batch
- If Medium/Low bugs: Document, fix time permitting
- If 3+ Critical bugs: Consider pausing for architectural review

---

## Appendix: Quick Reference

### Problem List
1. `2x + 5 = 13` (algebra)
2. `1/3 + 1/4` (fractions)
3. Sarah's apples (word problem)
4. Rectangle area: 8×5 (geometry)
5. `3x - 7 = 2x + 5, find x + 10` (multi-step)

### Key Files to Monitor
- `src/components/Chat.jsx` - Main logic
- `src/services/openai.js` - LLM integration
- `src/utils/latexRenderer.js` - Math rendering
- Browser console - Errors/warnings

### Quick Validation
For each test, verify:
✓ No direct answers given
✓ Math renders correctly
✓ Reaches correct solution
✓ No console errors

---

**Status**: Ready for execution
**Created**: 2025-11-03
**Last Updated**: 2025-11-03
**Version**: 1.0
