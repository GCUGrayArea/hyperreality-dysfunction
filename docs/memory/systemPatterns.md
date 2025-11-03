# System Patterns

**Last Updated**: 2025-11-03
**Status**: Initialized - No implementation yet

## Architecture Decisions

*This file will track architectural patterns and decisions as they're made during implementation.*

### Planned Patterns

**Socratic Dialogue Flow**:
- Parse → Inventory → Identify Goal → Guide Method → Step Through → Validate
- Never reveal direct answers
- Progressive hint system after 2+ stuck turns
- Encouraging language throughout

**Validation Gate Pattern**:
- PR-004 acts as critical validation gate
- Must prove Socratic prompting works before building more features
- Iterate on prompts/provider until validation passes

### Decisions To Be Made

**Frontend Architecture**: TBD in PR-001
**State Management**: TBD based on complexity needs
**Context Management**: TBD in PR-004/PR-006
**Error Handling Strategy**: TBD in PR-008

---

## Component Patterns

*To be populated during implementation*

---

## Integration Patterns

*To be populated during implementation*

---

## Notes

This file will be updated by implementing agents as architectural patterns emerge and decisions are made. Focus areas:
- How Socratic prompts are structured
- How context is managed across turns
- How image parsing integrates with chat
- How math rendering is triggered
- Error handling strategies
