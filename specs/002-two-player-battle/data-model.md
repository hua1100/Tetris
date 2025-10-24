# Data Model: Two-Player Battle Mode

**Feature**: 002-two-player-battle | **Date**: 2025-10-23
**Purpose**: 定義對戰模式的資料結構與實體關係

## Overview

對戰模式擴充現有的資料模型，新增對戰協調層和垃圾行系統。核心設計原則：重用現有模型，最小化侵入性修改。

## Entity Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        BattleGame                            │
│  職責：協調雙玩家遊戲、處理攻擊、判定勝負                       │
├─────────────────────────────────────────────────────────────┤
│ - player1: Game                                              │
│ - player2: Game                                              │
│ - attackQueue1: number[]  (待發送給玩家1的垃圾行數量)          │
│ - attackQueue2: number[]  (待發送給玩家2的垃圾行數量)          │
│ - winner: Player | null                                      │
│ - gameMode: GameMode                                         │
└───────────┬─────────────────────────────┬───────────────────┘
            │                             │
            │ 包含                         │ 包含
            │                             │
            ▼                             ▼
    ┌──────────────┐              ┌──────────────┐
    │  Game (P1)   │              │  Game (P2)   │
    │  (現有類別)   │              │  (現有類別)   │
    └──────┬───────┘              └──────┬───────┘
           │                             │
           │ 包含                         │ 包含
           │                             │
           ▼                             ▼
    ┌──────────────┐              ┌──────────────┐
    │ GameState    │              │ GameState    │
    │  (現有)       │              │  (現有)       │
    └──────┬───────┘              └──────┬───────┘
           │                             │
           │ 包含                         │ 包含
           │                             │
           ▼                             ▼
    ┌──────────────┐              ┌──────────────┐
    │   Grid       │◄─────────────┤   Grid       │
    │  (擴充)       │  垃圾行加入   │  (擴充)       │
    └──────────────┘              └──────────────┘
```

## Core Entities

### 1. BattleGame (新增)

**職責**：協調雙玩家遊戲，處理玩家間的攻擊與互動，判定勝負。

**Fields**:
```javascript
{
  player1: Game,              // 玩家 1 的遊戲實例
  player2: Game,              // 玩家 2 的遊戲實例
  attackQueue1: number[],     // 待發送給玩家 1 的垃圾行隊列
  attackQueue2: number[],     // 待發送給玩家 2 的垃圾行隊列
  winner: 1 | 2 | null,       // 勝利者（null = 遊戲進行中）
  gameMode: 'battle',         // 遊戲模式標識
  isRunning: boolean,         // 遊戲是否運行中
  lastUpdateTime: number,     // 上次更新時間戳
}
```

**Key Methods**:
```javascript
// 初始化
constructor(enableAnimations = true)

// 遊戲流程
start()                           // 開始對戰
pause()                           // 暫停（同時凍結雙方）
resume()                          // 恢復
update(deltaTime)                 // 更新雙方遊戲並處理攻擊

// 攻擊處理
processAttacks()                  // 檢查消行並發送攻擊
calculateGarbage(linesCleared, combo): number  // 計算垃圾行數量
sendGarbageToPlayer(playerNum, garbageCount)   // 加入垃圾行到對手

// 勝負判定
checkGameOver(): 1 | 2 | null    // 檢查是否有玩家失敗

// 狀態查詢
getWinner(): 1 | 2 | null        // 獲取勝利者
getPlayer(num): Game             // 獲取指定玩家實例
```

**Validation Rules**:
- 雙方玩家必須同時開始（start() 呼叫兩個 Game.start()）
- 暫停必須同時凍結雙方（避免不公平）
- 垃圾行不能無限累積（最大隊列長度 20，超過則立即加入）

**State Transitions**:
```
IDLE → (start) → PLAYING
PLAYING → (pause) → PAUSED
PAUSED → (resume) → PLAYING
PLAYING → (player loses) → GAME_OVER
```

### 2. Grid (擴充現有)

**新增職責**：支援垃圾行的加入與管理。

**新增 Fields**:
```javascript
{
  // 現有 fields 保持不變：width, height, cells
}
```

**新增 Methods**:
```javascript
// 垃圾行操作
addGarbageLines(count)           // 從底部加入 count 行垃圾
createGarbageLine(): Array       // 建立單行垃圾（含隨機空隙）
canAddGarbageLines(count): boolean  // 檢查是否有空間加入垃圾
```

**Implementation Details**:

`addGarbageLines(count)` 邏輯：
```javascript
addGarbageLines(count) {
  // 1. 檢查頂部是否有足夠空間
  if (!this.canAddGarbageLines(count)) {
    throw new Error('Grid overflow - cannot add garbage lines');
  }

  // 2. 對每行垃圾
  for (let i = 0; i < count; i++) {
    // 2a. 移除最頂部的空行
    this.cells.pop();

    // 2b. 在底部插入新的垃圾行
    const garbageLine = this.createGarbageLine();
    this.cells.unshift(garbageLine);
  }
}

createGarbageLine() {
  // 建立全灰色行
  const line = Array(this.width).fill(GARBAGE_COLOR);

  // 隨機選擇一個空隙位置（0 到 width-1）
  const gapPosition = Math.floor(Math.random() * this.width);
  line[gapPosition] = null;

  return line;
}

canAddGarbageLines(count) {
  // 檢查頂部 count 行是否全空
  for (let row = 0; row < count && row < this.height; row++) {
    if (this.cells[row].some(cell => cell !== null)) {
      return false;
    }
  }
  return true;
}
```

### 3. Game (微調現有)

**新增職責**：記錄最近消行數量供 BattleGame 讀取。

**新增 Fields**:
```javascript
{
  lastClearedLines: number,    // 最近一次消除的行數（供 BattleGame 讀取）
  // 其他現有 fields 保持不變
}
```

**新增 Methods**:
```javascript
// 攻擊資訊查詢
getLastClearedLines(): number    // 獲取並重置最近消行數
addGarbageLines(count)           // 接收對手攻擊（委派給 Grid）
```

**Modification Points**:
```javascript
// 在 clearLines() 方法中新增
clearLines() {
  const completeRows = this.state.grid.getCompleteRows();

  if (completeRows.length > 0) {
    this.lastClearedLines = completeRows.length; // ← 新增：記錄消行數

    // ... 現有消行邏輯
  } else {
    this.lastClearedLines = 0; // ← 新增：無消行則清零
  }
}

// 新增方法
getLastClearedLines() {
  const result = this.lastClearedLines || 0;
  this.lastClearedLines = 0; // 重置，避免重複讀取
  return result;
}

addGarbageLines(count) {
  this.state.grid.addGarbageLines(count);
}
```

### 4. GameState (無需修改)

保持現有結構不變。BattleGame 不直接操作 GameState，而是透過 Game 介面。

## Data Flow

### 攻擊流程

```
Player 1 消除 3 行
    ↓
Game 1 記錄 lastClearedLines = 3
    ↓
BattleGame.update() 檢測到 player1.getLastClearedLines() = 3
    ↓
計算垃圾行：ATTACK_TABLE[3] + 連擊加成 = 2 + 加成
    ↓
加入 attackQueue2 = [2]
    ↓
下一幀：player2.addGarbageLines(2)
    ↓
Player 2 的 Grid 底部加入 2 行垃圾
```

### 勝負判定流程

```
Player 1 鎖定方塊
    ↓
Game 1 的 checkGameOver() 偵測到新方塊無法放入
    ↓
Game 1 狀態變為 GAME_OVER
    ↓
BattleGame.checkGameOver() 檢測到 player1.status === GAME_OVER
    ↓
設定 winner = 2, 停止遊戲
    ↓
顯示結果畫面
```

## Constants

新增對戰相關常數到 `src/utils/Constants.js`：

```javascript
// 遊戲模式
export const GameMode = Object.freeze({
  SINGLE_PLAYER: 'SINGLE_PLAYER',
  BATTLE: 'BATTLE',
});

// 垃圾行顏色
export const GARBAGE_COLOR = '#808080'; // 灰色

// 攻擊表（消行數 → 垃圾行數）
export const ATTACK_TABLE = Object.freeze({
  1: 0,  // 消 1 行不攻擊
  2: 1,  // 消 2 行送 1 行垃圾
  3: 2,  // 消 3 行送 2 行垃圾
  4: 4,  // 消 4 行送 4 行垃圾（Tetris）
});

// 連擊加成表
export const COMBO_BONUS = Object.freeze({
  1: 0,  // 無連擊
  2: 1,  // 2 連擊 +1 行
  3: 2,  // 3 連擊 +2 行
  // 4 以上統一 +3
});

export function getComboBonus(combo) {
  return combo >= 4 ? 3 : (COMBO_BONUS[combo] || 0);
}

// 玩家 1 按鍵映射
export const PLAYER1_KEY_BINDINGS = Object.freeze({
  KeyW: InputCommand.ROTATE_CW,
  KeyA: InputCommand.MOVE_LEFT,
  KeyS: InputCommand.MOVE_DOWN,
  KeyD: InputCommand.MOVE_RIGHT,
  Space: InputCommand.HARD_DROP,
});

// 玩家 2 按鍵映射
export const PLAYER2_KEY_BINDINGS = Object.freeze({
  ArrowUp: InputCommand.ROTATE_CW,
  ArrowLeft: InputCommand.MOVE_LEFT,
  ArrowDown: InputCommand.MOVE_DOWN,
  ArrowRight: InputCommand.MOVE_RIGHT,
  Enter: InputCommand.HARD_DROP,
});

// 暫停鍵（共用）
export const PAUSE_KEY = 'KeyP';

// 攻擊隊列最大長度
export const MAX_ATTACK_QUEUE_LENGTH = 20;
```

## Rendering Data

### BattleRenderer 渲染資料

```javascript
{
  player1State: GameState,      // 玩家 1 的遊戲狀態
  player2State: GameState,      // 玩家 2 的遊戲狀態
  player1Combo: number,         // 玩家 1 當前連擊
  player2Combo: number,         // 玩家 2 當前連擊
  attackQueue1Length: number,   // 玩家 1 待收到的攻擊數
  attackQueue2Length: number,   // 玩家 2 待收到的攻擊數
  winner: 1 | 2 | null,         // 勝利者
}
```

### 畫面佈局

```
┌─────────────────────────────────────────────────────────┐
│                    Two-Player Battle                     │
├──────────────────────┬──────────────────────────────────┤
│   Player 1           │   Player 2                        │
│   ┌────────────┐     │   ┌────────────┐                 │
│   │   Grid     │     │   │   Grid     │                 │
│   │            │     │   │            │                 │
│   │            │     │   │            │                 │
│   └────────────┘     │   └────────────┘                 │
│   Next: [□]          │   Next: [□]                       │
│   Score: 1234        │   Score: 5678                     │
│   Level: 3           │   Level: 4                        │
│   Lines: 15          │   Lines: 23                       │
│   Combo: 5x 🔥       │   Combo: 2x                       │
│   Incoming: ⚠️ 3     │   Incoming: ⚠️ 1                  │
└──────────────────────┴──────────────────────────────────┘
│                    [P] Pause                             │
└─────────────────────────────────────────────────────────┘
```

## Validation & Constraints

### Business Rules

1. **垃圾行規則**
   - 只有消除 2 行或以上才發送攻擊
   - 垃圾行必須有且只有一個隨機空隙
   - 垃圾行顏色固定為灰色（#808080）

2. **攻擊隊列**
   - 每幀最多加入 1 行垃圾（避免瞬間大量加入）
   - 隊列長度上限 20 行（防止無限累積）
   - 超過上限時立即加入（可能導致玩家失敗）

3. **勝負判定**
   - 任一玩家無法放入新方塊時立即失敗
   - 對手自動獲勝
   - 同時失敗（極罕見）判定為平局

4. **暫停行為**
   - 暫停必須同時凍結雙方
   - 暫停期間不處理輸入
   - 恢復時重設時間戳（避免時間跳躍）

### Performance Constraints

- 垃圾行加入操作必須 <0.5ms（使用陣列 shift/unshift）
- 攻擊計算必須 <0.1ms（簡單查表）
- 勝負判定必須 <0.1ms（狀態檢查）

### Error Handling

```javascript
// Grid overflow 錯誤
class GridOverflowError extends Error {
  constructor(playerNum) {
    super(`Player ${playerNum} grid overflow - cannot add garbage lines`);
    this.playerNum = playerNum;
  }
}

// BattleGame 使用
try {
  this.player2.addGarbageLines(count);
} catch (e) {
  if (e instanceof GridOverflowError) {
    // 玩家 2 因垃圾溢出而失敗
    this.winner = 1;
    this.gameOver();
  }
}
```

## Migration Path

從現有單人模式遷移到支援對戰模式：

### Phase 1: 基礎架構
1. 新增 `GARBAGE_COLOR`, `ATTACK_TABLE`, `COMBO_BONUS` 常數
2. 擴充 `Grid.addGarbageLines()` 和相關方法
3. 微調 `Game.clearLines()` 記錄 `lastClearedLines`

### Phase 2: 對戰核心
4. 實作 `BattleGame` 類別
5. 實作攻擊處理邏輯
6. 實作勝負判定

### Phase 3: 渲染與輸入
7. 實作 `BattleRenderer`
8. 實作雙玩家輸入路由
9. 新增模式選擇 UI

**關鍵原則**：每個 Phase 都可獨立測試，單人模式始終保持可用。

## Testing Strategy

### Unit Tests

- `Grid.addGarbageLines()` - 15 tests
  - 正常加入 1-4 行
  - 空隙位置隨機性
  - 溢出錯誤處理
  - 邊界條件（頂部有方塊）

- `BattleGame` - 40 tests
  - 初始化與開始
  - 雙玩家更新
  - 攻擊計算（各種消行數與連擊組合）
  - 攻擊隊列管理
  - 勝負判定
  - 暫停/恢復行為

### Integration Tests

- 完整對戰流程 - 20 tests
  - 雙方消行與攻擊循環
  - 垃圾行清除
  - 一方失敗的勝負判定
  - 同時失敗的平局判定

**目標覆蓋率**: 維持 80% 以上。

## Summary

資料模型設計完成，關鍵決策：

✅ **最小侵入**：只擴充 Grid 和微調 Game，不破壞現有架構
✅ **組合模式**：BattleGame 協調兩個獨立 Game 實例
✅ **簡單明確**：攻擊系統使用查表法，垃圾行用現有 Grid 機制
✅ **可測試**：每個實體職責清晰，易於單元測試

**下一步**：Phase 1 繼續 - 生成 API 契約和快速入門文件。
