# 實施計劃：俄羅斯方塊核心遊戲

**分支**: `001-core-tetris-game` | **日期**: 2025-10-21 | **規格**: [spec.md](./spec.md)
**輸入**: 功能規格來自 `/specs/001-core-tetris-game/spec.md`

---

## 摘要

建立一個在網頁瀏覽器上運行的單人俄羅斯方塊遊戲，具備完整的核心遊戲機制：七種標準方塊、移動與旋轉控制、碰撞檢測、消行計分、遊戲結束檢測，以及進階功能如難度遞增、Ghost Piece 預覽和下一個方塊顯示。

**技術方法**：
- 使用 **Vanilla JavaScript (ES6+)** 和 **HTML5 Canvas 2D** 渲染
- 採用簡約架構，避免引入前端框架（符合憲法原則 1）
- 實現經典像素風格的視覺呈現
- 遵循測試驅動開發 (TDD)，使用 Jest 進行單元測試和整合測試
- 所有遊戲邏輯模組化，便於測試與維護

---

## 技術背景

**語言/版本**: JavaScript ES6+ (ECMAScript 2015+), HTML5, CSS3
**主要依賴**:
- 核心：無（Vanilla JavaScript）
- 測試：Jest 29+
- 開發工具：Vite 5+ (開發伺服器與打包)
- 程式碼品質：ESLint, Prettier

**儲存**: N/A（分數不持久化，僅顯示當前遊戲）
**測試**: Jest 單元測試 + 整合測試
**目標平台**: 現代網頁瀏覽器（Chrome 90+, Firefox 88+, Safari 14+, Edge 90+）
**專案類型**: Single（單一專案，純前端）
**效能目標**:
- 維持穩定 60 FPS 渲染
- 鍵盤輸入回應延遲 <16ms
- 記憶體使用 <50MB
- 首次載入時間 <2 秒

**限制條件**:
- 純前端網頁應用，無後端伺服器
- 不需要網路連線（可離線遊玩）
- 支援鍵盤輸入（方向鍵 + WASD）
- 瀏覽器 Canvas 2D API 效能限制

**規模/範圍**:
- 預估程式碼量：1500-2500 行（含測試約 3000-4000 行）
- 單一 HTML 頁面應用
- 約 10-15 個核心模組/類別
- 測試覆蓋率目標：80% 整體，核心邏輯 100%

---

## 憲法檢查

*檢查點：必須在 Phase 0 研究前通過。在 Phase 1 設計後重新檢查。*

驗證符合所有 7 項憲法原則：

- [x] **原則 1：簡約優先** - 使用 Vanilla JavaScript，無前端框架；Canvas 2D 足以應付像素風格；避免過度設計模式
- [x] **原則 2：測試驅動開發** - 規劃 TDD 流程，使用 Jest；每個核心機制（碰撞、消行、旋轉）先寫測試
- [x] **原則 3：使用者體驗聚焦** - 效能預算明確定義：60 FPS、<16ms 輸入延遲；響應式控制為最高優先
- [x] **原則 4：設計即效能** - 效能需求已列入成功標準；使用 Canvas 硬體加速；避免過早優化（先測量瓶頸）
- [x] **原則 5：可維護程式碼** - 模組化架構，清晰命名；每個實體（Tetromino, Grid）職責單一
- [x] **原則 6：意圖驅動開發** - 函數命名表達意圖（`detectCollision`, `clearCompletedLines`）；類別對應領域概念
- [x] **原則 7：可觀測性與結構化日誌** - 實作簡易日誌系統（瀏覽器 Console + 結構化物件）；記錄關鍵事件

*所有檢查項目已通過。無憲法違規事項。*

---

## 專案結構

### 文檔（此功能）

```
specs/001-core-tetris-game/
├── spec.md              # 功能規格（已完成）
├── plan.md              # 此檔案 - 實施計劃
├── research.md          # Phase 0 輸出 - 技術研究（待建立）
├── data-model.md        # Phase 1 輸出 - 資料模型（待建立）
├── quickstart.md        # Phase 1 輸出 - 快速開始指南（待建立）
├── contracts/           # Phase 1 輸出 - 介面/API 定義（待建立）
└── tasks.md             # Phase 2 輸出 - 任務分解（待建立）
```

### 原始碼（專案根目錄）

```
Tetris/
├── index.html                # 主要 HTML 檔案
├── package.json              # NPM 依賴與腳本
├── vite.config.js            # Vite 配置
├── .eslintrc.js              # ESLint 配置
├── .prettierrc               # Prettier 配置
├── src/
│   ├── main.js               # 應用程式進入點
│   ├── game/
│   │   ├── Game.js           # 遊戲主控制器
│   │   ├── GameState.js      # 遊戲狀態管理
│   │   └── Logger.js         # 結構化日誌系統
│   ├── models/
│   │   ├── Tetromino.js      # 方塊類別（I, O, T, S, Z, J, L）
│   │   ├── Grid.js           # 遊戲板（10x20 網格）
│   │   ├── Position.js       # 座標類別
│   │   └── TetrominoFactory.js  # 方塊工廠（隨機生成）
│   ├── systems/
│   │   ├── CollisionDetector.js  # 碰撞檢測系統
│   │   ├── RowClearer.js         # 消行系統
│   │   ├── ScoreCalculator.js    # 計分系統
│   │   └── LevelManager.js       # 等級與速度管理
│   ├── input/
│   │   └── InputHandler.js       # 鍵盤輸入處理
│   ├── rendering/
│   │   ├── Renderer.js           # Canvas 渲染器
│   │   ├── GridRenderer.js       # 遊戲板渲染
│   │   ├── TetrominoRenderer.js  # 方塊渲染
│   │   └── UIRenderer.js         # UI（分數、等級）渲染
│   ├── utils/
│   │   ├── Constants.js          # 遊戲常數（顏色、尺寸等）
│   │   └── Timer.js              # 遊戲循環計時器
│   └── styles/
│       └── main.css              # 樣式表（像素風格）
├── tests/
│   ├── unit/
│   │   ├── Tetromino.test.js
│   │   ├── Grid.test.js
│   │   ├── CollisionDetector.test.js
│   │   ├── RowClearer.test.js
│   │   └── ScoreCalculator.test.js
│   ├── integration/
│   │   ├── GameFlow.test.js      # 完整遊戲流程測試
│   │   ├── RotationSystem.test.js
│   │   └── InputHandling.test.js
│   └── helpers/
│       └── testUtils.js          # 測試輔助函數
└── docs/
    └── architecture.md           # 架構說明文件
```

**結構決策**：選擇單一專案結構（Option 1），因為：
1. 純前端應用，無需前後端分離
2. 程式碼規模中等（<5000 行），單一專案易於管理
3. 符合憲法簡約原則，避免過度複雜的專案組織

**模組職責**：
- `models/`: 資料模型，無遊戲邏輯（純資料結構）
- `systems/`: 遊戲邏輯系統，處理規則（碰撞、消行、計分）
- `rendering/`: 視覺呈現，與邏輯分離
- `input/`: 輸入處理，轉換鍵盤事件為遊戲指令
- `game/`: 遊戲主控制器，協調各系統

---

## 核心技術決策

### 1. 為何選擇 Vanilla JavaScript？

**理由**：
- ✅ 符合憲法原則 1（簡約優先）：避免引入 React/Vue 等框架開銷
- ✅ 效能最佳：無虛擬 DOM，直接操作 Canvas，滿足 60 FPS 要求
- ✅ 學習曲線低：標準 JavaScript，易於理解和維護
- ✅ 打包體積小：無框架依賴，首次載入快速

**替代方案被拒絕**：
- ❌ React：過度複雜，虛擬 DOM 不適合 Canvas 渲染
- ❌ Phaser.js：遊戲引擎過於龐大，Tetris 不需要物理引擎
- ❌ TypeScript：增加編譯步驟，專案規模不需強型別（可未來添加）

### 2. 渲染方式：Canvas 2D vs SVG vs DOM

**選擇：Canvas 2D**

**理由**：
- ✅ 像素級控制，適合經典像素風格
- ✅ 硬體加速，60 FPS 效能保證
- ✅ 簡單的 API，易於繪製方格和色塊

**替代方案被拒絕**：
- ❌ SVG：向量圖形不適合像素風格，且效能稍差
- ❌ DOM：操作 400 個 div（10x20 + 方塊）效能不如 Canvas

### 3. 測試框架：Jest vs Vitest

**選擇：Jest**

**理由**：
- ✅ 成熟穩定，社群資源豐富
- ✅ 內建 Mock、Spy、Coverage 工具
- ✅ 支援 ES6 模組
- ✅ 配置簡單

**替代方案**：
- Vitest：更快但較新，穩定性稍遜（可未來遷移）

### 4. 開發工具：Vite vs Webpack

**選擇：Vite**

**理由**：
- ✅ 極快的冷啟動和熱更新（符合開發效率）
- ✅ 配置簡單，符合簡約原則
- ✅ 原生支援 ES6 模組
- ✅ 內建開發伺服器

### 5. 狀態管理

**選擇：簡單的 GameState 類別**

**理由**：
- ✅ 遊戲狀態簡單（分數、等級、當前方塊），無需 Redux/Vuex
- ✅ 單一來源真相（Single Source of Truth）
- ✅ 易於測試

---

## 架構模式

### 整體架構：ECS 精神簡化版

採用 **Entity-Component-System (ECS)** 的精神，但簡化實作：

- **Entities（實體）**: `Tetromino`, `Grid`
- **Components（組件）**: `Position`, `RotationState`（內嵌於實體中）
- **Systems（系統）**: `CollisionDetector`, `RowClearer`, `ScoreCalculator`

**為何不用完整 ECS 框架**：
- Tetris 實體數量少（1 個活動方塊 + 固定方塊）
- 完整 ECS 過度設計，違反簡約原則
- 借鑑其「系統分離」思想即可

### 渲染循環：Game Loop

```
初始化
└─> 遊戲循環（每 16.67ms，60 FPS）
    ├─> 處理輸入（InputHandler）
    ├─> 更新遊戲邏輯（Game.update）
    │   ├─> 方塊自動下落
    │   ├─> 碰撞檢測
    │   ├─> 消行檢查
    │   └─> 等級/速度更新
    ├─> 渲染畫面（Renderer.render）
    │   ├─> 清空 Canvas
    │   ├─> 繪製遊戲板
    │   ├─> 繪製固定方塊
    │   ├─> 繪製 Ghost Piece
    │   ├─> 繪製當前方塊
    │   └─> 繪製 UI（分數、下一個方塊）
    └─> 記錄效能指標（FPS、輸入延遲）
```

### 輸入處理流程

```
鍵盤事件
└─> InputHandler.onKeyDown
    ├─> 轉換為遊戲指令（LEFT, RIGHT, ROTATE, DROP）
    ├─> 記錄時間戳（用於延遲測量）
    └─> Game.handleCommand
        ├─> 嘗試執行移動/旋轉
        ├─> CollisionDetector.isValidMove
        ├─> 若合法，更新方塊位置
        └─> Logger.log（記錄輸入事件）
```

---

## 關鍵演算法設計

### 1. 碰撞檢測

```javascript
CollisionDetector.isValidPosition(tetromino, position, grid)
  for each block in tetromino.shape:
    absoluteX = position.x + block.relativeX
    absoluteY = position.y + block.relativeY

    if absoluteX < 0 or absoluteX >= 10:  // 超出左右邊界
      return false
    if absoluteY < 0 or absoluteY >= 20:  // 超出上下邊界
      return false
    if grid.isOccupied(absoluteX, absoluteY):  // 與已固定方塊重疊
      return false

  return true
```

### 2. 旋轉與牆踢

```javascript
Tetromino.rotate(direction, grid)
  newRotationState = (currentRotation + direction) % 4
  newShape = SHAPES[type][newRotationState]

  // 嘗試原地旋轉
  if CollisionDetector.isValidPosition(newShape, position, grid):
    apply rotation
    return true

  // 牆踢：嘗試向左偏移 1 格
  if CollisionDetector.isValidPosition(newShape, position.left(1), grid):
    apply rotation and move left
    return true

  // 牆踢：嘗試向右偏移 1 格
  if CollisionDetector.isValidPosition(newShape, position.right(1), grid):
    apply rotation and move right
    return true

  // 旋轉失敗
  return false
```

### 3. 消行檢測

```javascript
RowClearer.clearCompletedRows(grid)
  completedRows = []

  for row from 0 to 19:
    if grid.isRowComplete(row):
      completedRows.push(row)

  if completedRows.length > 0:
    // 移除完整的行
    for each row in completedRows:
      grid.removeRow(row)
      grid.addEmptyRowAtTop()

    // 計算分數
    score = ScoreCalculator.calculate(completedRows.length)

    return { rowsCleared: completedRows.length, score: score }
```

### 4. Ghost Piece 計算

```javascript
GhostPieceCalculator.calculate(tetromino, grid)
  ghostPosition = tetromino.position.clone()

  while CollisionDetector.isValidPosition(tetromino, ghostPosition.down(1), grid):
    ghostPosition.moveDown()

  return ghostPosition
```

---

## 效能優化策略

### 1. 只重繪變化區域

```javascript
// 不是每幀都清空整個 Canvas
Renderer.render(game) {
  if (game.hasDirtyRegions()) {
    redraw only changed areas
  } else {
    skip rendering
  }
}
```

### 2. 使用離屏 Canvas

```javascript
// 預渲染固定方塊到離屏 Canvas
offscreenCanvas.drawGrid(fixedBlocks)

// 主 Canvas 只需繪製動態元素
mainCanvas.drawImage(offscreenCanvas)
mainCanvas.drawTetromino(fallingPiece)
```

### 3. 節流輸入處理

```javascript
// 防止連續旋轉導致的重複計算
let lastRotateTime = 0
const ROTATE_COOLDOWN = 100ms  // 每 100ms 最多旋轉一次

if (now - lastRotateTime > ROTATE_COOLDOWN) {
  handleRotate()
  lastRotateTime = now
}
```

### 4. 避免過早優化

⚠️ **重要**：上述優化僅在**效能測試證明需要時**才實作。

遵循憲法原則 4：先測量瓶頸，再優化。初期以清晰程式碼為主。

---

## 日誌策略（憲法原則 7）

### 結構化日誌格式

```javascript
Logger.log(event, data) {
  const logEntry = {
    timestamp: Date.now(),
    event: event,                    // 'PIECE_SPAWN', 'MOVE', 'ROTATE', 'LINE_CLEAR', etc.
    gameState: {
      score: game.score,
      level: game.level,
      linesCleared: game.totalLines
    },
    ...data                          // 額外上下文（方塊類型、位置等）
  }

  console.log(JSON.stringify(logEntry))  // 瀏覽器環境

  // 可選：儲存到陣列供除錯分析
  this.logs.push(logEntry)
}
```

### 需要記錄的事件

- `GAME_START`: 遊戲開始
- `PIECE_SPAWN`: 新方塊生成（type, position）
- `PIECE_MOVE`: 方塊移動（direction, newPosition）
- `PIECE_ROTATE`: 方塊旋轉（direction, success）
- `PIECE_LOCK`: 方塊固定（position, lockDelay）
- `LINE_CLEAR`: 消行（rowCount, score）
- `LEVEL_UP`: 等級提升（newLevel, newSpeed）
- `GAME_OVER`: 遊戲結束（finalScore, finalLevel）
- `INPUT_LAG`: 輸入延遲過高（latency）

---

## 複雜度追蹤

*僅在憲法檢查有違規事項時填寫*

| 違規項目 | 為何需要 | 被拒絕的更簡單替代方案及原因 |
|---------|---------|---------------------|
| 無 | - | - |

---

## 風險與緩解措施

| 風險 | 影響 | 機率 | 緩解措施 |
|------|------|------|---------|
| Canvas 效能不足以維持 60 FPS | 高 | 低 | 效能預算測試；降級方案（降低渲染品質） |
| 碰撞檢測出現邊緣案例錯誤 | 高 | 中 | TDD 方法，涵蓋所有旋轉與邊界情況 |
| 旋轉牆踢邏輯過於複雜 | 中 | 中 | 簡化版牆踢（僅左右偏移），避免完整 SRS |
| 測試覆蓋率不足 | 中 | 低 | 強制 TDD，每個功能先寫測試 |

---

## 下一步驟

1. ✅ 完成實施計劃（此文件）
2. ⏳ 建立技術研究文件（research.md）
   - 研究 Canvas 2D API 最佳實踐
   - 研究 Jest 測試設定
   - 研究經典俄羅斯方塊旋轉系統
3. ⏳ 設計資料模型（data-model.md）
   - Tetromino 類別設計
   - Grid 資料結構
   - GameState 狀態機
4. ⏳ 定義介面合約（contracts/）
   - 各模組的公開 API
   - 輸入事件格式
   - 日誌事件格式
5. ⏳ 建立快速開始指南（quickstart.md）
6. ⏳ 建立任務分解（tasks.md）
   - 按使用者故事拆分任務
   - 標記可並行任務
   - 定義測試任務

---

**版本歷史**:
- v0.1 (2025-10-21): 初始實施計劃
