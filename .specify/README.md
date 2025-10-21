# .specify/ - Spec-Driven Development Configuration

This directory contains the configuration and templates for spec-driven development in the Tetris project.

## Directory Structure

```
.specify/
├── memory/
│   └── constitution.md          # Project principles and governance
├── templates/
│   ├── plan-template.md         # Implementation plan template
│   ├── spec-template.md         # Feature specification template
│   ├── tasks-template.md        # Task breakdown template
│   ├── commands/                # Command definitions (future)
│   └── contracts/               # API contract templates (future)
└── README.md                    # This file
```

## Core Files

### constitution.md

The project constitution defines the foundational principles and governance for the Tetris project. It includes:

- **Core Principles**: 5 key principles that guide all development decisions
  1. Simplicity First
  2. Test-Driven Development
  3. User Experience Focus
  4. Performance by Design
  5. Maintainable Code

- **Governance**: Amendment procedures, versioning policy, and compliance review process

**Location**: `.specify/memory/constitution.md`
**Current Version**: 1.0.0

### Templates

#### spec-template.md

Used to create feature specifications. Each spec includes:
- User stories with priorities (P1, P2, P3)
- Acceptance scenarios (Given-When-Then format)
- Functional requirements
- Key entities (data models)
- Success criteria

**Usage**: Copy this template to `specs/[###-feature-name]/spec.md` when starting a new feature.

#### plan-template.md

Used to create implementation plans. Each plan includes:
- Technical context (language, frameworks, platform)
- Constitution check (validates compliance with principles)
- Project structure (directory layout)
- Complexity tracking (justifies any principle violations)

**Usage**: Created after specification, documents the "how" of implementation.

#### tasks-template.md

Used to break down features into actionable tasks. Organizes tasks by:
- User story (US1, US2, US3)
- Phase (Setup → Foundational → User Stories → Polish)
- Dependencies (parallel [P] vs sequential)
- Checkpoints (validate story independence)

**Usage**: Created after planning, provides step-by-step implementation guide.

## Workflow

### 1. Specification Phase

```bash
# Create feature directory
mkdir -p specs/001-core-gameplay

# Copy spec template
cp .specify/templates/spec-template.md specs/001-core-gameplay/spec.md

# Fill in specification
# - Define user stories with priorities
# - Write acceptance scenarios
# - List functional requirements
# - Define success criteria
```

### 2. Planning Phase

```bash
# Copy plan template
cp .specify/templates/plan-template.md specs/001-core-gameplay/plan.md

# Fill in implementation plan
# - Research technical approach
# - Perform constitution check
# - Design project structure
# - Justify any complexity
```

### 3. Task Breakdown Phase

```bash
# Copy tasks template
cp .specify/templates/tasks-template.md specs/001-core-gameplay/tasks.md

# Break down into tasks
# - Organize by user story
# - Mark parallel opportunities [P]
# - Define clear dependencies
# - Add checkpoints
```

### 4. Implementation Phase

```bash
# Create feature branch
git checkout -b 001-core-gameplay

# Work through tasks sequentially
# - Write tests first (TDD)
# - Implement one task at a time
# - Commit after each task/group
# - Validate at checkpoints
```

## Constitution Check

Before starting any feature, verify compliance with the constitution:

1. **Simplicity Check**: Is the solution as simple as possible?
2. **Testing Check**: Are tests planned before implementation?
3. **UX Check**: Are performance budgets defined?
4. **Performance Check**: Are success criteria measurable?
5. **Maintainability Check**: Is code structure clear?

Any violations must be justified in the plan's "Complexity Tracking" table.

## Version Control

- Constitution changes trigger version bumps (semantic versioning)
- Template updates must maintain backward compatibility
- Sync Impact Reports document cross-file changes
- All changes tracked in git history

## Best Practices

### Specification
- Prioritize user stories (P1 = MVP)
- Make stories independently testable
- Use concrete acceptance scenarios
- Mark unclear requirements as "NEEDS CLARIFICATION"

### Planning
- Research before designing
- Validate against constitution
- Document structure decisions
- Justify any complexity

### Task Breakdown
- One task = one file or logical unit
- Mark parallel tasks with [P]
- Tag with user story (US1, US2, etc.)
- Include exact file paths

### Implementation
- Tests before code (TDD)
- Commit frequently
- Validate at checkpoints
- Update docs when behavior changes

## Future Enhancements

- Command definitions for automated workflows
- Contract templates for API design
- Integration with CI/CD
- Automated constitution validation

---

**Maintained by**: Project maintainers
**Last Updated**: 2025-10-21
