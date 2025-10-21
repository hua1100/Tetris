<!--
Sync Impact Report:
Version: 1.0.0 (Initial Constitution)
Changes:
- Initial constitution creation for Tetris project
- Established 5 core principles: Simplicity First, Test-Driven Development, User Experience Focus, Performance by Design, Maintainable Code
- Defined governance and amendment procedures
- All templates (plan, spec, tasks) aligned with initial principles
Templates Status:
✅ .specify/templates/plan-template.md - aligned
✅ .specify/templates/spec-template.md - aligned
✅ .specify/templates/tasks-template.md - aligned
Follow-up TODOs: None
-->

# Tetris Project Constitution

**Project Name**: Tetris
**Constitution Version**: 1.0.0
**Ratification Date**: 2025-10-21
**Last Amended Date**: 2025-10-21

---

## Purpose

This constitution establishes the foundational principles and governance for the Tetris project. It ensures that all development, design, and architectural decisions align with our core values of simplicity, quality, and user satisfaction.

---

## Core Principles

### Principle 1: Simplicity First

**Declaration**: All code, architecture, and features MUST prioritize simplicity over cleverness. Complex solutions require explicit justification in the implementation plan.

**Rationale**: Tetris is a classic game with well-defined mechanics. Over-engineering reduces maintainability and increases the barrier to contribution. Simple code is easier to understand, test, and extend.

**Rules**:
- Use vanilla solutions before adding frameworks or libraries
- Limit project depth: maximum 3 nested projects/modules
- Avoid design patterns unless solving a concrete, recurring problem
- Document any complexity with "Why Needed" justification

### Principle 2: Test-Driven Development

**Declaration**: Critical game mechanics MUST have tests written before implementation. Tests MUST fail before code is written to make them pass.

**Rationale**: Tetris has precise rules (rotation, collision, line clearing) that are easy to break with changes. TDD ensures specifications are clear and regressions are caught immediately.

**Rules**:
- Write contract tests for game mechanics (piece movement, rotation, collision)
- Write integration tests for user workflows (start game → play → game over)
- All tests MUST fail initially, proving they test the intended behavior
- Bug fixes MUST include a regression test

### Principle 3: User Experience Focus

**Declaration**: Game responsiveness and feel MUST be prioritized. Performance budgets and UX requirements are non-negotiable.

**Rationale**: Tetris gameplay quality depends on precise, responsive controls. A laggy or unresponsive game is unplayable regardless of feature completeness.

**Rules**:
- Controls MUST respond within 16ms (60 FPS target)
- Game MUST run at consistent 60 FPS on target platforms
- User testing MUST validate game "feel" before features are considered complete
- Performance degradation is a blocking bug

### Principle 4: Performance by Design

**Declaration**: Performance considerations MUST be addressed during design, not as an afterthought. Performance requirements MUST be specified in feature specs.

**Rationale**: Retrofitting performance into a poorly designed system is expensive and error-prone. Tetris requires consistent frame timing and responsive input handling.

**Rules**:
- Feature specs MUST include performance success criteria (frame rate, input latency)
- Implementation plans MUST identify performance-critical code paths
- Performance testing MUST be part of acceptance criteria
- Performance requirements MUST be validated before feature completion

### Principle 5: Maintainable Code

**Declaration**: Code MUST be written for future maintainers. Clarity MUST be prioritized over brevity.

**Rationale**: The project may be maintained by different developers over time. Clear, well-documented code reduces onboarding time and prevents bugs from misunderstanding.

**Rules**:
- Use descriptive variable and function names
- Add comments explaining "why" not "what"
- Follow consistent code style (enforced by linters)
- Refactor before adding features to complex code
- Update documentation when behavior changes

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

### Compliance Review

- Feature plans MUST include "Constitution Check" section
- Constitution violations MUST be justified in "Complexity Tracking" table
- Major features MUST be reviewed against all principles before Phase 0
- Re-check compliance after Phase 1 (design) before implementation begins

### Modification Authority

- **Project Owner**: Final authority on constitutional amendments
- **Contributors**: May propose amendments and participate in discussion
- **Automated Systems**: May flag potential violations but cannot override

---

## Scope & Application

- **Applies to**: All code, documentation, and design decisions in the Tetris project
- **Exceptions**: Experimental branches may deviate with explicit justification
- **Enforcement**: Via code review, automated linting, and plan validation
- **Living Document**: This constitution evolves with the project needs

---

## Definitions

- **MUST**: Absolute requirement, violations block merging
- **SHOULD**: Strong recommendation, deviations require justification
- **MAY**: Optional, at discretion of implementer
- **Critical Path**: Code that runs every frame or handles user input
- **Performance Budget**: Quantified limits (FPS, latency, memory) specified in feature specs

---

**End of Constitution v1.0.0**
