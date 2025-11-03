# Technical Context

**Last Updated**: 2025-11-03 (PR-001)
**Status**: Foundation established
**Updated By**: Agent White

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 + Vite 6.0.5
  - **Rationale**: Fast dev server, modern tooling, simple SPA setup, large ecosystem
  - **Alternative considered**: Next.js (rejected - too heavyweight for MVP)
- **Styling**: CSS Modules
  - **Rationale**: Scoped styles, no extra dependencies, not Tailwind (per user constraint)
  - **Location**: `src/styles/` directory
- **Math Rendering**: TBD (deferred to PR-007, likely KaTeX or MathJax)
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
- `react@^18.3.1` - UI library
- `react-dom@^18.3.1` - React DOM rendering
- OpenAI SDK - TBD (will add in PR-002/PR-004 when integrating APIs)

### Dev Dependencies
- `vite@^6.0.5` - Build tool and dev server
- `@vitejs/plugin-react@^4.3.4` - Vite plugin for React
- `eslint@^9.17.0` - Code linting
- Various ESLint plugins for React

### To Be Added
- OpenAI SDK (PR-002 or PR-004)
- Math rendering library (PR-007): KaTeX or MathJax
- Any additional utilities as needed

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
