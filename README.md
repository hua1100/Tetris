# Tetris

A classic Tetris game implementation following spec-driven development principles.

## Project Status

**Current Phase**: Initial Setup
**Constitution Version**: 1.0.0
**Development Branch**: `claude/init-github-spec-011CUKyFp6sMQKe77cfXtCwM`

## Development Approach

This project follows **Spec-Driven Development (SDD)** using the GitHub Spec Kit methodology. All features are developed through a structured process:

1. **Specification** - Define what to build and why
2. **Planning** - Research and design the implementation
3. **Task Breakdown** - Create actionable, testable tasks
4. **Implementation** - Build features incrementally with tests
5. **Validation** - Verify against acceptance criteria

## Project Structure

```
Tetris/
├── .specify/                    # Spec-driven development configuration
│   ├── memory/
│   │   └── constitution.md      # Project principles and governance
│   └── templates/
│       ├── plan-template.md     # Implementation plan template
│       ├── spec-template.md     # Feature specification template
│       └── tasks-template.md    # Task breakdown template
├── specs/                       # Feature specifications (created per feature)
├── src/                         # Source code (to be created)
├── tests/                       # Test suites (to be created)
└── docs/                        # Additional documentation
```

## Core Principles

This project follows 5 core principles defined in `.specify/memory/constitution.md`:

1. **Simplicity First** - Prioritize simple solutions over complex ones
2. **Test-Driven Development** - Write tests before implementation
3. **User Experience Focus** - Responsive controls and smooth gameplay
4. **Performance by Design** - 60 FPS target, <16ms input latency
5. **Maintainable Code** - Clear, documented, and consistent code style

## Getting Started

### Prerequisites

- To be determined based on implementation plan

### Development Workflow

1. **Create a Feature Specification**
   - Use `.specify/templates/spec-template.md` as a template
   - Define user stories with acceptance criteria
   - Specify functional requirements and success metrics

2. **Create an Implementation Plan**
   - Use `.specify/templates/plan-template.md` as a template
   - Research technical approach
   - Perform constitution check
   - Design data models and contracts

3. **Break Down into Tasks**
   - Use `.specify/templates/tasks-template.md` as a template
   - Organize tasks by user story
   - Identify parallel opportunities
   - Define clear dependencies

4. **Implement Incrementally**
   - Write tests first (TDD)
   - Implement one user story at a time
   - Validate independently before moving on
   - Commit frequently with clear messages

## Constitution

All development decisions must align with the project constitution. Key governance rules:

- Complex solutions require explicit justification
- Critical game mechanics must have tests written first
- Performance budgets (60 FPS, 16ms latency) are non-negotiable
- Code must prioritize clarity over brevity

See `.specify/memory/constitution.md` for full details.

## Contributing

Contributions must follow the spec-driven development process:

1. Propose changes via feature specification
2. Discuss and refine requirements
3. Create implementation plan with constitution check
4. Implement with tests following the tasks breakdown
5. Submit pull request with specification reference

## License

To be determined

## Roadmap

### Phase 1: Core Game Mechanics (Planned)
- Game board rendering
- Tetromino pieces and movement
- Collision detection
- Line clearing
- Scoring system

### Phase 2: Enhanced Features (Planned)
- Next piece preview
- Hold piece functionality
- Pause/resume
- Level progression

### Phase 3: Polish (Planned)
- Sound effects and music
- Ghost piece preview
- High score persistence
- Visual themes

---

**Note**: This project is in initial setup phase. Game implementation will follow once the first feature specification is created.
