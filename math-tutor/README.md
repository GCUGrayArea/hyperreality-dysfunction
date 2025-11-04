# AI Math Tutor - Socratic Learning Assistant

An AI-powered math tutor that uses the Socratic method to guide students through problem-solving without giving direct answers. The tutor asks guiding questions, provides progressive hints, and helps students discover solutions themselves.

## Features

### Core Functionality
- **Problem Input**: Enter math problems via text or upload images (GPT-4 Vision powered)
- **Socratic Dialogue**: AI asks guiding questions to help you discover solutions
- **Math Rendering**: LaTeX-based equation rendering with KaTeX
- **Multi-turn Conversations**: Maintains full context across dialogue
- **Response Evaluation**: Detects correct/incorrect answers with calculator verification
- **Progressive Hints**: Hints become more concrete after 2+ wrong answers
- **Problem Tracking**: Automatically detects new problems and resets context

### Advanced Features
- **Calculator Function Calling**: LLM uses calculator tool to verify all arithmetic before responding
- **Factoring Verification**: Checks both sum AND product when validating factors
- **Self-Correction Detection**: Recognizes when students catch their own errors
- **Error Handling**: Comprehensive error detection with retry mechanism
- **Accessibility**: ARIA labels, semantic HTML, screen reader support
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18.3 + Vite 6.0
- **LLM**: OpenAI GPT-4o (with Vision for image parsing)
- **Math Rendering**: KaTeX 0.16.11
- **Styling**: CSS Modules
- **Function Calling**: OpenAI SDK 6.7.0 with calculator tool integration
- **Math Evaluation**: Custom expression parser with safe evaluation

## Setup

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hyperreality-dysfunction/math-tutor
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
VITE_OPENAI_API_KEY=your_actual_api_key_here
VITE_OPENAI_MODEL=gpt-4o
VITE_OPENAI_VISION_MODEL=gpt-4o
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### Text Input
1. Type a math problem in the chat input
2. Press Enter or click Send
3. Follow the tutor's guiding questions
4. The tutor will help you discover the solution step-by-step

### Image Upload
1. Click the upload area or drag and drop an image
2. The tutor will extract the math problem using GPT-4 Vision
3. Follow the Socratic dialogue as with text input

### Supported Problem Types

The tutor has been validated on:
- ✅ Basic algebra (e.g., "2x + 5 = 13")
- ✅ Fractions (e.g., "1/3 + 1/4")
- ✅ Word problems (e.g., "Sarah has 3 apples...")
- ✅ Geometry (e.g., "Area of rectangle with length 8...")
- ✅ Multi-step algebra (e.g., "If 3x - 7 = 2x + 5, what is x + 10?")
- ✅ Systems of equations (e.g., "x + y = 10 and x - y = 2")
- ✅ Quadratic equations (e.g., "x² - 5x + 6 = 0")
- ✅ Basic calculus (e.g., "Find derivative of 3x² + 2x")

## Project Structure

```
math-tutor/
├── src/
│   ├── components/           # React components
│   │   ├── Chat.jsx          # Main chat container
│   │   ├── ChatInput.jsx     # Message input component
│   │   ├── Message.jsx       # Message display component
│   │   └── ImageUpload.jsx   # Image upload component
│   ├── services/             # API integration
│   │   └── openai.js         # OpenAI service (Vision, Chat, Function Calling)
│   ├── utils/                # Utility functions
│   │   ├── latexRenderer.js  # LaTeX parsing and KaTeX rendering
│   │   └── mathEvaluator.js  # Safe math expression evaluation
│   ├── styles/               # CSS modules
│   │   ├── Chat.module.css
│   │   ├── ChatInput.module.css
│   │   ├── Message.module.css
│   │   └── ImageUpload.module.css
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── .env.example              # Environment variable template
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Development Status

### Completed (9/11 Core PRs)
- ✅ PR-001: Project setup and structure
- ✅ PR-002: Image upload and parsing integration
- ✅ PR-003: Basic chat UI
- ✅ PR-004: LLM integration with Socratic prompts (VALIDATED)
- ✅ PR-005: Response evaluation and hint system
- ✅ PR-006: Context management and problem tracking
- ✅ PR-007: Math rendering integration (KaTeX)
- ✅ PR-008: UI polish and error handling
- ✅ PR-009: Multi-problem testing and fixes (ALL TESTS PASS)

### Next Steps
- ⏳ PR-010: Documentation (current)
- ⏳ PR-011: Deployment and demo video

See [docs/task-list.md](../docs/task-list.md) for full development roadmap.

## Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## Documentation

- [EXAMPLES.md](../docs/EXAMPLES.md) - Example conversations showing Socratic dialogue
- [PROMPTS.md](../docs/PROMPTS.md) - Prompt engineering notes and iterations
- [PRD](../docs/prd.md) - Product Requirements Document
- [Task List](../docs/task-list.md) - Development roadmap and PR tracking
- [Memory Bank](../docs/memory/) - Implementation wisdom and decisions
- [Testing Results](../docs/TESTING-PR-009.md) - Comprehensive test results

## Architecture Highlights

### Socratic Prompt Engineering
The system uses a carefully engineered prompt (v1.7) that:
- Prohibits giving direct answers through multiple explicit rules
- Enforces calculator verification for all arithmetic
- Provides progressive hints when students are stuck
- Maintains encouraging, patient tone throughout

See [docs/PROMPTS.md](../docs/PROMPTS.md) for full prompt engineering details and iteration history.

### Function Calling Architecture
The tutor uses OpenAI's function calling feature to access a calculator tool:
1. Student provides answer with arithmetic (e.g., "3 + 7 = 10")
2. LLM calls `calculate("3 + 7")` to verify
3. LLM receives result: `{success: true, result: 10}`
4. LLM responds based on verification (celebrates if correct, guides if wrong)

This ensures accurate math verification and prevents false celebrations of incorrect answers.

### Context Management
- Full conversation history maintained in state
- Problem detection with regex patterns
- Stuck count tracking for hint progression
- Automatic reset on new problem detection

## Testing

The system has been validated through:
- **Phase 1**: 5 required + 3 extended problem types (all PASS)
- **Phase 2**: Stress testing (wrong answers, context switching, long conversations)
- **Known Issues**: 1 High severity bug found and fixed (factoring verification)

See [docs/TESTING-PR-009.md](../docs/TESTING-PR-009.md) for complete test results.

## API Costs

Approximate costs per conversation (based on GPT-4o pricing):
- **Text problem**: ~$0.01-0.02 per conversation (5-10 exchanges)
- **Image problem**: Add ~$0.01 for GPT-4 Vision parsing
- **Calculator calls**: No additional cost (included in completion)

Note: Costs may vary based on conversation length and problem complexity.

## Known Limitations

1. **Context Window**: Very long conversations (20+ exchanges) may approach token limits
2. **Image Quality**: Handwritten problems may have lower OCR accuracy than printed text
3. **Advanced Math**: System validated on K-12 and early college math; advanced topics may need prompt refinement
4. **Calculator Limitations**: Safe expression parser supports basic arithmetic only (no symbolic algebra)

## Future Improvements

Potential enhancements (see PR-012-014 in task list):
- Interactive whiteboard for visual explanations
- Voice interface (text-to-speech and speech-to-text)
- Step-by-step visualization with animations
- Multi-language support
- Problem type detection and specialized prompts

## Contributing

This is an educational project developed as part of the Superbuilders School curriculum. For questions or feedback, see contact information below.

## License

MIT

## Contact

John Chen - john.chen@superbuilders.school

## Acknowledgments

- Built with [React](https://react.dev/) and [Vite](https://vitejs.dev/)
- Math rendering by [KaTeX](https://katex.org/)
- Powered by [OpenAI GPT-4o](https://openai.com/gpt-4)
