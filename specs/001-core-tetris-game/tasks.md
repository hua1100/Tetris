---
description: "俄羅斯方塊核心遊戲任務分解"
---

# 任務清單：俄羅斯方塊核心遊戲

**輸入**: 設計文檔來自 `/specs/001-core-tetris-game/`
**先決條件**: plan.md（必需）, spec.md（必需，使用者故事）, research.md, data-model.md, contracts/

**測試**: 本專案採用測試驅動開發（TDD），所有任務都包含測試。

**組織方式**: 任務按使用者故事分組，確保每個故事可獨立實作與測試。

---

## 格式說明：`[ID] [P?] [Story] 描述`

- **[P]**: 可並行執行（不同檔案，無依賴關係）
- **[Story]**: 所屬使用者故事（例如 US1, US2, US3）
- 包含確切的檔案路徑

## 路徑慣例

- **單一專案**: `src/`, `tests/` 位於專案根目錄
- 所有路徑皆為相對於專案根目錄的絕對路徑

---

## Phase 1：專案設置（共享基礎設施）

**目的**: 專案初始化與基本結構建立

- [ ] T001 建立專案根目錄結構（src/, tests/, docs/）
- [ ] T002 初始化 Vite 專案與 package.json（`npm create vite@latest`）
- [ ] T003 [P] 配置 Jest 測試框架（jest.config.js, babel 設定）
- [ ] T004 [P] 配置 ESLint 與 Prettier（.eslintrc.js, .prettierrc）
- [ ] T005 [P] 建立 vite.config.js（開發伺服器配置）
- [ ] T006 建立 index.html 主頁面與基本 Canvas 元素
- [ ] T007 建立 src/main.js 進入點（初始化遊戲）

**檢查點**: 專案環境就緒 - 可執行 `npm run dev` 和 `npm test`

---

## Phase 2：基礎設施（阻塞性先決條件）

**目的**: 核心基礎設施，所有使用者故事開始前必須完成

**⚠️ 關鍵**: 在此階段完成前，使用者故事無法開始

- [ ] T008 [P] 建立 src/utils/Constants.js（遊戲常數、顏色、方塊形狀定義）
- [ ] T009 [P] 建立 src/game/Logger.js（結構化日誌系統，符合憲法原則 7）
- [ ] T010 [P] 建立 tests/helpers/testUtils.js（測試輔助函數）
- [ ] T011 為 Logger 撰寫單元測試 tests/unit/Logger.test.js

**檢查點**: 基礎設施就緒 - 使用者故事實作可開始並行進行

---

## Phase 3：使用者故事 1 - 方塊顯示與自動下落（優先級: P1）🎯 MVP

**目標**: 玩家能看到遊戲板和正在下落的方塊，方塊會自動向下移動

**獨立測試**: 啟動遊戲後，可以看到 10x20 的遊戲板和一個自動下落的方塊

### 測試任務（US1）⚠️ 先寫測試，確保失敗後再實作

- [ ] T012 [P] [US1] 為 Position 撰寫單元測試 tests/unit/Position.test.js
- [ ] T013 [P] [US1] 為 Grid 撰寫單元測試 tests/unit/Grid.test.js
- [ ] T014 [P] [US1] 為 Tetromino 撰寫單元測試 tests/unit/Tetromino.test.js
- [ ] T015 [US1] 為 GameState 撰寫單元測試 tests/unit/GameState.test.js

### 實作任務（US1）

- [ ] T016 [P] [US1] 建立 Position 值對象 src/models/Position.js
- [ ] T017 [P] [US1] 建立 Grid 類別 src/models/Grid.js
- [ ] T018 [US1] 建立 Tetromino 類別 src/models/Tetromino.js（依賴 T016, Constants）
- [ ] T019 [US1] 建立 TetrominoFactory 隨機生成器 src/models/TetrominoFactory.js
- [ ] T020 [US1] 建立 GameState 類別 src/game/GameState.js（依賴 T017, T018）
- [ ] T021 [US1] 建立 Game 主控制器 src/game/Game.js（依賴 T020）
- [ ] T022 [US1] 實作遊戲循環 Game.update() 與自動下落邏輯
- [ ] T023 [P] [US1] 建立 Renderer 主渲染器 src/rendering/Renderer.js
- [ ] T024 [P] [US1] 建立 GridRenderer 遊戲板渲染 src/rendering/GridRenderer.js
- [ ] T025 [P] [US1] 建立 TetrominoRenderer 方塊渲染 src/rendering/TetrominoRenderer.js
- [ ] T026 [US1] 建立 UIRenderer UI 元素渲染 src/rendering/UIRenderer.js（分數、等級顯示）
- [ ] T027 [US1] 整合渲染系統到 Game.render()
- [ ] T028 [US1] 在 main.js 中初始化並啟動遊戲循環

**檢查點**: 此時使用者故事 1 應完全可運作且可獨立測試 - 方塊自動下落並固定於底部

---

## Phase 4：使用者故事 3 - 碰撞檢測（優先級: P1）🎯 MVP

**目標**: 方塊移動或旋轉時，系統能正確檢測碰撞，防止穿越邊界

**為何在 US2 之前**: 碰撞檢測是輸入處理的前置條件

**獨立測試**: 嘗試將方塊移出邊界，系統應阻止非法移動

### 測試任務（US3）⚠️

- [ ] T029 [P] [US3] 為 CollisionDetector 撰寫單元測試 tests/unit/CollisionDetector.test.js
- [ ] T030 [US3] 撰寫碰撞整合測試 tests/integration/CollisionSystem.test.js

### 實作任務（US3）

- [ ] T031 [US3] 建立 CollisionDetector 系統 src/systems/CollisionDetector.js
- [ ] T032 [US3] 實作 isValidPosition() 方法（檢查邊界與方塊重疊）
- [ ] T033 [US3] 實作 canMoveLeft(), canMoveRight(), canMoveDown() 輔助方法
- [ ] T034 [US3] 實作 canRotate() 方法（含簡化版牆踢）
- [ ] T035 [US3] 整合碰撞檢測到 Game.update()（方塊下落時檢查）
- [ ] T036 [US3] 為碰撞事件添加結構化日誌

**檢查點**: 此時碰撞檢測系統完全運作 - 方塊無法穿越邊界或其他方塊

---

## Phase 5：使用者故事 2 - 方塊操作（優先級: P1）🎯 MVP

**目標**: 玩家可以使用鍵盤控制下落中的方塊

**依賴**: US3（碰撞檢測必須先完成）

**獨立測試**: 按下左/右/旋轉鍵可看到方塊回應

### 測試任務（US2）⚠️

- [ ] T037 [P] [US2] 為 InputHandler 撰寫單元測試 tests/unit/InputHandler.test.js
- [ ] T038 [US2] 撰寫輸入處理整合測試 tests/integration/InputHandling.test.js

### 實作任務（US2）

- [ ] T039 [US2] 建立 InputHandler 類別 src/input/InputHandler.js
- [ ] T040 [US2] 實作鍵盤事件監聽（方向鍵 + WASD）
- [ ] T041 [US2] 實作輸入指令轉換（鍵盤 → InputCommand 枚舉）
- [ ] T042 [US2] 實作輸入延遲測量（<16ms 要求）
- [ ] T043 [US2] 在 Game 中實作 handleInput() 方法
- [ ] T044 [US2] 整合 CollisionDetector 驗證移動合法性
- [ ] T045 [US2] 實作方塊移動邏輯（左、右、加速下落）
- [ ] T046 [US2] 實作方塊旋轉邏輯（含牆踢）
- [ ] T047 [US2] 為輸入事件添加結構化日誌（PIECE_MOVE, PIECE_ROTATE, INPUT_LAG）
- [ ] T048 [US2] 在 main.js 中註冊輸入處理器

**檢查點**: 此時使用者故事 2 完全可運作 - 玩家可完整控制方塊

---

## Phase 6：使用者故事 6 - 七種方塊類型（優先級: P1）🎯 MVP

**目標**: 確保所有七種標準方塊（I, O, T, S, Z, J, L）正確實作

**注意**: 這部分實際上在 T018（Tetromino 類別）時已實作，此階段主要是驗證與完善

**獨立測試**: 多次重新開始遊戲，所有七種形狀都會隨機出現

### 測試任務（US6）⚠️

- [ ] T049 [P] [US6] 為每種方塊類型撰寫詳細測試 tests/unit/TetrominoTypes.test.js
- [ ] T050 [US6] 撰寫旋轉系統測試 tests/integration/RotationSystem.test.js（測試所有方塊的 4 個旋轉狀態）

### 實作任務（US6）

- [ ] T051 [US6] 驗證 Constants.js 中七種方塊形狀定義完整且正確
- [ ] T052 [US6] 驗證 Constants.js 中七種方塊顏色正確
- [ ] T053 [US6] 驗證 TetrominoFactory 隨機分佈均勻
- [ ] T054 [US6] 視覺驗證：手動測試每種方塊的 4 個旋轉狀態顯示正確
- [ ] T055 [US6] 為方塊生成事件添加結構化日誌（PIECE_SPAWN）

**檢查點**: 所有七種方塊類型正確實作並可獨立驗證

---

## 🎯 MVP 檢查點

**在進入 Phase 7 之前，驗證 MVP 完整性**：

- [ ] **驗證 1**: 遊戲可啟動並顯示 10x20 遊戲板
- [ ] **驗證 2**: 七種方塊隨機生成並自動下落
- [ ] **驗證 3**: 玩家可用鍵盤控制方塊（左、右、旋轉、加速下落）
- [ ] **驗證 4**: 碰撞檢測正確（無法穿越邊界或其他方塊）
- [ ] **驗證 5**: 方塊可旋轉且牆踢正常運作
- [ ] **驗證 6**: 遊戲維持 60 FPS（無卡頓）
- [ ] **驗證 7**: 輸入延遲 <16ms（回應靈敏）
- [ ] **驗證 8**: 所有關鍵事件已記錄結構化日誌

**✅ MVP 完成！可先部署給使用者測試，或繼續開發 P2 功能**

---

## Phase 7：使用者故事 4 - 消行機制與計分（優先級: P2）

**目標**: 當橫列被完全填滿時消除並計分

**獨立測試**: 手動放置方塊直到某行填滿，觀察該行消失並獲得分數

### 測試任務（US4）⚠️

- [ ] T056 [P] [US4] 為 RowClearer 撰寫單元測試 tests/unit/RowClearer.test.js
- [ ] T057 [P] [US4] 為 ScoreCalculator 撰寫單元測試 tests/unit/ScoreCalculator.test.js
- [ ] T058 [US4] 撰寫消行整合測試 tests/integration/LineClearingFlow.test.js

### 實作任務（US4）

- [ ] T059 [US4] 建立 RowClearer 系統 src/systems/RowClearer.js
- [ ] T060 [US4] 實作 isRowComplete() 檢查橫列是否已滿
- [ ] T061 [US4] 實作 getCompleteRows() 取得所有已滿橫列
- [ ] T062 [US4] 實作 checkAndClearRows() 移除完整橫列並使上方方塊下落
- [ ] T063 [US4] 建立 ScoreCalculator 系統 src/systems/ScoreCalculator.js
- [ ] T064 [US4] 實作 calculateScore() 計分邏輯（1 行=100, 2 行=300, 3 行=500, 4 行=800）
- [ ] T065 [US4] 實作 getScoreName() 取得消行類型名稱（Single, Double, Triple, Tetris）
- [ ] T066 [US4] 整合 RowClearer 到 Game.update()（方塊固定後檢查）
- [ ] T067 [US4] 整合 ScoreCalculator 更新 GameState.score
- [ ] T068 [US4] 更新 UIRenderer 顯示當前分數
- [ ] T069 [US4] 為消行事件添加結構化日誌（LINE_CLEAR）

**檢查點**: 此時使用者故事 4 完全可運作 - 消行機制與計分正常

---

## Phase 8：使用者故事 5 - 遊戲結束檢測（優先級: P2）

**目標**: 當方塊堆至頂部時，遊戲應結束

**獨立測試**: 故意快速堆疊方塊至頂部，遊戲應停止並顯示結果

### 測試任務（US5）⚠️

- [ ] T070 [US5] 撰寫遊戲結束整合測試 tests/integration/GameOverFlow.test.js

### 實作任務（US5）

- [ ] T071 [US5] 實作 Game.checkGameOver() 檢測新方塊位置是否被佔據
- [ ] T072 [US5] 實作遊戲結束邏輯（停止遊戲循環）
- [ ] T073 [US5] 實作遊戲結束畫面顯示（最終分數、等級）
- [ ] T074 [US5] 實作重新開始功能（按鍵重啟遊戲）
- [ ] T075 [US5] 為遊戲結束事件添加結構化日誌（GAME_OVER）
- [ ] T076 [US5] 更新 UIRenderer 顯示遊戲結束訊息

**檢查點**: 此時使用者故事 5 完全可運作 - 遊戲結束檢測與重啟正常

---

## Phase 9：使用者故事 7 - 難度遞增（優先級: P3）

**目標**: 隨著遊戲進行，方塊下落速度逐漸加快

**獨立測試**: 持續遊戲並消除多行，觀察速度是否隨等級增加而加快

### 測試任務（US7）⚠️

- [ ] T077 [P] [US7] 為 LevelManager 撰寫單元測試 tests/unit/LevelManager.test.js
- [ ] T078 [US7] 撰寫等級系統整合測試 tests/integration/LevelProgression.test.js

### 實作任務（US7）

- [ ] T079 [US7] 建立 LevelManager 系統 src/systems/LevelManager.js
- [ ] T080 [US7] 實作 calculateLevel() 根據總消行數計算等級
- [ ] T081 [US7] 實作 calculateDropSpeed() 根據等級計算下落速度
- [ ] T082 [US7] 整合 LevelManager 到 GameState.addClearedLines()
- [ ] T083 [US7] 更新 Game.update() 使用動態下落速度
- [ ] T084 [US7] 更新 UIRenderer 顯示當前等級
- [ ] T085 [US7] 為等級提升事件添加結構化日誌（LEVEL_UP）

**檢查點**: 此時使用者故事 7 完全可運作 - 難度遞增系統正常

---

## Phase 10：使用者故事 8 與 Ghost Piece（優先級: P3）

**目標**: 顯示下一個方塊預覽 + Ghost Piece（落點預覽）

**獨立測試**: 觀察預覽區和 Ghost Piece 顯示是否正確

### 測試任務（US8 + Ghost）⚠️

- [ ] T086 [P] [US8] 為 GhostPieceCalculator 撰寫單元測試 tests/unit/GhostPieceCalculator.test.js
- [ ] T087 [US8] 撰寫預覽功能整合測試 tests/integration/PreviewSystem.test.js

### 實作任務（US8 + Ghost）

- [ ] T088 [US8] 建立 GhostPieceCalculator 系統 src/systems/GhostPieceCalculator.js
- [ ] T089 [US8] 實作 calculateGhostPosition() 計算落點位置
- [ ] T090 [US8] 在 GameState 中添加 nextPiece 屬性（已在 T020 規劃）
- [ ] T091 [US8] 更新 Game.spawnNewPiece() 確保 nextPiece 正確更新
- [ ] T092 [US8] 在 Renderer 中繪製 Ghost Piece（半透明）
- [ ] T093 [US8] 在 UIRenderer 中添加「下一個方塊」預覽區域
- [ ] T094 [US8] 繪製下一個方塊到預覽區

**檢查點**: 所有使用者故事現在都已獨立實作並可運作

---

## Phase 11：整體優化與打磨

**目的**: 改善多個使用者故事共同影響的部分

- [ ] T095 [P] 建立 src/styles/main.css 經典像素風格樣式
- [ ] T096 [P] 添加遊戲暫停功能（P 鍵）
- [ ] T097 [P] 實作硬降功能（空白鍵瞬間落底）
- [ ] T098 程式碼重構與清理（移除重複邏輯）
- [ ] T099 [P] 效能優化（若效能測試發現瓶頸）
- [ ] T100 [P] 撰寫額外的單元測試提升覆蓋率至 80%+
- [ ] T101 執行完整的整合測試套件
- [ ] T102 視覺測試與調整（顏色、間距、UI 布局）
- [ ] T103 瀏覽器兼容性測試（Chrome, Firefox, Safari, Edge）
- [ ] T104 執行 quickstart.md 驗證開發流程
- [ ] T105 更新專案 README.md（遊戲說明、控制方式、安裝步驟）

---

## 依賴關係與執行順序

### Phase 依賴關係

- **Phase 1（Setup）**: 無依賴 - 可立即開始
- **Phase 2（Foundational）**: 依賴 Phase 1 完成 - **阻塞所有使用者故事**
- **Phase 3（US1）**: 依賴 Phase 2 完成 - 可與其他 US 並行（若團隊足夠）
- **Phase 4（US3）**: 依賴 Phase 2 完成 - 必須在 Phase 5 之前完成
- **Phase 5（US2）**: 依賴 Phase 4（US3）完成 - 需要碰撞檢測
- **Phase 6（US6）**: 依賴 Phase 3（US1）完成 - 驗證方塊類型
- **Phase 7（US4）**: 依賴 Phase 3, 4, 5, 6（MVP）完成
- **Phase 8（US5）**: 依賴 Phase 7 完成
- **Phase 9（US7）**: 依賴 Phase 7 完成 - 需要計分與消行
- **Phase 10（US8）**: 依賴 Phase 3 完成
- **Phase 11（Polish）**: 依賴所有想要的使用者故事完成

### 使用者故事依賴關係

- **US1（方塊顯示與下落）**: 基礎中的基礎，無依賴（除了 Phase 2）
- **US3（碰撞檢測）**: 依賴 US1（需要 Tetromino 和 Grid）
- **US2（方塊操作）**: 依賴 US3（需要碰撞檢測驗證移動）
- **US6（七種方塊）**: 依賴 US1（實際上已包含在 US1 中）
- **US4（消行計分）**: 依賴 MVP（US1+US2+US3+US6）
- **US5（遊戲結束）**: 依賴 US4（通常與計分系統一起實作）
- **US7（難度遞增）**: 依賴 US4（需要消行計數）
- **US8（預覽 + Ghost）**: 依賴 US1（需要基本渲染）

### 任務內部依賴

- **測試優先**：所有 TXX 測試任務必須在對應的實作任務之前完成
- **模型優先**：Position (T016) → Tetromino (T018) → Game (T021)
- **系統獨立**：標記 [P] 的任務可並行執行（不同檔案）
- **整合最後**：整合任務（如 T027, T035）必須等待相關模組完成

---

## 並行執行範例

### Phase 2（Foundational）並行機會

```bash
# 可同時進行的任務（3 個開發者）：
開發者 A: T008 建立 Constants.js
開發者 B: T009 建立 Logger.js
開發者 C: T010 建立 testUtils.js
```

### Phase 3（US1）並行機會

```bash
# 測試階段（4 個任務可同時進行）：
開發者 A: T012 Position.test.js
開發者 B: T013 Grid.test.js
開發者 C: T014 Tetromino.test.js
開發者 D: T015 GameState.test.js

# 模型實作（依賴測試完成後）：
開發者 A: T016 Position.js
開發者 B: T017 Grid.js
# T018 Tetromino 必須等 T016 完成

# 渲染系統（可並行）：
開發者 A: T023 Renderer.js
開發者 B: T024 GridRenderer.js
開發者 C: T025 TetrominoRenderer.js
```

---

## 實作策略

### 策略 A：MVP 優先（推薦）

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational（**關鍵阻塞點**）
3. **順序完成** Phase 3 → 4 → 5 → 6（MVP 四個故事）
4. **停止並驗證**：測試 MVP 是否完整可玩
5. 部署/展示 MVP

### 策略 B：漸進式交付

1. Setup + Foundational → 基礎就緒
2. 完成 US1 → 測試獨立 → 展示（方塊會下落了！）
3. 完成 US3 + US2 → 測試獨立 → 展示（可以玩了！）
4. 完成 US6 → 測試獨立 → 展示（完整方塊集合）
5. 完成 US4 → 測試獨立 → 展示（有計分了！）
6. 依此類推...

### 策略 C：平行團隊（多人開發）

若有多位開發者：

1. 團隊一起完成 Setup + Foundational
2. Foundational 完成後分工：
   - **開發者 A**: US1（方塊顯示與下落）
   - **開發者 B**: US3（碰撞檢測）
   - **開發者 C**: US6（驗證方塊類型）
3. US3 完成後，**開發者 B** 接手 US2（需要碰撞）
4. 各故事完成後整合測試

---

## TDD 檢查清單

每個任務執行時，確保遵循 TDD 流程：

- [ ] **RED**: 先寫測試，執行測試（必須失敗）
- [ ] **GREEN**: 寫最少的程式碼讓測試通過
- [ ] **REFACTOR**: 在測試通過的狀態下重構
- [ ] **COMMIT**: 測試通過後提交程式碼
- [ ] **LOG**: 確保關鍵事件有結構化日誌

---

## 憲法原則檢查清單

在每個 Phase 完成後驗證：

- [ ] **原則 1：簡約優先** - 無過度設計，程式碼清晰
- [ ] **原則 2：TDD** - 測試先行，紅綠重構
- [ ] **原則 3：UX 聚焦** - 60 FPS, <16ms 延遲
- [ ] **原則 4：效能設計** - 效能需求已驗證
- [ ] **原則 5：可維護性** - 命名清晰，結構合理
- [ ] **原則 6：意圖驅動** - 函數名稱表達意圖
- [ ] **原則 7：結構化日誌** - 事件已記錄

---

## 預估時間（單人開發）

| Phase | 任務數 | 預估時間 | 累計時間 |
|-------|--------|---------|----------|
| Phase 1: Setup | 7 | 2-3 小時 | 3h |
| Phase 2: Foundational | 4 | 2-3 小時 | 6h |
| Phase 3: US1 | 17 | 8-12 小時 | 18h |
| Phase 4: US3 | 8 | 4-6 小時 | 24h |
| Phase 5: US2 | 12 | 6-8 小時 | 32h |
| Phase 6: US6 | 7 | 3-4 小時 | 36h |
| **MVP 完成** | **55 任務** | **~36 小時** | **~5 天** |
| Phase 7: US4 | 14 | 6-8 小時 | 44h |
| Phase 8: US5 | 7 | 3-4 小時 | 48h |
| Phase 9: US7 | 7 | 3-4 小時 | 52h |
| Phase 10: US8 | 7 | 3-4 小時 | 56h |
| Phase 11: Polish | 11 | 4-6 小時 | 62h |
| **完整版本** | **105 任務** | **~62 小時** | **~8 天** |

*註：時間預估假設熟悉技術棧，實際可能因經驗而異*

---

## 注意事項

- **測試覆蓋率目標**: 整體 80%+，核心邏輯（碰撞、消行）100%
- **提交頻率**: 每完成 1-2 個任務或達到檢查點時提交
- **程式碼審查**: 每個 Phase 完成後自我審查（或團隊審查）
- **效能測試**: Phase 3, 5, 11 完成後執行效能測試
- **避免**: 跳過測試、批量提交、同時修改多個檔案

---

## 相關文檔

- [功能規格](./spec.md) - 使用者故事詳細說明
- [實施計劃](./plan.md) - 架構與技術決策
- [資料模型](./data-model.md) - 類別設計
- [API 合約](./contracts/) - 模組介面
- [快速開始](./quickstart.md) - TDD 開發流程

---

**版本歷史**:
- v0.1 (2025-10-21): 初始任務分解，105 個任務，按使用者故事組織
