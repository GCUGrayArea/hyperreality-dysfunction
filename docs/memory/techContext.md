# Technical Context

**Last Updated**: 2025-11-04 (PR-012)
**Status**: Stretch feature - Whiteboard added
**Updated By**: Agent White

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 + Vite 6.0.5
  - **Rationale**: Fast dev server, modern tooling, simple SPA setup, large ecosystem
  - **Alternative considered**: Next.js (rejected - too heavyweight for MVP)
- **Styling**: CSS Modules
  - **Rationale**: Scoped styles, no extra dependencies, not Tailwind (per user constraint)
  - **Location**: `src/styles/` directory
- **Math Rendering**: KaTeX (PR-007)
  - **Version**: Latest (installed via `npm install katex`)
  - **Rationale**: Faster than MathJax (~300KB vs ~1MB), synchronous rendering, better for interactive apps
  - **Syntax**: Supports inline `$...$` and block `$$...$$` LaTeX delimiters
  - **Location**: `src/utils/latexRenderer.js` (parsing/rendering), integrated in Message component
- **Interactive Whiteboard**: Excalidraw (PR-012 - Stretch Feature)
  - **Package**: @excalidraw/excalidraw
  - **Version**: Latest (added 222 packages)
  - **Rationale**: Most full-featured whiteboard library, easy integration, includes all drawing tools
  - **Features**: Pen, shapes (rectangle, circle, arrow), text, undo/redo, clear canvas
  - **Integration**: Overlay modal with backdrop, toggle button in header
  - **State Persistence**: Canvas state stored in Chat component, restored when reopened
  - **Location**: `src/components/Whiteboard.jsx`, integrated in Chat component
- **State Management**: React built-in (useState, useContext) for now
  - **Note**: May add Zustand if complexity increases

### Backend/API
- **LLM Provider**: OpenAI GPT-4
  - **Rationale**: Single API for both image parsing (GPT-4 Vision) and Socratic dialogue
  - **Models**:
    - GPT-4 Vision for image parsing
    - GPT-4 for Socratic dialogue
  - **Alternative considered**: Anthropic Claude (good at instruction-following, but requires separate OCR)
- **Image Parsing**: OpenAI GPT-4 Vision
  - **Rationale**: Integrated with LLM provider, handles printed math text well
  - **Starting focus**: Printed text (easier than handwritten)
- **API Layer**: Client-side API calls (no backend server needed for MVP)
  - **Rationale**: Simpler deployment, fewer moving parts
  - **Note**: API key in .env (not committed), passed via Vite env vars
- **Hosting**: TBD (deferred to PR-011)

### Development
- **Package Manager**: npm
- **Build Tool**: Vite 6.0.5
- **Version Control**: Git
- **Node Version**: 18+ required

---

## Constraints

### User Preferences
- **NO Tailwind CSS**: Must use alternative styling solution
- **Sound notification**: PowerShell command for task completion notifications

### Technical Constraints
- Must handle API rate limiting
- Must protect API keys (no commits to repo)
- Target platforms: Desktop/tablet (mobile optional)
- Must support common image formats (PNG, JPG, WEBP)

### Performance Requirements
- Image parsing >90% accuracy on printed text
- Responsive chat (not laggy)
- Math rendering must be readable

---

## Setup Requirements

### Environment Variables Needed
- `VITE_OPENAI_API_KEY` - OpenAI API key (required)
- `VITE_OPENAI_MODEL` - Model for Socratic dialogue (optional, defaults to gpt-4)
- `VITE_OPENAI_VISION_MODEL` - Model for image parsing (optional, defaults to gpt-4-vision-preview)

**Note**: All environment variables must be prefixed with `VITE_` to be accessible in the browser via Vite.

### Development Setup

1. **Install dependencies**:
   ```bash
   cd math-tutor
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your VITE_OPENAI_API_KEY
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```
   - Dev server runs on `http://localhost:5173`
   - Hot module replacement (HMR) enabled

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## Known Limitations

### Current (PR-001)
- API key exposed in client-side code (acceptable for MVP, consider proxy for production)
- No rate limiting implemented yet (will add in future PRs)
- Image parsing optimized for printed text only (handwritten support stretch goal)

### Future Considerations
- May need backend API proxy to hide OpenAI key in production
- Context window limits for long conversations (will address in PR-006)

---

## Dependencies

### Core Dependencies (from package.json)
- `react@^19.1.1` - UI library
- `react-dom@^19.1.1` - React DOM rendering
- `openai@^6.7.0` - OpenAI API client (added in PR-002)
- `katex@latest` - Math rendering library (added in PR-007)
- `@excalidraw/excalidraw@latest` - Interactive whiteboard library (added in PR-012)

### Dev Dependencies
- `vite@^7.1.7` - Build tool and dev server
- `@vitejs/plugin-react@^5.0.4` - Vite plugin for React
- `eslint@^9.36.0` - Code linting
- Various ESLint plugins for React

---

## Project Structure

```
math-tutor/
├── src/
│   ├── components/      # React components (Chat, Message, Input, Upload, etc.)
│   ├── services/        # API integration (OpenAI client, image parsing, etc.)
│   ├── utils/           # Utility functions (helpers, constants, etc.)
│   ├── styles/          # CSS Modules (*.module.css files)
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── .env.example         # Environment variable template
├── .env                 # Local environment variables (gitignored)
├── .gitignore           # Git ignore rules (includes .env)
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # Setup and usage instructions
```

---

## Notes

### PR-001 Decisions Made
- **Frontend**: React + Vite for speed and simplicity
- **LLM**: OpenAI GPT-4 (single provider for vision + dialogue)
- **Architecture**: Client-side SPA (no backend needed for MVP)
- **Styling**: CSS Modules (not Tailwind per user constraint)

### For Future Agents
Update this file when:
- New dependencies are added (note version and rationale)
- Configuration changes (document what and why)
- Limitations discovered (add to Known Limitations section)
- Performance characteristics observed
- Architecture decisions made

### PR-002 Decisions Made (2025-11-03)
- **Image Upload**: Drag-drop + click-to-upload using native HTML5 File API
- **File Validation**: Client-side validation for type (PNG/JPG/WEBP/GIF) and size (20MB max)
- **Image Parsing**: OpenAI GPT-4 Vision (model: gpt-4o) with prompt optimized for math text extraction
- **Base64 Encoding**: Using FileReader API to convert images to base64 for OpenAI API
- **UI Integration**: Image upload shown initially, hidden after first problem submitted
- **Error Handling**: Graceful fallbacks with user-friendly error messages
- **OpenAI SDK**: Added openai package for vision and chat capabilities

### PR-007 Decisions Made (2025-11-03)
- **Math Rendering Library**: KaTeX (chosen over MathJax)
  - **Rationale**: Faster rendering, smaller bundle (~300KB vs ~1MB), synchronous API
- **LaTeX Syntax**: Inline `$...$` and block `$$...$$` delimiters
  - **Note**: `\(...\)` and `\[...\]` not supported (can add if needed)
- **Parsing Strategy**: Custom parser in `latexRenderer.js` that splits text into text/math parts
  - **Rationale**: Full control over parsing, easier to debug than regex-only approach
- **Error Handling**: Graceful degradation with `throwOnError: false`
  - **Display**: Failed LaTeX shows in red with error styling, doesn't break UI
- **Security**: `trust: false` in KaTeX config disables potentially dangerous commands like `\href`
- **Integration Point**: Message component only (no changes to LLM integration needed)

### PR-012 Decisions Made (2025-11-04) - Stretch Feature
- **Whiteboard Library**: Excalidraw (chosen for completeness and ease of use)
  - **Rationale**: Most full-featured option, includes all drawing tools out of the box, great UX
  - **Alternatives considered**: Fabric.js (too low-level), plain HTML5 Canvas (too much work)
- **UI Pattern**: Overlay modal with backdrop
  - **Toggle Button**: Located in header (desktop) or full-width (mobile)
  - **Backdrop**: Click-to-close on darkened background
  - **Fixed Position**: Centers on screen, responsive sizing (90vw x 85vh)
- **State Management**: Canvas data stored in Chat component state
  - **Persistence**: Canvas persists across open/close within same session
  - **No backend**: State lives in memory only (resets on page refresh)
- **Tool Configuration**: Minimal UI mode
  - **Enabled**: Pen, shapes (rectangle, circle, arrow), text, undo/redo, clear canvas
  - **Disabled**: Image import, export, theme switching (simplified for MVP)
- **Responsive Design**: Full-screen on mobile (<768px), windowed on desktop
- **Bundle Size Impact**: ~222 packages added (~2-3MB uncompressed, ~500KB gzipped)
