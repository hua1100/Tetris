# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 語言規範

**請用繁體中文回覆，並將所有技術名詞用白話說明。**

例如：
- "Game loop" → "遊戲循環（每幀更新遊戲狀態的主迴圈）"
- "Collision detection" → "碰撞檢測（檢查方塊是否撞到邊界或其他方塊）"
- "Hard drop" → "硬降（瞬間將方塊落到底部）"

## 開發命令

### 本地開發
```bash
npm run dev          # 啟動開發服務器（預設 http://localhost:3000）
npm run build        # 建置生產版本到 dist/
npm run preview      # 預覽建置後的版本
```

### 測試
```bash
npm test             # 執行所有測試（369 個單元測試）
npm run test:watch   # 監視模式（檔案變更時自動重跑測試）
npm run test:coverage # 生成測試覆蓋率報告

# 執行單一測試檔案
npm test -- tests/unit/Game.test.js

# 執行符合模式的測試
npm test -- --testNamePattern="should lock piece"
```

### 程式碼品質
```bash
npm run lint         # 檢查程式碼風格（ESLint）
npm run lint:fix     # 自動修復可修復的風格問題
npm run format       # 格式化程式碼（Prettier）
```

## 核心架構

### 模組化設計（Layer-based Architecture）

此專案採用分層架構，每層職責明確：

```
src/
├── models/          # 資料模型層（純邏輯，無渲染）
│   ├── GameState.js    - 遊戲狀態管理（分數、等級、當前方塊）
│   ├── Grid.js         - 遊戲網格（10x20，記錄固定方塊）
│   ├── Position.js     - 座標系統（x, y）
│   └── Tetromino.js    - 方塊模型（形狀、旋轉、移動）
│
├── game/            # 遊戲邏輯層（控制器）
│   ├── Game.js         - 遊戲主控制器（遊戲循環、碰撞檢測）
│   └── Logger.js       - 結構化日誌系統
│
├── rendering/       # 渲染層（Canvas 2D）
│   ├── Renderer.js         - 主渲染器（協調所有子渲染器）
│   ├── GridRenderer.js     - 網格渲染
│   ├── TetrominoRenderer.js - 方塊渲染（包括幽靈方塊）
│   └── UIRenderer.js       - UI 元素渲染（分數、等級）
│
├── utils/           # 工具層
│   └── Constants.js    - 常數定義（形狀、顏色、計分規則）
│
└── main.js          # 入口點（初始化、事件監聽、遊戲循環）
```

### 資料流向（Data Flow）

```
User Input (keyboard)
  → main.js (handleKeyDown)
  → Game.js (movePieceLeft/Right/Down, rotatePiece)
  → GameState + Grid (state changes)
  → Renderer.js (render)
  → Canvas 2D API (visual output)
```

### 關鍵設計模式

1. **單一職責原則（Single Responsibility Principle）**
   - 每個類別只負責一件事
   - `Grid` 只管網格邏輯，不處理渲染
   - `Renderer` 只管渲染，不改變遊戲狀態

2. **不可變性（Immutability）**
   - 所有常數使用 `Object.freeze()`
   - 方塊移動前先 `clone()` 測試是否合法

3. **測試優先（Test-First）**
   - 所有核心邏輯都有對應測試
   - 覆蓋率要求：80% 以上

## 遊戲機制實作細節

### 7-bag 隨機系統（Random Generator）

使用「7-bag」演算法確保公平性：
- 將 7 種方塊放入袋子，隨機打亂
- 從袋子依序取出，袋子空了就重新填充
- **第一個袋子特殊處理**：I 型方塊放在後面（位置 5 或 6），避免新手開局就拿到難用的長條

實作位置：`src/models/GameState.js:97-131`

### 鎖定延遲（Lock Delay）

方塊碰到底部後不會立即固定，有 500ms 的調整時間：
- 玩家可以在底部左右移動、旋轉方塊
- 每次移動/旋轉會重置計時器
- 測試模式下可禁用此機制（`Game` 建構子參數）

實作位置：`src/game/Game.js:126-135`

### 連擊系統（Combo System）

連續消行會增加分數倍率：
- 基礎分數 = SCORE_TABLE[消行數] × 等級
- 連擊倍率 = 1 + (連擊數 - 1) × 0.5
- 最終分數 = 基礎分數 × 連擊倍率
- 沒有消行時連擊重置

實作位置：`src/game/Game.js:321-357`

### 等級與速度系統

- 每消除 8 行升一級（可在 `GAME_CONSTANTS.LINES_PER_LEVEL` 調整）
- 速度計算：`初始速度 × 0.85^(等級-1)`
- 最快速度：100ms（避免太快）

實作位置：`src/models/GameState.js:153-169`

## 測試策略

### 測試檔案結構

```
tests/
├── helpers/         # 測試輔助工具
│   └── testHelpers.js  - 共用的 mock 函數和工具
│
└── unit/            # 單元測試（每個類別一個檔案）
    ├── Position.test.js    - 79 個測試
    ├── Grid.test.js        - 75 個測試
    ├── Tetromino.test.js   - 145 個測試
    ├── GameState.test.js   - 100 個測試
    ├── Game.test.js        - 50 個測試
    └── Logger.test.js      - 20 個測試
```

### 測試覆蓋率要求

Jest 配置（`jest.config.js`）設定全域門檻：
- 分支覆蓋率（branches）: 80%
- 函數覆蓋率（functions）: 80%
- 行覆蓋率（lines）: 80%
- 語句覆蓋率（statements）: 80%

**排除項目**：
- `src/main.js`（入口檔案，需要 DOM）
- `src/rendering/**`（渲染層，需要 Canvas API）

### 編寫新測試時的注意事項

1. **隔離性（Isolation）**：每個測試獨立，不依賴其他測試的執行順序
2. **AAA 模式（Arrange-Act-Assert）**：
   ```javascript
   test('should do something', () => {
     // Arrange - 準備測試資料
     const game = new Game();

     // Act - 執行要測試的動作
     game.start();

     // Assert - 驗證結果
     expect(game.state.status).toBe(GameStatus.PLAYING);
   });
   ```
3. **邊界測試（Boundary Testing）**：測試邊界情況（0, -1, 最大值）
4. **測試禁用動畫**：測試 `Game` 時傳入 `false` 禁用鎖定延遲

## Spec-Driven Development（規格驅動開發）

此專案採用 GitHub Spec Kit 方法論，所有功能開發遵循以下流程：

### 開發流程

1. **規格定義（Specification）** - 使用 `/speckit.specify`
   - 定義「要做什麼」和「為什麼」
   - 不涉及技術實作細節
   - 包含使用者情境、驗收標準、成功指標

2. **實作規劃（Planning）** - 使用 `/speckit.plan`
   - 技術調研與設計
   - 資料模型與介面設計
   - 檢查是否符合專案憲章（constitution）

3. **任務分解（Task Breakdown）** - 使用 `/speckit.tasks`
   - 將規劃拆解為可執行的小任務
   - 標記依賴關係與平行機會
   - 每個任務都可獨立測試

4. **實作執行（Implementation）** - 使用 `/speckit.implement`
   - TDD 方式實作（先寫測試）
   - 每完成一個任務就驗證
   - 頻繁提交，清晰的 commit 訊息

### 專案憲章（Constitution）

位置：`.specify/memory/constitution.md`

**五大核心原則**：
1. **簡單優先（Simplicity First）** - 優先選擇簡單方案
2. **測試驅動（TDD）** - 所有核心邏輯必須先寫測試
3. **使用者體驗優先** - 回應速度、流暢度至關重要
4. **效能標準** - 60 FPS、<16ms 輸入延遲（非協商項目）
5. **可維護性** - 程式碼清晰度優於簡潔度

**重要規則**：
- 複雜方案需要明確理由
- 關鍵遊戲機制必須先寫測試
- 效能預算不可妥協
- 程式碼清晰度優先於簡潔度

### Spec 目錄結構

```
.specify/
├── memory/
│   └── constitution.md       # 專案憲章
│
├── templates/                # 範本檔案
│   ├── spec-template.md      # 規格範本
│   ├── plan-template.md      # 規劃範本
│   └── tasks-template.md     # 任務範本
│
└── scripts/                  # 自動化腳本
    └── bash/
        └── create-new-feature.sh  # 建立新功能分支與檔案

specs/                         # 各功能的 spec（依功能建立）
└── 001-core-tetris-game/
    ├── spec.md               # 功能規格
    ├── plan.md               # 實作規劃
    └── tasks.md              # 任務清單
```

## 效能考量

### 目標指標

- **60 FPS**：遊戲循環使用 `requestAnimationFrame`
- **<16ms 輸入延遲**：按鍵事件直接更新狀態，不排隊
- **渲染優化**：只渲染變化的部分（未來改進項）

### 效能監控

`Logger` 可記錄輸入延遲超過閾值的事件：
```javascript
if (lagTime > GAME_CONSTANTS.INPUT_RESPONSE_THRESHOLD) {
  this.logInputLag(lagTime);
}
```

## 常見開發任務

### 新增方塊類型

1. 在 `src/utils/Constants.js` 新增：
   ```javascript
   export const TetrominoType = Object.freeze({
     // ... 現有類型
     X: 'X',  // 新類型
   });

   export const TETROMINO_SHAPES = Object.freeze({
     X: [
       // 定義 4 個旋轉狀態的形狀
     ],
   });

   export const TETROMINO_COLORS = Object.freeze({
     X: '#FF00FF',  // 新顏色
   });
   ```

2. 在 `tests/unit/Tetromino.test.js` 新增測試
3. 確保 7-bag 系統自動包含新類型（它會自動讀取 `TetrominoType`）

### 調整遊戲難度

修改 `src/utils/Constants.js` 中的 `GAME_CONSTANTS`：
```javascript
export const GAME_CONSTANTS = Object.freeze({
  INITIAL_DROP_SPEED: 1000,     // 初始速度（數字越大越慢）
  MIN_DROP_SPEED: 100,          // 最快速度
  SPEED_DECREASE_RATE: 0.85,    // 每級加速比例（越小越快）
  LINES_PER_LEVEL: 8,           // 幾行升一級（越少升級越快）
});
```

### 修改計分規則

修改 `src/utils/Constants.js` 中的 `SCORE_TABLE`：
```javascript
export const SCORE_TABLE = Object.freeze({
  1: 100,   // 消 1 行
  2: 300,   // 消 2 行
  3: 500,   // 消 3 行
  4: 800,   // 消 4 行（Tetris）
});
```

連擊倍率在 `src/game/Game.js:342` 調整。

## Git 工作流程

### 分支策略

- `main` / `master`：穩定版本，可部署
- `claude/[feature-id]`：功能開發分支（由 Spec Kit 自動建立）

### Commit 訊息規範

遵循 Conventional Commits 格式：
```
<type>: <description>

[optional body]
```

**常用 types**：
- `feat`: 新功能
- `fix`: 修復 bug
- `refactor`: 重構（不改變行為）
- `test`: 新增或修改測試
- `docs`: 文件變更
- `perf`: 效能改進

**範例**：
```
feat: 實作 7-bag 隨機系統

- 使用 Fisher-Yates 洗牌演算法
- 第一個袋子將 I 型方塊放在後面
- 確保每 7 個方塊包含所有類型
```

## 部署

專案使用 GitHub Actions 自動部署到 GitHub Pages：
- 推送到 `main` 或 `master` 分支時自動觸發
- 執行 `npm run build`
- 部署到 `gh-pages` 分支
- 訪問 https://hua1100.github.io/Tetris/

建置配置在 `vite.config.js`：
- `base: './'`：使用相對路徑（適合 GitHub Pages）
- `sourcemap: true`：生成 source map 方便除錯

## 關鍵檔案說明

- **src/main.js**：應用程式入口，處理 DOM 事件、初始化遊戲循環
- **src/game/Game.js**：遊戲主控制器，包含所有遊戲邏輯（移動、旋轉、消行）
- **src/models/GameState.js**：遊戲狀態管理，包含 7-bag 系統
- **src/utils/Constants.js**：所有遊戲常數的唯一來源（Single Source of Truth）
- **jest.config.js**：測試配置，定義測試環境、覆蓋率門檻
- **vite.config.js**：建置工具配置，定義開發伺服器、建置輸出

## 開發注意事項

1. **不要直接修改 GameState**：所有狀態變更透過 `Game` 的方法
2. **測試先行**：核心邏輯改動前先確認測試涵蓋
3. **效能優先**：避免在遊戲循環中使用 `console.log`（已有 Logger）
4. **使用 Constants**：所有魔術數字都應定義在 `Constants.js`
5. **Canvas 渲染**：渲染邏輯與遊戲邏輯嚴格分離，`models/` 和 `game/` 不應 import Canvas API

## Active Technologies
- JavaScript ES6+ (Vanilla JS) (002-two-player-battle)
- N/A (純前端遊戲，無需持久化) (002-two-player-battle)

## Recent Changes
- 002-two-player-battle: Added JavaScript ES6+ (Vanilla JS)
