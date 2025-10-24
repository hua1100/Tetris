# Quick Start: Two-Player Battle Mode Development

**Feature**: 002-two-player-battle | **Date**: 2025-10-23
**Purpose**: 開發者快速入門指南

## 概述

本指南幫助開發者快速理解並開始實作兩人對戰模式。

## 5 分鐘理解架構

### 核心概念

```
BattleGame（新增）
  ├── Player 1 (Game 實例 - 重用現有)
  ├── Player 2 (Game 實例 - 重用現有)
  ├── Attack Queue 1 (待發送給玩家1的垃圾)
  └── Attack Queue 2 (待發送給玩家2的垃圾)
```

**關鍵設計原則**：
- ✅ **組合模式**：重用現有 Game，不重寫
- ✅ **最小侵入**：只擴充 Grid 和微調 Game
- ✅ **獨立測試**：每個組件可單獨測試

### 攻擊流程（30 秒理解）

```
P1 消 3 行 → Game記錄 → BattleGame偵測 → 計算垃圾(2行) → 加入P2底部
```

## 前置需求

### 已具備
- ✅ Node.js 18+
- ✅ 現有 Tetris 單人遊戲程式碼
- ✅ Jest 測試環境
- ✅ Vite 開發伺服器

### 需要了解的現有架構

1. **Game** (`src/game/Game.js`)：單人遊戲控制器
2. **GameState** (`src/models/GameState.js`)：遊戲狀態管理
3. **Grid** (`src/models/Grid.js`)：遊戲網格（10x20）
4. **Renderer** (`src/rendering/Renderer.js`)：Canvas 渲染器

**花 10 分鐘閱讀**：
```bash
cat src/game/Game.js | grep "class Game" -A 50
cat src/models/Grid.js | grep "class Grid" -A 30
```

## 開發環境設置

### 1. 確認分支

```bash
git branch  # 應該在 002-two-player-battle
git status  # 確認乾淨的工作區
```

### 2. 執行現有測試

```bash
npm test  # 確保所有 369 個測試通過
```

### 3. 啟動開發伺服器

```bash
npm run dev  # 開啟 http://localhost:3000
```

## 開發順序（TDD 方式）

### Phase 1: Grid 垃圾行支援（預估 2 小時）

#### 1.1 寫測試

```bash
touch tests/unit/Grid.test.js  # 如果不存在
```

新增測試到 `Grid.test.js`：

```javascript
describe('Garbage Lines', () => {
  let grid;

  beforeEach(() => {
    grid = new Grid(10, 20);
  });

  test('should add single garbage line at bottom', () => {
    grid.addGarbageLines(1);

    // 底部行應該有 9 個垃圾方塊 + 1 個空隙
    const bottomRow = grid.cells[0];
    const filledCount = bottomRow.filter(cell => cell === GARBAGE_COLOR).length;
    const emptyCount = bottomRow.filter(cell => cell === null).length;

    expect(filledCount).toBe(9);
    expect(emptyCount).toBe(1);
  });

  test('should add multiple garbage lines', () => {
    grid.addGarbageLines(3);

    // 底部 3 行都應該是垃圾行
    for (let i = 0; i < 3; i++) {
      const row = grid.cells[i];
      const filledCount = row.filter(cell => cell === GARBAGE_COLOR).length;
      expect(filledCount).toBe(9); // 每行 9 個垃圾方塊
    }
  });

  test('should throw error if no space for garbage', () => {
    // 填滿頂部
    for (let x = 0; x < 10; x++) {
      grid.cells[0][x] = '#FF0000';
    }

    expect(() => {
      grid.addGarbageLines(1);
    }).toThrow('Grid overflow');
  });
});
```

#### 1.2 執行測試（應失敗）

```bash
npm test -- tests/unit/Grid.test.js
# 預期：3 個測試失敗（方法不存在）
```

#### 1.3 實作功能

編輯 `src/models/Grid.js`：

```javascript
// 新增常數（或從 Constants.js 匯入）
import { GARBAGE_COLOR } from '../utils/Constants.js';

// 在 Grid 類別中新增方法
addGarbageLines(count) {
  // 檢查空間
  if (!this.canAddGarbageLines(count)) {
    throw new Error('Grid overflow - cannot add garbage lines');
  }

  for (let i = 0; i < count; i++) {
    this.cells.pop(); // 移除頂部空行
    const garbageLine = this.createGarbageLine();
    this.cells.unshift(garbageLine); // 加入底部
  }
}

createGarbageLine() {
  const line = Array(this.width).fill(GARBAGE_COLOR);
  const gapPosition = Math.floor(Math.random() * this.width);
  line[gapPosition] = null;
  return line;
}

canAddGarbageLines(count) {
  for (let row = 0; row < count && row < this.height; row++) {
    if (this.cells[row].some(cell => cell !== null)) {
      return false;
    }
  }
  return true;
}
```

#### 1.4 執行測試（應通過）

```bash
npm test -- tests/unit/Grid.test.js
# 預期：所有新測試通過 ✅
```

---

### Phase 2: Game 攻擊資訊暴露（預估 1 小時）

#### 2.1 寫測試

新增測試到 `tests/unit/Game.test.js`：

```javascript
describe('Attack Information', () => {
  let game;

  beforeEach(() => {
    game = new Game(false); // 測試模式
    game.start();
  });

  test('should record cleared lines', () => {
    // 手動觸發消行（可能需要 helper）
    // ... 設置遊戲狀態讓玩家消 2 行

    const cleared = game.getLastClearedLines();
    expect(cleared).toBe(2);
  });

  test('should reset cleared lines after read', () => {
    // 消 3 行
    // ...

    const first = game.getLastClearedLines();
    const second = game.getLastClearedLines();

    expect(first).toBe(3);
    expect(second).toBe(0); // 已重置
  });
});
```

#### 2.2 實作

編輯 `src/game/Game.js`：

```javascript
constructor(enableAnimations = true) {
  // ... 現有程式碼
  this.lastClearedLines = 0; // 新增
}

clearLines() {
  const completeRows = this.state.grid.getCompleteRows();

  if (completeRows.length > 0) {
    this.lastClearedLines = completeRows.length; // 記錄
    // ... 現有消行邏輯
  } else {
    this.lastClearedLines = 0;
  }
}

getLastClearedLines() {
  const result = this.lastClearedLines || 0;
  this.lastClearedLines = 0; // 重置
  return result;
}

addGarbageLines(count) {
  this.state.grid.addGarbageLines(count);
}
```

---

### Phase 3: BattleGame 協調器（預估 4 小時）

#### 3.1 寫測試

建立 `tests/unit/BattleGame.test.js`：

```javascript
import { BattleGame } from '../../src/game/BattleGame.js';

describe('BattleGame', () => {
  let battle;

  beforeEach(() => {
    battle = new BattleGame(false);
  });

  describe('Initialization', () => {
    test('should initialize with two players', () => {
      expect(battle.player1).toBeDefined();
      expect(battle.player2).toBeDefined();
    });

    test('should start with no winner', () => {
      expect(battle.getWinner()).toBeNull();
    });
  });

  describe('Lifecycle', () => {
    test('should start both players', () => {
      battle.start();
      expect(battle.player1.isRunning).toBe(true);
      expect(battle.player2.isRunning).toBe(true);
    });

    test('should pause both players', () => {
      battle.start();
      battle.pause();
      // 檢查兩位玩家都暫停
    });
  });

  describe('Attack System', () => {
    test('should calculate garbage for 2 lines cleared', () => {
      const garbage = battle.calculateGarbage(2, 1);
      expect(garbage).toBe(1);
    });

    test('should calculate garbage with combo bonus', () => {
      const garbage = battle.calculateGarbage(3, 3); // 2 + 2
      expect(garbage).toBe(4);
    });

    test('should send garbage to opponent when player clears lines', () => {
      // 模擬玩家1消2行
      // 檢查玩家2的攻擊隊列有1行垃圾
    });
  });
});
```

#### 3.2 實作

建立 `src/game/BattleGame.js`：

```javascript
import { Game } from './Game.js';
import { ATTACK_TABLE, getComboBonus, MAX_ATTACK_QUEUE_LENGTH } from '../utils/Constants.js';

export class BattleGame {
  constructor(enableAnimations = true) {
    this.player1 = new Game(enableAnimations);
    this.player2 = new Game(enableAnimations);
    this.attackQueue1 = [];
    this.attackQueue2 = [];
    this.winner = null;
    this.isRunning = false;
  }

  start() {
    this.player1.start();
    this.player2.start();
    this.isRunning = true;
  }

  update(deltaTime) {
    if (!this.isRunning || this.winner) return;

    this.player1.update(deltaTime);
    this.player2.update(deltaTime);

    this.processAttacks();
    this.checkGameOver();
  }

  processAttacks() {
    // 檢查玩家1是否消行
    const p1Cleared = this.player1.getLastClearedLines();
    if (p1Cleared >= 2) {
      const garbage = this.calculateGarbage(p1Cleared, this.player1.getCombo());
      this.attackQueue2.push(garbage);
    }

    // 檢查玩家2是否消行
    const p2Cleared = this.player2.getLastClearedLines();
    if (p2Cleared >= 2) {
      const garbage = this.calculateGarbage(p2Cleared, this.player2.getCombo());
      this.attackQueue1.push(garbage);
    }

    // 加入垃圾行（每幀最多1行）
    if (this.attackQueue1.length > 0) {
      try {
        this.player1.addGarbageLines(this.attackQueue1.shift());
      } catch (e) {
        this.winner = 2; // 玩家1因垃圾溢出而失敗
      }
    }

    if (this.attackQueue2.length > 0) {
      try {
        this.player2.addGarbageLines(this.attackQueue2.shift());
      } catch (e) {
        this.winner = 1; // 玩家2因垃圾溢出而失敗
      }
    }
  }

  calculateGarbage(linesCleared, combo) {
    const baseAttack = ATTACK_TABLE[linesCleared] || 0;
    const comboBonus = getComboBonus(combo);
    return baseAttack + comboBonus;
  }

  checkGameOver() {
    const p1Over = this.player1.getState().status === 'GAME_OVER';
    const p2Over = this.player2.getState().status === 'GAME_OVER';

    if (p1Over && p2Over) {
      this.winner = 'draw'; // 平局
    } else if (p1Over) {
      this.winner = 2;
    } else if (p2Over) {
      this.winner = 1;
    }

    if (this.winner) {
      this.isRunning = false;
    }
  }

  getWinner() {
    return this.winner;
  }

  getPlayer(num) {
    return num === 1 ? this.player1 : this.player2;
  }
}
```

---

### Phase 4: 渲染與輸入（預估 3 小時）

略（請參考完整實作規劃）

---

## 常用指令

### 測試

```bash
# 執行所有測試
npm test

# 執行特定測試檔案
npm test -- tests/unit/BattleGame.test.js

# 監視模式（開發時）
npm test -- --watch

# 測試覆蓋率
npm test -- --coverage
```

### 開發

```bash
# 啟動開發伺服器
npm run dev

# 建置
npm run build

# 程式碼檢查
npm run lint
npm run lint:fix
```

### Git

```bash
# 查看變更
git status
git diff

# 提交（記得先跑測試！）
npm test && git add . && git commit -m "feat: implement BattleGame core"

# 查看分支
git branch
```

## 常見問題

### Q: 測試失敗怎麼辦？

1. 檢查錯誤訊息，通常很明確
2. 使用 `console.log()` 除錯
3. 確認有 import 相關常數（`GARBAGE_COLOR`, `ATTACK_TABLE`）
4. 測試模式下記得傳 `false` 給 Game/BattleGame（禁用動畫）

### Q: 如何模擬玩家消行？

```javascript
// 測試 helper
function setupClearableLine(game) {
  // 填滿底部一行（留一個空隙）
  for (let x = 0; x < 9; x++) {
    game.state.grid.setCell(x, 19, '#FF0000');
  }
  // 放置方塊填補空隙
  // ...
}
```

### Q: 垃圾行顏色如何定義？

在 `src/utils/Constants.js` 新增：

```javascript
export const GARBAGE_COLOR = '#808080'; // 灰色
```

### Q: 如何確認效能？

```javascript
console.time('update');
battle.update(16);
console.timeEnd('update');
// 應該 < 10ms
```

## 除錯技巧

### 1. 視覺化網格

```javascript
function printGrid(grid) {
  grid.cells.forEach((row, y) => {
    console.log(y, row.map(cell => cell ? '■' : '□').join(''));
  });
}
```

### 2. 追蹤攻擊

```javascript
// 在 processAttacks() 中
console.log(`P1 cleared: ${p1Cleared}, sending ${garbage} to P2`);
```

### 3. 檢查狀態

```javascript
console.log({
  p1Score: battle.player1.getState().score,
  p2Score: battle.player2.getState().score,
  queue1: battle.attackQueue1,
  queue2: battle.attackQueue2,
  winner: battle.winner,
});
```

## 下一步

完成上述 Phase 1-3 後：

1. ✅ 執行所有測試確認無迴歸
2. ✅ 執行 `npm run lint` 確認程式碼風格
3. ✅ 提交到 Git
4. ▶️ 繼續 Phase 4：實作 BattleRenderer 和輸入路由
5. ▶️ 參考 `/speckit.tasks` 生成詳細任務清單

## 參考資料

- **Spec**: [spec.md](./spec.md) - 功能規格
- **Research**: [research.md](./research.md) - 技術決策
- **Data Model**: [data-model.md](./data-model.md) - 資料結構
- **Contract**: [contracts/BattleGame.md](./contracts/BattleGame.md) - API 契約
- **CLAUDE.md**: 專案架構總覽

## 取得協助

遇到問題？
1. 檢查測試錯誤訊息
2. 查看 [data-model.md](./data-model.md) 確認資料流向
3. 參考現有 `Game.js` 的實作模式
4. 使用 `console.log()` 除錯關鍵變數

**祝開發順利！** 🎮✨
