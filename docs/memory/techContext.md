# Technical Context

**Last Updated**: 2025-11-03
**Status**: Initialized - No implementation yet

## Tech Stack

*To be determined during PR-001*

### Frontend
- Framework: TBD
- Styling: TBD (Constraint: NO Tailwind CSS)
- Math Rendering: TBD (likely KaTeX or MathJax)
- State Management: TBD

### Backend/API
- LLM Provider: TBD (OpenAI, Anthropic, or other)
- Image Parsing: TBD (Vision LLM or OCR service)
- API Layer: TBD
- Hosting: TBD

### Development
- Package Manager: TBD
- Build Tool: TBD
- Version Control: Git (confirmed)

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

*To be documented during PR-001*

### Environment Variables Needed
- LLM API keys
- Image parsing API keys (if separate)
- Other service credentials (TBD)

### Development Setup
- Installation steps: TBD
- Build commands: TBD
- Test commands: TBD
- Dev server: TBD

---

## Known Limitations

*To be populated during implementation*

---

## Dependencies

*To be populated during PR-001*

---

## Notes

This file will be updated by the agent working on PR-001 (Project Setup) with:
- Chosen tech stack and rationale
- Setup instructions
- Dependencies and versions
- Configuration details
- Any discovered constraints or limitations

Future agents should update this file when:
- New dependencies are added
- Configuration changes
- Limitations discovered
- Performance characteristics observed
