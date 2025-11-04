# QA Checklist - PR-011 Deployment

**Production URL:** https://math-tutor-go4eke7pc-grays-projects-783dc481.vercel.app
**Deployment Date:** 2025-11-04
**Agent:** White

---

## Automated Checks ✅

- [x] Deployment status: **Ready** (Vercel)
- [x] Production URL accessible
- [x] Environment variables configured in Vercel
  - [x] OPENAI_API_KEY (server-side only, no VITE_ prefix)
  - [x] OPENAI_MODEL (gpt-4o-mini)
  - [x] OPENAI_VISION_MODEL (gpt-4o-mini)
- [x] Serverless functions deployed:
  - [x] `/api/chat.js` - Chat API proxy
  - [x] `/api/parse-image.js` - Image parsing proxy
- [x] `.env` not committed to repository (in `.gitignore`)
- [x] `.env.example` updated with new variable names
- [x] `vercel.json` configuration present
- [x] CORS headers configured in `vercel.json`

---

## Manual Testing Required 🧪

Please test the following on the production URL manually:

### Core Functionality

- [ ] **Text Input Works**
  - [ ] Type "2x + 5 = 13" and press Enter
  - [ ] Tutor responds with guiding question
  - [ ] Can continue multi-turn conversation
  - [ ] Math renders correctly (LaTeX notation)

- [ ] **Image Upload Works**
  - [ ] Click or drag-drop image upload area
  - [ ] Image uploads successfully
  - [ ] Text extracted from image (OCR working)
  - [ ] Conversation starts with extracted problem

- [ ] **Socratic Dialogue Quality**
  - [ ] Tutor asks questions (doesn't give direct answers)
  - [ ] Minimum 3 guiding questions per problem
  - [ ] Progressive hints when stuck (after 2+ wrong answers)
  - [ ] Celebrates correct answers
  - [ ] Maintains context across turns

- [ ] **Math Rendering**
  - [ ] Inline math displays correctly ($...$)
  - [ ] Block math displays correctly ($$...$$)
  - [ ] Fractions render: $\frac{1}{3}$
  - [ ] Exponents render: $x^2$
  - [ ] Symbols render: $\sqrt{16}$

### Error Handling

- [ ] **API Errors Handled**
  - [ ] Network error shows user-friendly message
  - [ ] "Try Again" button appears for recoverable errors
  - [ ] Retry mechanism works
  - [ ] No exposed stack traces or technical errors

- [ ] **Loading States**
  - [ ] Loading indicator shows during API calls
  - [ ] Loading text says "Thinking..." or similar
  - [ ] UI doesn't freeze during processing

### UI/UX

- [ ] **Responsive Design**
  - [ ] Desktop view (1920x1080): Layout looks good
  - [ ] Tablet view (768px): Responsive layout works
  - [ ] Mobile view (375px): Mobile-optimized layout
  - [ ] Text readable at all sizes
  - [ ] No horizontal scroll

- [ ] **Accessibility**
  - [ ] All buttons have clear labels
  - [ ] Chat messages have proper ARIA roles
  - [ ] Keyboard navigation works
  - [ ] Screen reader friendly (test with screen reader if available)

- [ ] **Visual Polish**
  - [ ] Messages clearly distinguished (user vs tutor)
  - [ ] Spacing and padding consistent
  - [ ] Colors have sufficient contrast
  - [ ] No visual glitches or overlaps

### Security

- [ ] **API Keys NOT Exposed**
  - [ ] Open DevTools → Network tab
  - [ ] Send a message
  - [ ] Check request to `/api/chat`
  - [ ] Verify NO OpenAI API key in request headers or body
  - [ ] Verify request goes to `/api/chat`, not directly to OpenAI

- [ ] **CORS Working**
  - [ ] No CORS errors in console
  - [ ] API requests succeed from production domain

### Performance

- [ ] **Load Times**
  - [ ] Initial page load < 3 seconds
  - [ ] First API request < 10 seconds (cold start acceptable)
  - [ ] Subsequent API requests < 5 seconds

- [ ] **Bundle Size**
  - [ ] Page loads without excessive delay
  - [ ] No unnecessarily large assets loaded

### Problem Types Tested

Test across multiple problem types:

- [ ] **Basic Algebra:** "2x + 5 = 13"
  - [ ] Dialogue flow works
  - [ ] Correct answer reached
  - [ ] No direct answers given

- [ ] **Fractions:** "1/3 + 1/4"
  - [ ] Common denominator guidance
  - [ ] LaTeX fractions render
  - [ ] Calculation verified correctly

- [ ] **Multi-Step:** "If 3x - 7 = 2x + 5, what is x + 10?"
  - [ ] Multiple steps guided
  - [ ] Context maintained
  - [ ] Final answer correct (22)

- [ ] **Word Problem:** "Sarah has 3 apples, gets 7 more, gives away 4. How many left?"
  - [ ] Problem parsing works
  - [ ] Socratic guidance clear
  - [ ] Arithmetic verified

---

## Known Issues

Document any issues found during testing:

### High Priority
- [ ] None found yet

### Medium Priority
- [ ] None found yet

### Low Priority
- [ ] None found yet

---

## Browser Compatibility

Test on multiple browsers:

- [ ] **Chrome/Edge** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (if available)
- [ ] **Mobile Safari** (iOS)
- [ ] **Mobile Chrome** (Android)

---

## Cost Monitoring

- [ ] **OpenAI Usage Dashboard**
  - [ ] Check usage at: https://platform.openai.com/usage
  - [ ] Verify costs are within expected range
  - [ ] Monthly budget limit set (recommended: $10-20 for testing)

- [ ] **Vercel Usage**
  - [ ] Check bandwidth usage
  - [ ] Check function invocations
  - [ ] Verify staying within free tier (100GB bandwidth)

---

## Documentation Verification

- [ ] **README.md**
  - [ ] Production URL listed correctly
  - [ ] Setup instructions accurate
  - [ ] Environment variables documented
  - [ ] Deployment section complete

- [ ] **DEPLOYMENT.md**
  - [ ] Step-by-step guide complete
  - [ ] Environment variable instructions clear
  - [ ] Troubleshooting section helpful

- [ ] **EXAMPLES.md**
  - [ ] 5+ example conversations present
  - [ ] Socratic method demonstrated
  - [ ] Various problem types covered

- [ ] **DEMO-VIDEO-SCRIPT.md**
  - [ ] Script comprehensive
  - [ ] All features covered
  - [ ] Timing realistic (5 minutes)

---

## Final Sign-Off

**QA Completed By:** _______________________
**Date:** _______________________
**Overall Status:** [ ] PASS [ ] FAIL [ ] NEEDS ATTENTION

**Notes:**
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

## Post-QA Actions

If QA passes:
- [ ] Record demo video following DEMO-VIDEO-SCRIPT.md
- [ ] Upload video and add link to README
- [ ] Update task-list.md: Mark PR-011 as Complete
- [ ] Commit and push all final changes
- [ ] Celebrate! 🎉 Core MVP is complete!

If QA fails:
- [ ] Document issues in "Known Issues" section above
- [ ] Create bug fixes as needed
- [ ] Redeploy and retest
- [ ] Repeat QA checklist

---

**Generated:** PR-011 (2025-11-04)
**Agent:** White
