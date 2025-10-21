# 快速開始指南：俄羅斯方塊開發

**目的**: 協助開發者快速設置開發環境並開始實作

---

## 📋 先決條件

### 必要工具

- **Node.js**: v18.0+ （推薦 LTS 版本）
- **npm**: v9.0+ （隨 Node.js 安裝）
- **Git**: v2.0+
- **現代瀏覽器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 檢查版本

```bash
node --version   # 應 >= v18.0.0
npm --version    # 應 >= 9.0.0
git --version    # 應 >= 2.0.0
```

---

## 🚀 環境設置

### 步驟 1：克隆專案

```bash
git clone <repository-url>
cd Tetris
```

### 步驟 2：安裝依賴

```bash
npm install
```

**安裝的套件**：
- `vite` - 開發伺服器與打包工具
- `jest` - 測試框架
- `@babel/preset-env` - ES6+ 轉譯
- `eslint` - 程式碼檢查
- `prettier` - 程式碼格式化

### 步驟 3：驗證安裝

```bash
npm run dev
```

應該會自動開啟瀏覽器並顯示 `http://localhost:3000`

---

## 📁 專案結構

```
Tetris/
├── index.html              # 主頁面
├── package.json            # NPM 配置
├── vite.config.js          # Vite 配置
├── jest.config.js          # Jest 配置
├── .eslintrc.js            # ESLint 規則
├── .prettierrc             # Prettier 規則
├── src/                    # 原始碼
│   ├── main.js             # 進入點
│   ├── game/               # 遊戲主邏輯
│   ├── models/             # 資料模型
│   ├── systems/            # 遊戲系統
│   ├── rendering/          # 渲染
│   ├── input/              # 輸入處理
│   ├── utils/              # 工具函數
│   └── styles/             # CSS 樣式
├── tests/                  # 測試
│   ├── unit/               # 單元測試
│   ├── integration/        # 整合測試
│   └── helpers/            # 測試輔助
└── specs/                  # 規格文檔
    └── 001-core-tetris-game/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md   # 此文件
        └── contracts/
```

---

## 🛠️ 開發工作流

### 開發模式（熱更新）

```bash
npm run dev
```

- 啟動開發伺服器於 `http://localhost:3000`
- 修改程式碼自動重新載入
- 開啟 DevTools 查看 Console 日誌

### 執行測試

```bash
npm test              # 執行所有測試
npm test -- --watch   # 監視模式（自動重測）
npm test -- --coverage # 產生覆蓋率報告
```

### 程式碼檢查

```bash
npm run lint          # ESLint 檢查
npm run lint:fix      # 自動修復
npm run format        # Prettier 格式化
```

### 打包生產版本

```bash
npm run build
```

- 輸出到 `dist/` 目錄
- 最小化與優化
- 產生 source maps

### 預覽生產版本

```bash
npm run preview
```

---

## ✅ 測試驅動開發（TDD）流程

遵循憲法原則 2，必須先寫測試再寫實作。

### 步驟 1：寫測試（RED）

建立測試檔案 `tests/unit/Tetromino.test.js`：

```javascript
import { Tetromino, TetrominoType } from '../../src/models/Tetromino.js';

describe('Tetromino', () => {
  test('應正確初始化 I 型方塊', () => {
    const tetromino = new Tetromino(TetrominoType.I);

    expect(tetromino.type).toBe(TetrominoType.I);
    expect(tetromino.rotation).toBe(0);
    expect(tetromino.position.x).toBe(3);
    expect(tetromino.position.y).toBe(0);
    expect(tetromino.color).toBe('#00FFFF');
  });

  test('應正確取得方塊形狀', () => {
    const tetromino = new Tetromino(TetrominoType.O);
    const shape = tetromino.getShape();

    expect(shape).toEqual([
      [1, 1],
      [1, 1]
    ]);
  });
});
```

### 步驟 2：執行測試（應失敗）

```bash
npm test
```

**預期結果**: ❌ 測試失敗（因為還沒實作）

### 步驟 3：寫實作（GREEN）

建立 `src/models/Tetromino.js`：

```javascript
import { Position } from './Position.js';
import { TETROMINO_SHAPES, TETROMINO_COLORS } from '../utils/Constants.js';

export const TetrominoType = Object.freeze({
  I: 'I',
  O: 'O',
  T: 'T',
  S: 'S',
  Z: 'Z',
  J: 'J',
  L: 'L'
});

export class Tetromino {
  constructor(type) {
    this.type = type;
    this.rotation = 0;
    this.position = new Position(3, 0);
    this.color = TETROMINO_COLORS[type];
  }

  getShape() {
    return TETROMINO_SHAPES[this.type][this.rotation];
  }

  // ... 其他方法
}
```

### 步驟 4：重新測試（應通過）

```bash
npm test
```

**預期結果**: ✅ 測試通過

### 步驟 5：重構（REFACTOR）

維持測試通過的狀態下，優化程式碼：
- 提取重複邏輯
- 改善命名
- 簡化結構

---

## 📝 程式碼風格指南

### 命名規範（符合憲法原則 6：意圖驅動）

```javascript
// ✅ 好的命名（表達意圖）
function detectCollision(tetromino, grid) { }
const canMoveLeft = CollisionDetector.canMoveLeft(piece, grid);
const isGameOver = gameState.status === GameStatus.GAME_OVER;

// ❌ 不好的命名（不清楚意圖）
function check(t, g) { }
const flag = cd.cml(p, g);
const done = gs.s === GS.GO;
```

### 函數設計

```javascript
// ✅ 單一職責、純函數
function isValidPosition(tetromino, grid) {
  // 不修改輸入參數
  // 回傳值僅取決於輸入
  return result;
}

// ❌ 副作用未明確標示
function checkPosition(tetromino, grid) {
  tetromino.position.x++;  // 副作用！
  return isValid;
}
```

### 註解原則

```javascript
// ✅ 解釋「為什麼」
// 使用簡化版牆踢而非完整 SRS，以符合簡約原則
const testPositions = [
  { x: 0, y: 0 },
  { x: -1, y: 0 },
  { x: 1, y: 0 }
];

// ❌ 解釋「是什麼」（程式碼本身已清楚）
// 建立包含三個位置的陣列
const testPositions = [...];
```

---

## 🐛 除錯技巧

### 1. 使用結構化日誌

```javascript
import { Logger } from './game/Logger.js';

const logger = new Logger(true, true);  // 啟用 Console + 儲存

// 記錄關鍵事件
logger.logPieceSpawn(currentPiece);
logger.logPieceMove('LEFT', newPosition);

// 查看所有日誌
console.table(logger.getLogs());
```

### 2. 使用瀏覽器 DevTools

- **Console**: 查看日誌輸出
- **Sources**: 設置中斷點
- **Performance**: 分析 FPS 和效能瓶頸
- **Network**: 檢查資源載入

### 3. 常見問題排查

**問題：方塊移動不流暢**
```javascript
// 檢查遊戲循環是否維持 60 FPS
let frameCount = 0;
let lastFpsTime = performance.now();

function gameLoop(currentTime) {
  frameCount++;
  if (currentTime - lastFpsTime >= 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastFpsTime = currentTime;
  }
  // ...
}
```

**問題：碰撞檢測錯誤**
```javascript
// 視覺化檢測過程
function debugCollision(tetromino, grid) {
  const blocks = tetromino.getBlocks();
  blocks.forEach(block => {
    console.log(`方塊位置: (${block.x}, ${block.y})`);
    console.log(`是否超出邊界: ${!grid.isInBounds(block.x, block.y)}`);
    console.log(`是否被佔用: ${grid.isOccupied(block.x, block.y)}`);
  });
}
```

---

## 📚 推薦開發順序

根據 `tasks.md`（待建立），建議按照以下順序實作：

### Phase 1：環境設置
1. ✅ 初始化 Vite 專案
2. ✅ 配置 Jest、ESLint、Prettier
3. ✅ 建立專案結構

### Phase 2：核心模型（P1 - MVP）
1. `Position` 值對象
2. `Tetromino` 類別
3. `Grid` 類別
4. `GameState` 類別

### Phase 3：遊戲系統（P1）
1. `CollisionDetector`
2. 遊戲循環（`Game.update`）
3. 輸入處理（`InputHandler`）

### Phase 4：渲染（P1）
1. `Renderer` 主渲染器
2. `GridRenderer`
3. `TetrominoRenderer`
4. `UIRenderer`

### Phase 5：進階功能（P2-P3）
1. `RowClearer` + `ScoreCalculator`
2. `LevelManager`
3. `GhostPieceCalculator`
4. 下一個方塊預覽

---

## 🎯 憲法原則檢查清單

在提交每個 Pull Request 前，確認：

- [ ] **原則 1：簡約優先** - 程式碼簡單清晰，無過度設計
- [ ] **原則 2：TDD** - 所有功能都有測試，測試先行
- [ ] **原則 3：UX 聚焦** - 維持 60 FPS，輸入延遲 <16ms
- [ ] **原則 4：效能設計** - 效能需求已驗證
- [ ] **原則 5：可維護性** - 命名清晰，結構合理
- [ ] **原則 6：意圖驅動** - 函數名稱表達意圖
- [ ] **原則 7：結構化日誌** - 關鍵事件已記錄

---

## 🔗 相關文檔

- [功能規格](./spec.md) - 使用者故事與驗收標準
- [實施計劃](./plan.md) - 技術決策與架構
- [技術研究](./research.md) - Canvas、旋轉系統等研究
- [資料模型](./data-model.md) - 類別與資料結構設計
- [API 合約](./contracts/) - 模組介面定義

---

## 💬 需要協助？

- **規格問題**: 參考 `spec.md`
- **技術問題**: 參考 `research.md` 和 `plan.md`
- **API 疑問**: 參考 `contracts/` 目錄
- **測試範例**: 參考 `tests/` 目錄

---

**版本歷史**:
- v0.1 (2025-10-21): 初始快速開始指南
