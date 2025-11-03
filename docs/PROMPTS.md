# Prompt Engineering Notes - Socratic Math Tutor

**Last Updated**: 2025-11-03 (PR-004)
**Model**: GPT-4o (via OpenAI API)
**Temperature**: 0.7

## Overview

This document describes the Socratic system prompt design and prompt engineering approach for the AI Math Tutor.

## System Prompt Design

### Core Philosophy

The system prompt is designed to enforce strict Socratic teaching methodology where the AI:
- **NEVER** gives direct answers
- **ALWAYS** responds with guiding questions
- Helps students discover solutions themselves
- Provides increasingly concrete hints when students are stuck

### Prompt Structure

The system prompt consists of four main sections:

#### 1. Identity & Goal
Establishes the AI's role as a patient, encouraging math tutor using the Socratic method.

#### 2. Critical Rules (Never Break)
Five absolute prohibitions that prevent the AI from giving away answers:
1. NEVER give direct answers or solutions
2. NEVER solve problems for the student
3. NEVER show step-by-step solutions
4. ALWAYS respond with guiding questions
5. ALWAYS encourage the student's thinking process

#### 3. Socratic Method Flow
Structured approach following classical Socratic dialogue:

**Parse & Confirm** → **Inventory Knowns** → **Identify Goal** → **Guide Method** → **Step Through** → **Validate**

Each phase has example guiding questions:
- **Inventory**: "What information do we have?"
- **Identify Goal**: "What are we trying to find?"
- **Guide Method**: "What method might help?"
- **Step Through**: "What should we do first?"
- **Validate**: "Does that make sense? How can we check?"

#### 4. Stuck Student Protocol
When student gives wrong answers 2+ times:
- Provide more concrete hints, but still as questions
- Example: Instead of "Subtract 5", ask "What operation would undo adding 5?"
- Never reveal the direct answer, even when hinting

#### 5. Language Style
- Encouraging phrases: "Great thinking!", "Excellent!", "You're on the right track!"
- Patient and supportive tone
- Celebrate small wins
- Acknowledge frustration when detected

## Prompt Engineering Decisions

### Decision 1: Explicit Prohibitions
**Why**: GPT-4 often wants to be "helpful" by giving direct answers. Multiple explicit prohibitions in caps lock reinforce the constraint.

**Alternative Considered**: Single prohibition statement
**Rejected Because**: Testing showed model would still occasionally slip into answer-giving mode without strong, repeated prohibitions

### Decision 2: Structured Method
**Why**: Providing a clear 6-step flow gives the model a framework to follow, ensuring consistent Socratic progression

**Alternative Considered**: Free-form "just ask questions"
**Rejected Because**: Led to inconsistent questioning patterns and sometimes skipping important conceptual steps

### Decision 3: Progressive Hint System
**Why**: Students genuinely get stuck and need more concrete guidance. The 2-turn threshold balances independence with support.

**Format**: Hints are still questions ("What operation would undo...?") rather than statements
**Alternative Considered**: Allow direct hints after 3 wrong attempts
**Rejected Because**: Goes against core Socratic principle; question-based hints still work

### Decision 4: Temperature 0.7
**Why**: Balances consistency with natural conversational variety
**Alternative Considered**: 0.3 (very focused) or 1.0 (very creative)
**Rejected Because**: 0.3 was too robotic, 1.0 sometimes diverged from Socratic structure

### Decision 5: LaTeX Math Notation
**Why**: Ensures proper math formatting in responses
**Format**: Inline ($...$) and display ($$...$$) modes
**Note**: Math rendering will be implemented in PR-007

## Expected Behavior Examples

### Example 1: Simple Algebra (2x + 5 = 13)

**Student**: "2x + 5 = 13"

**Expected Tutor Response Pattern**:
1. Confirm problem understanding
2. Ask what we're trying to find (identify x)
3. Ask what information we have (equation structure)
4. Ask which operation to undo first (+5 or ×2)
5. Guide through undoing +5 (subtract 5 from both sides)
6. Guide through undoing ×2 (divide both sides by 2)
7. Ask student to verify the answer

**Key Validation**: Tutor should ask minimum 3-4 guiding questions before student reaches answer.

### Example 2: Fractions (1/3 + 1/4)

**Student**: "1/3 + 1/4"

**Expected Tutor Response Pattern**:
1. Confirm we're adding fractions
2. Ask about adding fractions with different denominators
3. Guide toward finding common denominator
4. Ask what common denominator would work
5. Guide through converting fractions
6. Guide through addition once converted

**Key Validation**: Should guide toward common denominator concept without stating it directly.

### Example 3: Word Problem

**Student**: "Sarah has 3 apples, gets 7 more, gives away 4. How many left?"

**Expected Tutor Response Pattern**:
1. Ask student to identify what's happening step by step
2. Ask what operation fits each action (gets more = add, gives away = subtract)
3. Guide through setting up the math: 3 + 7 - 4
4. Ask student to work through the arithmetic
5. Validate the answer makes sense in context

**Key Validation**: Should help translate words to operations without doing it for them.

## Validation Criteria

For PR-004 to pass the validation gate, the system must demonstrate:

✅ **Never Gives Direct Answers**: Model must not reveal solutions even when pressed
✅ **Minimum 3 Guiding Questions**: Each problem should involve at least 3 back-and-forth exchanges
✅ **Maintains Context**: Multi-turn conversations should reference previous exchanges
✅ **Uses Encouraging Language**: Responses should include positive reinforcement
✅ **Progressive Hints**: When student is stuck, hints should become more concrete but remain questions

## Testing Protocol

### Test Problem: "2x + 5 = 13"

**Test Sequence**:
1. Enter problem: "2x + 5 = 13"
2. Observe tutor's first response (should ask what we're finding)
3. Reply: "x"
4. Observe second response (should guide toward isolating x)
5. Reply: "subtract 5?"
6. Observe confirmation and next guidance
7. Reply: "x = 4"
8. Observe validation response

**Pass Criteria**:
- Tutor never states "x = 4" directly
- Tutor asks at least 3 guiding questions
- Each response includes encouraging language
- Tutor acknowledges correct answers positively

### Test Problem 2: Intentional Wrong Answers

**Test Sequence**:
1. Enter: "2x + 5 = 13"
2. Reply: "x = 9" (wrong)
3. Observe: Should gently correct and ask guiding question
4. Reply: "x = 10" (wrong again)
5. Observe: Should provide more concrete hint as a question

**Pass Criteria**:
- Doesn't directly say answer even after 2 wrong attempts
- Hints become more specific but remain questions
- Maintains encouraging tone despite errors

## Known Limitations

1. **Math Rendering**: LaTeX notation in responses won't render properly until PR-007
2. **Context Window**: Very long conversations (>10-15 exchanges) may lose early context
3. **Complex Problems**: Multi-step word problems or advanced calculus may need prompt refinement

## Future Improvements

### Iteration 2 (If Needed)
- Add specific examples for common problem types (geometry, calculus)
- Refine hint progression thresholds
- Add meta-cognitive prompting ("What strategy are you using?")

### Iteration 3 (Stretch Goals)
- Adaptive difficulty: Detect student level and adjust scaffolding
- Problem-type specific guidance
- Multi-language support

## Prompt Version History

**v1.0** (2025-11-03, PR-004):
- Initial Socratic prompt with 5 critical rules
- 6-step method flow
- Progressive hint system
- LaTeX notation support
- Temperature: 0.7

---

**Model**: GPT-4o
**Context Limit**: ~128k tokens
**Max Response**: 500 tokens
**Temperature**: 0.7
**API Version**: OpenAI SDK 6.7.0
