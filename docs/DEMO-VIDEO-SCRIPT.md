# Demo Video Script - AI Math Tutor

**Target Length:** 5 minutes
**Production URL:** https://math-tutor-jneff90za-grays-projects-783dc481.vercel.app (Full features on Vercel Pro)

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

### 5. Interactive Whiteboard (45 seconds)

**Script:**
> "The app also includes an interactive whiteboard for visual problem solving - perfect for geometry and graphing."

**Actions:**
1. Click "📐 Whiteboard" button in header
2. Draw a triangle with labeled sides (3, 4, 5)
3. Use shapes tool to add a rectangle
4. Demonstrate zoom (mouse wheel)
5. Pan around canvas (spacebar + drag or hand tool)
6. Close whiteboard
7. Reopen - show drawing persists

**Script during demo:**
> "This is powered by Excalidraw, giving you a full-featured drawing canvas. You can sketch geometry problems, graph functions, or visualize concepts. The canvas persists while you work through problems with the tutor.
>
> Note the guidance at the top - the tutor can't read the canvas directly, but it's a perfect visual workspace while you type questions to the tutor."

**Highlight:**
- Full drawing tools (pen, shapes, text)
- Zoom and pan
- State persistence
- Professional canvas feel

**Important note for recording:**
> "This whiteboard feature is fully functional in the production deployment. With Vercel Pro, the larger bundle size is not an issue, so you can test the complete interactive whiteboard right in the live demo!"

---

### 6. Math Rendering Showcase (30 seconds)

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

### 7. Error Handling Demo (30 seconds)

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

### 8. Responsive Design (15 seconds)

**Script:**
> "The app is fully responsive and works on desktop, tablet, and mobile."

**Actions:**
- Resize browser window to show responsive layout
- Or switch to phone and show mobile view

---

### 9. Wrap-up (45 seconds)

**Script:**
> "To recap, the AI Math Tutor:
> - Uses the Socratic method to guide students through problems
> - Supports both text and image input
> - Features an interactive whiteboard for visual problem solving
> - Renders beautiful math equations with KaTeX
> - Works across 8+ problem types from algebra to calculus
> - Never gives direct answers, helping students truly learn
>
> The full application is deployed on Vercel Pro with secure API key handling via serverless functions. You can try all features, including the interactive whiteboard, live at the link in the description.
>
> This project demonstrates how AI can transform math education through Socratic dialogue, and with modern deployment platforms, we can deliver rich, interactive experiences without compromise.
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
