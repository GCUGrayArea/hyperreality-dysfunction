# AI Math Tutor - Socratic Learning Assistant

An AI-powered math tutor that uses Socratic questioning to guide students through problem-solving without giving direct answers.

## Features

- **Problem Input**: Enter math problems via text or upload images
- **Socratic Dialogue**: AI asks guiding questions to help you discover solutions
- **Math Rendering**: Properly formatted mathematical equations
- **Multi-turn Conversations**: Maintains context across the dialogue

## Tech Stack

- **Frontend**: React + Vite
- **LLM**: OpenAI GPT-4 (with Vision for image parsing)
- **Styling**: CSS Modules
- **Math Rendering**: TBD (to be added in PR-007)

## Setup

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hyperreality-dysfunction/math-tutor
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
VITE_OPENAI_API_KEY=your_actual_api_key_here
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
math-tutor/
├── src/
│   ├── components/    # React components
│   ├── services/      # API integration (OpenAI)
│   ├── utils/         # Utility functions
│   ├── styles/        # CSS modules
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── .env.example       # Environment variable template
└── README.md          # This file
```

## Development Status

### Completed
- [x] PR-001: Project setup and structure

### In Progress
- [ ] PR-002: Image upload and parsing integration
- [ ] PR-003: Basic chat UI
- [ ] PR-004: LLM integration with Socratic prompts (CRITICAL VALIDATION)

See `docs/task-list.md` for full development roadmap.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Documentation

- [PRD](../docs/prd.md) - Product Requirements Document
- [Task List](../docs/task-list.md) - Development roadmap and PR tracking
- [Memory Bank](../docs/memory/) - Implementation wisdom and decisions

## License

MIT

## Contact

John Chen - john.chen@superbuilders.school
