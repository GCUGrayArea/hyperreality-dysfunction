# PR-004 Validation Testing Guide

**PR**: LLM Integration with Socratic Prompts
**Status**: Ready for User Validation
**Server**: http://localhost:5175 (or check `npm run dev` output)

## ⚠️ CRITICAL VALIDATION GATE

This PR is a **validation gate** for the entire project. The Socratic prompting **must work** before proceeding to other PRs. If validation fails, we must iterate on the prompt design.

## Prerequisites

1. Ensure `.env` file has your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=sk-...
   ```

2. Start the dev server:
   ```bash
   cd math-tutor
   npm run dev
   ```

3. Open browser to the provided localhost URL

## Test 1: Basic Algebra - "2x + 5 = 13"

### Test Steps

1. **Enter the problem**: Type "2x + 5 = 13" in the chat input
2. **Observe first response**: Should ask what we're trying to find
3. **Reply**: "x"
4. **Observe**: Should guide toward method to isolate x
5. **Reply**: "subtract 5?"
6. **Observe**: Should confirm and ask about next step
7. **Reply**: "divide by 2"
8. **Reply**: "x = 4"
9. **Observe**: Should validate the answer

### ✅ Pass Criteria

- [ ] Tutor NEVER states the answer "x = 4" directly
- [ ] Tutor asks at least 3 guiding questions
- [ ] Responses include encouraging language ("Great!", "Excellent!", etc.)
- [ ] Context is maintained across all turns
- [ ] Final response validates/celebrates the correct answer

### ❌ Fail Indicators

- Tutor gives direct answer at any point
- Tutor shows step-by-step solution
- Questions are not genuinely guiding (too vague or too specific)
- Responses are robotic without encouragement

## Test 2: Wrong Answers (Hint Progression)

### Test Steps

1. **Enter**: "2x + 5 = 13"
2. **Reply**: "x = 9" (intentionally wrong)
3. **Observe**: Should gently correct without revealing answer
4. **Reply**: "x = 10" (wrong again)
5. **Observe**: Should provide more concrete hint, still as a question

### ✅ Pass Criteria

- [ ] Doesn't directly say answer after wrong attempts
- [ ] Hints become more specific after 2nd wrong answer
- [ ] Hints remain as questions ("What operation would undo...?")
- [ ] Maintains encouraging, patient tone

## Test 3: Multi-Turn Context

### Test Steps

1. **Enter**: "2x + 5 = 13"
2. Have a conversation for 5-7 exchanges
3. **Observe**: Later responses should reference earlier exchanges

### ✅ Pass Criteria

- [ ] Tutor references previous student answers
- [ ] Conversation flows logically
- [ ] No repeated questions or loss of context

## Test 4: Different Problem Types

Try these additional problems to ensure robustness:

### Fractions
**Problem**: "1/3 + 1/4 = ?"
**Expected**: Guides toward common denominator without stating it

### Word Problem
**Problem**: "Sarah has 3 apples, gets 7 more, gives away 4. How many left?"
**Expected**: Helps translate words to operations without doing it

### Geometry
**Problem**: "What's the area of a rectangle with length 8 and width 5?"
**Expected**: Guides toward area formula through questions

## Validation Decision

### ✅ PASS - Proceed with Project

If all test criteria are met, PR-004 is validated. You may proceed to:
- PR-005: Response Evaluation and Hint System
- PR-006: Context Management Across Turns
- PR-007: Math Rendering Integration

### ❌ FAIL - Must Iterate

If any critical criteria fail, **DO NOT proceed**. Instead:

1. Document what failed in docs/PROMPTS.md
2. Iterate on system prompt in `src/services/openai.js`
3. Test again with same protocol
4. Consider trying different LLM provider if prompt iterations don't work

### Possible Iterations

**If giving direct answers**:
- Add more explicit prohibitions to system prompt
- Increase emphasis on "NEVER" rules
- Add examples of what NOT to do

**If questions too vague**:
- Add more specific question examples for each phase
- Refine the Socratic method flow descriptions

**If questions too specific (revealing answer)**:
- Adjust hint progression threshold
- Soften hint language

**If context loss**:
- Verify conversation history is properly passed
- Check message format conversion (user/assistant roles)
- Consider truncating very old messages

## Recording Results

After testing, document results in this file:

### Test Results

**Date**: ___________
**Tester**: ___________

**Test 1 (Basic Algebra)**: ☐ PASS ☐ FAIL
**Test 2 (Wrong Answers)**: ☐ PASS ☐ FAIL
**Test 3 (Multi-Turn)**: ☐ PASS ☐ FAIL
**Test 4 (Problem Types)**: ☐ PASS ☐ FAIL

**Overall Validation**: ☐ PASS ☐ FAIL

**Notes**:
```
[User to add observations here]
```

**Issues Found**:
```
[User to list any problems]
```

**Recommendation**:
☐ Proceed to next PRs
☐ Iterate on prompt (specify changes needed)
☐ Try different LLM provider

---

## For Next Agent

If validation PASSES:
- Mark PR-004 as complete in task-list.md
- Proceed with PR-005 or PR-006 (can be done in parallel)
- Note in progress.md that Socratic prompting is validated

If validation FAILS:
- DO NOT mark PR-004 as complete
- Document issues in PROMPTS.md
- Implement prompt iterations
- Re-test before proceeding
