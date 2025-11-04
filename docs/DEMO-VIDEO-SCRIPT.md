# Demo Video Script - AI Math Tutor

**Target Length:** 5 minutes
**Production URL:** https://math-tutor-go4eke7pc-grays-projects-783dc481.vercel.app

---

## Equipment Needed

- **Screen recording software:** OBS Studio, QuickTime, Loom, or similar
- **Microphone:** Built-in or external for voiceover
- **Browser:** Chrome or Firefox (for best compatibility)
- **Sample problems:** Prepared in advance (see below)

---

## Video Structure

### 1. Introduction (30 seconds)

**Script:**
> "Hi! I'm going to show you the AI Math Tutor - a Socratic learning assistant that helps students solve math problems without giving direct answers.
>
> This tutor uses the Socratic method, meaning it guides you through questions to help you discover solutions yourself. It's powered by OpenAI GPT-4o with function calling for accurate math verification.
>
> Let me show you how it works."

**Visuals:**
- Show homepage with chat interface
- Briefly highlight key features

---

### 2. Text Input Workflow (1 minute)

**Script:**
> "First, let's try entering a problem directly as text. I'll type a simple algebra problem: '2x + 5 = 13'"

**Actions:**
1. Type "2x + 5 = 13" in chat input
2. Press Enter/Send
3. Show tutor's first guiding question
4. Answer: "We're trying to find x"
5. Show next question about isolating x
6. Answer: "Subtract 5 from both sides"
7. Continue dialogue briefly (2-3 more exchanges)

**Script:**
> "Notice how the tutor never gives me the answer directly. Instead, it asks questions that help me think through each step. This is the Socratic method in action."

**Highlight:**
- LaTeX math rendering ($2x + 5 = 13$)
- Encouraging language from tutor
- Step-by-step guidance

---

### 3. Image Upload and Parsing (1 minute)

**Prep:** Have a printed math problem image ready (e.g., "1/3 + 1/4" handwritten or typed)

**Script:**
> "The tutor can also extract problems from images using GPT-4 Vision. Let me upload a photo of a math problem."

**Actions:**
1. Click upload area or drag-drop image
2. Show loading state
3. Show extracted text: "1/3 + 1/4"
4. Continue with Socratic dialogue

**Script:**
> "The Vision API extracted the problem accurately, and now the tutor is guiding me through finding a common denominator."

**Highlight:**
- Image upload UX
- OCR accuracy
- Seamless transition to dialogue

---

### 4. Full Socratic Dialogue (2 minutes)

**Prep:** Use a moderately complex problem that showcases the Socratic method well

**Recommended problem:** "If 3x - 7 = 2x + 5, what is x + 10?"

**Script:**
> "Let me show a more complex multi-step problem to demonstrate the full Socratic dialogue."

**Actions:**
1. Enter problem: "If 3x - 7 = 2x + 5, what is x + 10?"
2. Follow tutor's guidance through:
   - Understanding what we're solving for
   - Isolating x (subtract 2x from both sides)
   - Simplifying (x - 7 = 5)
   - Solving for x (x = 12)
   - Finding x + 10 (22)
3. Show tutor's celebration when correct answer is reached

**Script during dialogue:**
> "The tutor is breaking this down step by step. Notice how it:
> - Asks what I need to find
> - Guides me to the right operations
> - Verifies my arithmetic using its calculator tool
> - Celebrates when I get steps correct
> - Never just tells me the answer"

**Highlight:**
- Progressive hint system (if you deliberately give wrong answer)
- Calculator verification (show console if possible: "🧮 LLM is using calculator")
- Context maintenance across multiple turns
- Encouraging feedback

---

### 5. Math Rendering Showcase (30 seconds)

**Script:**
> "The tutor uses KaTeX for beautiful math rendering. Let me show a problem with complex notation."

**Recommended problem:** "Find the derivative of 3x² + 2x - 5"

**Actions:**
1. Enter calculus problem
2. Show LaTeX rendering of:
   - $\frac{d}{dx}(3x^2 + 2x - 5)$
   - Power rule explanation
   - Final answer: $6x + 2$

**Highlight:**
- Inline math ($...$)
- Block math ($$...$$)
- Fractions, exponents, symbols

---

### 6. Error Handling Demo (30 seconds)

**Script:**
> "The system also has robust error handling. Let me show what happens if there's an issue."

**Actions:**
1. (Optional) Simulate error by disconnecting internet briefly
2. Show error message with "Try Again" button
3. Click retry
4. Show successful recovery

**Highlight:**
- User-friendly error messages
- Retry mechanism
- Graceful degradation

---

### 7. Responsive Design (15 seconds)

**Script:**
> "The app is fully responsive and works on desktop, tablet, and mobile."

**Actions:**
- Resize browser window to show responsive layout
- Or switch to phone and show mobile view

---

### 8. Wrap-up (30 seconds)

**Script:**
> "To recap, the AI Math Tutor:
> - Uses the Socratic method to guide students through problems
> - Supports both text and image input
> - Renders beautiful math equations
> - Works across 8+ problem types from algebra to calculus
> - Never gives direct answers, helping students truly learn
>
> The app is deployed on Vercel with secure API key handling via serverless functions.
>
> You can try it yourself at the link in the description, or deploy your own instance following the deployment guide.
>
> Thanks for watching!"

**Visuals:**
- Show URL on screen
- Quick scroll through README or documentation
- End card with:
  - Production URL
  - GitHub repo link
  - Contact info

---

## Recording Tips

1. **Prepare problems in advance** - Have them typed/written ready to avoid delays
2. **Practice the flow** - Do a dry run to ensure smooth transitions
3. **Clear audio** - Use a quiet space and good microphone
4. **Screen resolution** - 1920x1080 recommended for clarity
5. **Cursor visibility** - Make sure cursor is visible for actions
6. **Zoom in** - Zoom browser to 110-125% for better visibility in video
7. **Edit out pauses** - Use editing software to tighten pacing
8. **Add captions** - Consider adding text overlays for key points

---

## Sample Problems to Use

1. **Algebra:** 2x + 5 = 13
2. **Fractions:** 1/3 + 1/4
3. **Multi-step:** If 3x - 7 = 2x + 5, what is x + 10?
4. **Word problem:** Sarah has 3 apples, gets 7 more, gives away 4. How many left?
5. **Geometry:** Area of rectangle with length 8 and width 5
6. **Calculus:** Find derivative of 3x² + 2x - 5

---

## Post-Production

1. **Export settings:** 1080p, 60fps (or 30fps minimum)
2. **File format:** MP4 (H.264 codec)
3. **Upload to:** YouTube, Vimeo, or Loom
4. **Add to README:** Update README.md with video link

---

## Video Checklist

Before recording:
- [ ] Production URL accessible and working
- [ ] Sample problems prepared
- [ ] Screen recording software tested
- [ ] Microphone tested
- [ ] Browser zoom set to 110-125%
- [ ] Browser DevTools closed (unless showing console)

During recording:
- [ ] Clear audio narration
- [ ] Smooth cursor movements
- [ ] Show loading states
- [ ] Demonstrate error handling
- [ ] Show mobile responsiveness

After recording:
- [ ] Edit out long pauses
- [ ] Add intro/outro
- [ ] Add captions/text overlays (optional)
- [ ] Export in high quality
- [ ] Upload and share link

---

**Good luck with your demo video!** 🎥
