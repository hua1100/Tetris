# Tasks: Two-Player Battle Mode

**Input**: Design documents from `/specs/002-two-player-battle/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/BattleGame.md

**Tests**: Tests are included following TDD approach as specified in project constitution

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Source structure: `src/models/`, `src/game/`, `src/rendering/`, `src/utils/`
- Test structure: `tests/unit/`, `tests/integration/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for battle mode

- [x] T001 Create tests/integration/ directory for battle flow tests
- [x] T002 [P] Add battle mode constants to src/utils/Constants.js (GARBAGE_COLOR, ATTACK_TABLE, COMBO_BONUS, GameMode, PLAYER1_KEY_BINDINGS, PLAYER2_KEY_BINDINGS)
- [x] T003 [P] Add helper function getComboBonus(combo) to src/utils/Constants.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core Grid and Game extensions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests (TDD - Write First)

- [x] T004 [P] Write Grid garbage line tests in tests/unit/Grid.test.js (addGarbageLines, createGarbageLine, canAddGarbageLines)
- [x] T005 [P] Write Game attack info tests in tests/unit/Game.test.js (getLastClearedLines, addGarbageLines)

### Implementation

- [x] T006 Implement Grid.addGarbageLines(count) in src/models/Grid.js
- [x] T007 Implement Grid.createGarbageLine() in src/models/Grid.js
- [x] T008 Implement Grid.canAddGarbageLines(count) in src/models/Grid.js
- [x] T009 Add Game.lastClearedLines field initialization in src/game/Game.js constructor
- [x] T010 Update Game.clearLines() to record lastClearedLines in src/game/Game.js
- [x] T011 Implement Game.getLastClearedLines() in src/game/Game.js
- [x] T012 Implement Game.addGarbageLines(count) in src/game/Game.js

### Verification

- [x] T013 Run tests: npm test -- tests/unit/Grid.test.js (verify garbage line methods pass)
- [x] T014 Run tests: npm test -- tests/unit/Game.test.js (verify attack info methods pass)

**Checkpoint**: Foundation ready - Grid supports garbage lines, Game exposes attack info. User story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Dual Gameplay Area (Priority: P1) 🎯 MVP

**Goal**: 兩位玩家可以在同一畫面上同時遊玩，各自控制自己的方塊，看到彼此的遊戲狀態

**Independent Test**: 兩位玩家同時遊玩，各自獨立遊玩並看到對方的進度（即使沒有攻擊系統）

### Tests for User Story 1 (TDD - Write First)

- [x] T015 [P] [US1] Write BattleGame initialization tests in tests/unit/BattleGame.test.js
- [x] T016 [P] [US1] Write BattleGame lifecycle tests (start, pause, resume) in tests/unit/BattleGame.test.js
- [x] T017 [P] [US1] Write BattleGame dual player update tests in tests/unit/BattleGame.test.js

### Implementation for User Story 1

- [x] T018 [US1] Create BattleGame class skeleton in src/game/BattleGame.js (constructor with player1, player2, attackQueue1, attackQueue2, winner, isRunning fields)
- [x] T019 [US1] Implement BattleGame.start() in src/game/BattleGame.js (start both players, set isRunning = true)
- [x] T020 [US1] Implement BattleGame.pause() in src/game/BattleGame.js (pause both players)
- [x] T021 [US1] Implement BattleGame.resume() in src/game/BattleGame.js (resume both players, reset lastUpdateTime)
- [x] T022 [US1] Implement BattleGame.update(deltaTime) in src/game/BattleGame.js (update both players)
- [x] T023 [US1] Implement BattleGame.getPlayer(num) in src/game/BattleGame.js
- [x] T024 [US1] Implement BattleGame.getWinner() in src/game/BattleGame.js

### Rendering for User Story 1

- [x] T025 [P] [US1] Create BattleRenderer class in src/rendering/BattleRenderer.js (dual canvas rendering with offsets)
- [x] T026 [P] [US1] Implement BattleRenderer.render(battleGame) in src/rendering/BattleRenderer.js (render both players side-by-side)
- [x] T027 [P] [US1] Update GridRenderer to support garbage color visual in src/rendering/GridRenderer.js

### Input Routing for User Story 1

- [x] T028 [US1] Create battle mode input router in src/main.js (single listener with player routing using PLAYER1_KEY_BINDINGS and PLAYER2_KEY_BINDINGS)
- [x] T029 [US1] Add mode selection UI in index.html (single player button, battle mode button)
- [x] T030 [US1] Wire mode selection to BattleGame initialization in src/main.js

### Verification

- [x] T031 [US1] Run tests: npm test -- tests/unit/BattleGame.test.js (verify US1 functionality)
- [ ] T032 [US1] Manual test: Start battle mode, verify two players can control independently, see each other's game state

**Checkpoint**: At this point, User Story 1 should be fully functional - two players playing independently

---

## Phase 4: User Story 2 - Attack System (Priority: P2)

**Goal**: 玩家消除 2 行以上時對對手發送垃圾行攻擊

**Independent Test**: 一位玩家消除多行，觀察對手底部是否出現垃圾行

### Tests for User Story 2 (TDD - Write First)

- [x] T033 [P] [US2] Write attack calculation tests in tests/unit/BattleGame.test.js (calculateGarbage for various lines cleared and combo)
- [x] T034 [P] [US2] Write attack queue tests in tests/unit/BattleGame.test.js (sendGarbageToPlayer, queue management)
- [x] T035 [P] [US2] Write attack processing tests in tests/unit/BattleGame.test.js (processAttacks integration)

### Implementation for User Story 2

- [x] T036 [US2] Implement BattleGame.calculateGarbage(linesCleared, combo) in src/game/BattleGame.js (use ATTACK_TABLE and getComboBonus)
- [x] T037 [US2] Implement BattleGame.sendGarbageToPlayer(playerNum, garbageCount) in src/game/BattleGame.js (add to attack queue)
- [x] T038 [US2] Implement BattleGame.processAttacks() in src/game/BattleGame.js (check cleared lines, calculate garbage, send to opponent, process queue)
- [x] T039 [US2] Call processAttacks() from BattleGame.update() in src/game/BattleGame.js

### Rendering for User Story 2

- [x] T040 [P] [US2] Add attack queue length display to BattleRenderer in src/rendering/BattleRenderer.js (show incoming garbage indicator)
- [x] T041 [P] [US2] Add visual effects for garbage lines in GridRenderer in src/rendering/GridRenderer.js (distinguish from normal blocks)

### Verification

- [x] T042 [US2] Run tests: npm test -- tests/unit/BattleGame.test.js (verify attack system)
- [ ] T043 [US2] Manual test: Player clears 2+ lines, verify opponent receives garbage at bottom

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - players can attack each other with garbage lines

---

## Phase 5: User Story 3 - Game End Conditions (Priority: P3)

**Goal**: 玩家失敗時判定勝負並顯示結果

**Independent Test**: 故意讓一位玩家堆滿方塊，測試勝負判定

### Tests for User Story 3 (TDD - Write First)

- [ ] T044 [P] [US3] Write game over detection tests in tests/unit/BattleGame.test.js (checkGameOver for single loss, double loss)
- [ ] T045 [P] [US3] Write game over integration test in tests/integration/BattleFlow.test.js (full game to victory)

### Implementation for User Story 3

- [ ] T046 [US3] Implement BattleGame.checkGameOver() in src/game/BattleGame.js (detect player1/player2 game over, set winner)
- [ ] T047 [US3] Call checkGameOver() from BattleGame.update() in src/game/BattleGame.js
- [ ] T048 [US3] Handle GridOverflowError in sendGarbageToPlayer() in src/game/BattleGame.js (set winner when overflow)

### Rendering for User Story 3

- [ ] T049 [US3] Create game over screen UI in index.html (winner display, statistics, restart button)
- [ ] T050 [US3] Implement game over display logic in BattleRenderer in src/rendering/BattleRenderer.js (show winner, final scores)
- [ ] T051 [US3] Wire restart button to reset BattleGame in src/main.js

### Verification

- [ ] T052 [US3] Run tests: npm test -- tests/unit/BattleGame.test.js (verify game end logic)
- [ ] T053 [US3] Run tests: npm test -- tests/integration/BattleFlow.test.js (verify full flow)
- [ ] T054 [US3] Manual test: Cause player1 to lose, verify player2 wins and result screen shows correctly

**Checkpoint**: All core battle features working - dual play, attacks, victory conditions

---

## Phase 6: User Story 4 - Combo System Enhancement (Priority: P4)

**Goal**: 連擊增加攻擊力，顯示連擊數

**Independent Test**: 玩家連續消除多次，測試連擊計數和額外垃圾行

### Tests for User Story 4 (TDD - Write First)

- [ ] T055 [P] [US4] Write combo tracking tests in tests/unit/Game.test.js (combo increment, reset on no clear)
- [ ] T056 [P] [US4] Write combo bonus tests in tests/unit/BattleGame.test.js (verify garbage calculation with combo)

### Implementation for User Story 4

- [ ] T057 [US4] Verify Game.combo tracking works correctly in src/game/Game.js (already implemented, just verify)
- [ ] T058 [US4] Verify BattleGame.calculateGarbage uses combo in src/game/BattleGame.js (already implemented via getComboBonus)
- [ ] T059 [US4] Implement BattleGame.getCombo(playerNum) in src/game/BattleGame.js (expose player combo)

### Rendering for User Story 4

- [ ] T060 [US4] Add combo display to UIRenderer in src/rendering/UIRenderer.js (show "X Combo" with special effects for 10+)
- [ ] T061 [US4] Update BattleRenderer to show both players' combos in src/rendering/BattleRenderer.js

### Verification

- [ ] T062 [US4] Run tests: npm test -- tests/unit/Game.test.js (verify combo tracking)
- [ ] T063 [US4] Run tests: npm test -- tests/unit/BattleGame.test.js (verify combo bonus in attacks)
- [ ] T064 [US4] Manual test: Achieve 5+ combo, verify extra garbage is sent and combo is displayed

**Checkpoint**: All user stories complete - full battle mode with combo system

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T065 [P] Add Logger events for battle mode in src/game/Logger.js (BATTLE_START, ATTACK_SENT, etc.)
- [ ] T066 [P] Update CLAUDE.md with battle mode architecture
- [ ] T067 [P] Add battle mode documentation to README.md (controls, features)
- [ ] T068 Run full test suite: npm test (verify all 469 tests pass including new ones)
- [ ] T069 Run test coverage: npm test -- --coverage (verify >80% coverage maintained)
- [ ] T070 Manual QA: Test all edge cases from spec (simultaneous clears, garbage overflow, pause behavior)
- [ ] T071 Performance validation: Verify 60 FPS maintained with two players
- [ ] T072 Code review: Check all code follows project style (ESLint, Prettier)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed) or sequentially (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 BattleGame but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US1/US2 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Enhances US2 attacks but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Models/Core before Services/Logic
- Logic before Rendering
- Rendering before Integration
- Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T002 and T003 can run in parallel (different sections of Constants.js)

**Foundational Phase (Phase 2)**:
- T004 and T005 can run in parallel (different test files)
- Once tests exist: T006-T012 can be worked on by different developers in parallel

**User Story 1 (Phase 3)**:
- T015, T016, T017 can run in parallel (different test suites)
- T025, T026, T027 can run in parallel (different renderer files)

**User Story 2 (Phase 4)**:
- T033, T034, T035 can run in parallel (different test suites)
- T040 and T041 can run in parallel (different renderer files)

**User Story 3 (Phase 5)**:
- T044 and T045 can run in parallel (unit vs integration tests)

**User Story 4 (Phase 6)**:
- T055 and T056 can run in parallel (different test files)

**Polish Phase (Phase 7)**:
- T065, T066, T067 can run in parallel (different files)

**Cross-Story Parallelization**:
- After Foundational completes, different developers can work on US1, US2, US3, US4 simultaneously
- Example: Developer A works on US1, Developer B works on US2 tests

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write BattleGame initialization tests in tests/unit/BattleGame.test.js"
Task: "Write BattleGame lifecycle tests in tests/unit/BattleGame.test.js"
Task: "Write BattleGame dual player update tests in tests/unit/BattleGame.test.js"

# Launch all rendering tasks for User Story 1 together:
Task: "Create BattleRenderer class in src/rendering/BattleRenderer.js"
Task: "Implement BattleRenderer.render in src/rendering/BattleRenderer.js"
Task: "Update GridRenderer for garbage visual in src/rendering/GridRenderer.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~30 min)
2. Complete Phase 2: Foundational (~2 hours) - CRITICAL
3. Complete Phase 3: User Story 1 (~4 hours)
4. **STOP and VALIDATE**: Test dual gameplay independently
5. Deploy/demo battle mode MVP

**Estimated MVP Time**: ~6.5 hours

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Grid + Game ready for battle
2. **MVP** (+Phase 3) → Two players playing side-by-side ✅
3. **Core Battle** (+Phase 4) → Attack system working ✅
4. **Complete Game** (+Phase 5) → Win/loss conditions ✅
5. **Enhanced** (+Phase 6) → Combo system ✅
6. **Production** (+Phase 7) → Polished and tested ✅

Each increment adds value without breaking previous features.

### Parallel Team Strategy

With multiple developers:

1. **Together**: Complete Setup + Foundational (Phases 1-2)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (US1)
   - Developer B: User Story 2 (US2) - can start tests/planning while A works
   - Developer C: User Story 3 (US3) - can start tests/planning
3. Stories complete and integrate independently
4. **Together**: Polish phase validation

---

## Notes

- [P] tasks = different files, no dependencies = can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **TDD Workflow**: Write test → Verify it fails (red) → Implement → Verify it passes (green) → Refactor
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Run `npm test` frequently to ensure no regressions
- Use `npm run dev` to manually test in browser
- Refer to quickstart.md for detailed TDD examples

---

## Task Count Summary

- **Setup**: 3 tasks
- **Foundational**: 11 tasks (blocks all stories)
- **User Story 1**: 18 tasks (MVP)
- **User Story 2**: 11 tasks
- **User Story 3**: 11 tasks
- **User Story 4**: 10 tasks
- **Polish**: 8 tasks

**Total**: 72 tasks

**Parallel Opportunities**: 20+ tasks marked [P] can run in parallel
**Critical Path**: Setup → Foundational → US1 → US2 → US3 → US4 → Polish (if sequential)
**Suggested MVP**: Phases 1-3 (32 tasks, ~6.5 hours)
