<!--
Sync Impact Report:
Version: 1.0.0 → 1.1.0 (MINOR version bump)
Amendment Date: 2025-10-21
Changes:
- Enhanced Principle 1 (Simplicity First): Added explicit "clarity over cleverness" requirement
- Enhanced Principle 4 (Performance by Design): Added "readability over premature optimization" clause
- Enhanced Principle 5 (Maintainable Code): Strengthened "readability over optimization" stance
- NEW Principle 6 (Intent-Driven Development): Code must express intent clearly
- NEW Principle 7 (Observability & Structured Logging): Mandatory structured logging with ILogger<T>
- Added Documentation Language Policy: All specs, plans, and user-facing docs MUST use Traditional Chinese
- Updated Governance section with language requirements
Templates Status:
✅ .specify/templates/plan-template.md - aligned (constitution check references updated principles)
✅ .specify/templates/spec-template.md - aligned (no changes needed)
✅ .specify/templates/tasks-template.md - aligned (logging tasks may be required per Principle 7)
Follow-up TODOs:
- Consider adding Traditional Chinese template versions
- Update existing README.md to Traditional Chinese (optional for consistency)
-->

# Tetris Project Constitution

**Project Name**: Tetris
**Constitution Version**: 1.1.0
**Ratification Date**: 2025-10-21
**Last Amended Date**: 2025-10-21

---

## Purpose

This constitution establishes the foundational principles and governance for the Tetris project. It ensures that all development, design, and architectural decisions align with our core values of simplicity, quality, user satisfaction, and maintainability.

---

## Core Principles

### Principle 1: Simplicity First

**Declaration**: All code, architecture, and features MUST prioritize simplicity over cleverness, and clarity over complexity. Complex solutions require explicit justification in the implementation plan.

**Rationale**: Tetris is a classic game with well-defined mechanics. Over-engineering reduces maintainability and increases the barrier to contribution. Simple, clear code is easier to understand, test, and extend. Clever code that saves lines but obscures intent violates this principle.

**Rules**:
- Prioritize clarity over cleverness in all implementation decisions
- Use vanilla solutions before adding frameworks or libraries
- Limit project depth: maximum 3 nested projects/modules
- Avoid design patterns unless solving a concrete, recurring problem
- Document any complexity with "Why Needed" justification
- Reject solutions that are "too clever" even if they are shorter

### Principle 2: Test-Driven Development

**Declaration**: All new features MUST follow Test-Driven Development (TDD). Tests MUST be written before implementation code. Tests MUST fail before code is written to make them pass.

**Rationale**: Tetris has precise rules (rotation, collision, line clearing) that are easy to break with changes. TDD ensures specifications are clear, requirements are testable, and regressions are caught immediately. Red-Green-Refactor is mandatory, not optional.

**Rules**:
- ALL new features MUST have tests written before any implementation code
- Write contract tests for game mechanics (piece movement, rotation, collision)
- Write integration tests for user workflows (start game → play → game over)
- All tests MUST fail initially (RED), proving they test the intended behavior
- Implementation makes tests pass (GREEN)
- Refactor only after tests pass, maintaining green state
- Bug fixes MUST include a regression test written first
- No feature is "complete" without passing tests

### Principle 3: User Experience Focus

**Declaration**: Game responsiveness and feel MUST be prioritized. Performance budgets and UX requirements are non-negotiable.

**Rationale**: Tetris gameplay quality depends on precise, responsive controls. A laggy or unresponsive game is unplayable regardless of feature completeness.

**Rules**:
- Controls MUST respond within 16ms (60 FPS target)
- Game MUST run at consistent 60 FPS on target platforms
- User testing MUST validate game "feel" before features are considered complete
- Performance degradation is a blocking bug

### Principle 4: Performance by Design

**Declaration**: Performance considerations MUST be addressed during design, not as an afterthought. However, readability MUST NOT be sacrificed for premature optimization. Performance requirements MUST be specified in feature specs.

**Rationale**: Retrofitting performance into a poorly designed system is expensive and error-prone. Tetris requires consistent frame timing and responsive input handling. However, optimizing before understanding bottlenecks leads to unmaintainable code. Measure first, then optimize with clarity.

**Rules**:
- Feature specs MUST include performance success criteria (frame rate, input latency)
- Implementation plans MUST identify performance-critical code paths
- Readability over premature optimization: optimize only measured bottlenecks
- Performance testing MUST be part of acceptance criteria
- Performance requirements MUST be validated before feature completion
- Document performance-critical sections and why they are optimized

### Principle 5: Maintainable Code

**Declaration**: Code MUST be written for future maintainers. Clarity and readability MUST be prioritized over brevity and micro-optimizations.

**Rationale**: The project may be maintained by different developers over time. Clear, well-documented code reduces onboarding time and prevents bugs from misunderstanding. Code is read 10x more than it is written—optimize for reading.

**Rules**:
- Readability over optimization: clear code beats clever code
- Use descriptive variable and function names
- Add comments explaining "why" not "what"
- Follow consistent code style (enforced by linters)
- Refactor before adding features to complex code
- Update documentation when behavior changes
- Prefer self-documenting code over inline comments where possible

### Principle 6: Intent-Driven Development

**Declaration**: All code MUST clearly express its intent. Function names, variable names, and code structure MUST communicate purpose without requiring deep inspection. Implementation details may be hidden, but intent must be obvious.

**Rationale**: Understanding "what the code is trying to do" should be immediate. Intent-driven code reduces cognitive load, catches logic errors earlier (because intent mismatches are visible), and serves as living documentation.

**Rules**:
- Function and method names MUST describe intent, not implementation (e.g., `detectCollision()` not `checkOverlap()`)
- Variable names MUST reveal purpose (e.g., `fallingPiece` not `p`)
- Code structure MUST reflect business logic flow
- Abstractions MUST match domain concepts (e.g., `Tetromino`, `Grid`, `ScoreCalculator`)
- Magic numbers MUST be named constants explaining their meaning
- Boolean variables MUST read like natural language questions (e.g., `isGameOver`, `canRotate`)

### Principle 7: Observability & Structured Logging

**Declaration**: All modules MUST output structured logs. All API requests (if applicable) MUST be logged using `ILogger<T>` or equivalent structured logging framework. Logs MUST be machine-readable and contain sufficient context for debugging production issues.

**Rationale**: Debugging Tetris game logic (especially timing-sensitive issues like rotation, collision, line clearing) requires visibility into state changes. Structured logs enable filtering, aggregation, and correlation. Unstructured logs ("something happened") are insufficient for production diagnostics.

**Rules**:
- Every module MUST implement structured logging
- Use `ILogger<T>` (or language-specific equivalent) for all logging
- Log key game events: piece spawn, movement, rotation, collision, line clear, game over
- Include context in logs: timestamp, game state, piece type, position, player input
- Use appropriate log levels: Debug, Info, Warning, Error, Critical
- API requests (if any) MUST log: endpoint, method, status code, response time, errors
- Logs MUST be machine-parseable (JSON or structured format preferred)
- Performance-critical paths MAY use conditional logging to avoid overhead

---

## Governance

### Amendment Procedure

1. **Proposal**: Any contributor may propose a constitutional amendment via pull request to this file
2. **Discussion**: Amendments require discussion period (minimum 7 days for major changes)
3. **Approval**: Project maintainer(s) must approve amendments
4. **Version Bump**: Version follows semantic versioning:
   - **MAJOR** (X.0.0): Principle removal/redefinition, breaking governance changes
   - **MINOR** (1.X.0): New principles added, material guidance expansion
   - **PATCH** (1.0.X): Clarifications, typo fixes, non-semantic refinements
5. **Sync**: Update dependent templates (plan, spec, tasks) and add Sync Impact Report

### Versioning Policy

- All versions tracked in git history
- Breaking changes require migration guide
- Version number appears at top of this document
- Sync Impact Report prepended as HTML comment after each update

### Documentation Language Policy

**Requirement**: All specifications, implementation plans, and user-facing documentation MUST be written in **Traditional Chinese (繁體中文)**.

**Rationale**: Ensures consistency and accessibility for the primary development team and user base.

**Scope**:
- Feature specifications (`specs/*/spec.md`)
- Implementation plans (`specs/*/plan.md`)
- Task breakdowns (`specs/*/tasks.md`)
- User-facing documentation (`README.md`, `docs/`)
- Code comments explaining business logic SHOULD use Traditional Chinese where appropriate

**Exceptions**:
- Technical terms and code identifiers remain in English (e.g., `function`, `class`, `Tetromino`)
- Template files may remain in English for reference
- Internal development notes MAY use English for technical discussions
- Error messages and logs MAY use English for compatibility with debugging tools

### Compliance Review

- Feature plans MUST include "Constitution Check" section
- Constitution violations MUST be justified in "Complexity Tracking" table
- Major features MUST be reviewed against all 7 principles before Phase 0
- Re-check compliance after Phase 1 (design) before implementation begins
- Logging implementation (Principle 7) MUST be verified in code review

### Modification Authority

- **Project Owner**: Final authority on constitutional amendments
- **Contributors**: May propose amendments and participate in discussion
- **Automated Systems**: May flag potential violations but cannot override

---

## Scope & Application

- **Applies to**: All code, documentation, and design decisions in the Tetris project
- **Exceptions**: Experimental branches may deviate with explicit justification
- **Enforcement**: Via code review, automated linting, plan validation, and logging audits
- **Living Document**: This constitution evolves with the project needs

---

## Definitions

- **MUST**: Absolute requirement, violations block merging
- **SHOULD**: Strong recommendation, deviations require justification
- **MAY**: Optional, at discretion of implementer
- **Critical Path**: Code that runs every frame or handles user input
- **Performance Budget**: Quantified limits (FPS, latency, memory) specified in feature specs
- **Intent-Driven**: Code structure and naming that reveals purpose without deep inspection
- **Structured Logging**: Machine-readable logs with consistent format and contextual metadata
- **ILogger<T>**: Generic logging interface (C#/.NET style) or language-specific equivalent

---

**End of Constitution v1.1.0**
