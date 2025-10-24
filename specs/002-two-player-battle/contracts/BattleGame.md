# Contract: BattleGame Class

**Version**: 1.0.0 | **Date**: 2025-10-23
**Purpose**: 定義 BattleGame 類別的公開介面契約

## Class: BattleGame

協調雙玩家俄羅斯方塊對戰的控制器類別。

### Constructor

```javascript
/**
 * 建立新的對戰遊戲實例
 * @param {boolean} enableAnimations - 是否啟用動畫（預設 true，測試模式可設為 false）
 */
constructor(enableAnimations = true)
```

**Post-conditions**:
- `player1` 和 `player2` 已初始化為 Game 實例
- `attackQueue1` 和 `attackQueue2` 為空陣列
- `winner` 為 null
- `isRunning` 為 false

**Example**:
```javascript
const battle = new BattleGame();
const battleTest = new BattleGame(false); // 測試模式
```

---

### Public Methods

#### start()

```javascript
/**
 * 開始對戰遊戲
 * @throws {Error} 如果遊戲已在運行中
 */
start(): void
```

**Pre-conditions**:
- 遊戲尚未開始（`isRunning === false`）

**Post-conditions**:
- 兩位玩家的遊戲都已開始
- `isRunning === true`
- `winner === null`
- `lastUpdateTime` 已設定為當前時間

**Side Effects**:
- 呼叫 `player1.start()` 和 `player2.start()`
- 記錄遊戲開始日誌

**Example**:
```javascript
battle.start();
console.log(battle.isRunning); // true
```

---

#### pause()

```javascript
/**
 * 暫停對戰遊戲（同時凍結雙方）
 * @throws {Error} 如果遊戲未在 PLAYING 狀態
 */
pause(): void
```

**Pre-conditions**:
- 遊戲正在運行且未暫停

**Post-conditions**:
- 兩位玩家都進入暫停狀態

**Example**:
```javascript
battle.pause();
```

---

#### resume()

```javascript
/**
 * 恢復對戰遊戲
 * @throws {Error} 如果遊戲未在 PAUSED 狀態
 */
resume(): void
```

**Pre-conditions**:
- 遊戲處於暫停狀態

**Post-conditions**:
- 兩位玩家都恢復遊戲
- `lastUpdateTime` 重設為當前時間（避免時間跳躍）

**Example**:
```javascript
battle.resume();
```

---

#### update(deltaTime)

```javascript
/**
 * 更新對戰遊戲狀態（每幀呼叫）
 * @param {number} deltaTime - 距離上次更新的時間（毫秒）
 */
update(deltaTime: number): void
```

**Pre-conditions**:
- `deltaTime` 為非負數
- 遊戲處於 PLAYING 狀態

**Post-conditions**:
- 兩位玩家的遊戲狀態已更新
- 攻擊已處理（如果有消行）
- 勝負已判定（如果有玩家失敗）

**Side Effects**:
- 呼叫 `player1.update(deltaTime)` 和 `player2.update(deltaTime)`
- 可能加入垃圾行到玩家網格
- 可能設定 `winner` 並結束遊戲

**Example**:
```javascript
// 在遊戲循環中
function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  battle.update(deltaTime);
  // ...
}
```

---

#### processAttacks()

```javascript
/**
 * 處理玩家間的攻擊
 * - 檢查雙方是否有消行
 * - 計算攻擊強度
 * - 加入垃圾行到對手隊列
 * @private（由 update 呼叫，不應直接呼叫）
 */
processAttacks(): void
```

**Post-conditions**:
- 如果有消行，對應的攻擊已加入對手的攻擊隊列
- 攻擊隊列中的垃圾行已嘗試加入對手網格

---

#### calculateGarbage(linesCleared, combo)

```javascript
/**
 * 計算垃圾行數量
 * @param {number} linesCleared - 消除的行數（1-4）
 * @param {number} combo - 當前連擊數（≥1）
 * @returns {number} 應發送的垃圾行數量
 */
calculateGarbage(linesCleared: number, combo: number): number
```

**Formula**:
```
garbage = ATTACK_TABLE[linesCleared] + getComboBonus(combo)
```

**Examples**:
```javascript
calculateGarbage(2, 1) // → 1 + 0 = 1
calculateGarbage(3, 2) // → 2 + 1 = 3
calculateGarbage(4, 5) // → 4 + 3 = 7
```

**Test Cases**:
| Lines | Combo | Expected | Notes |
|-------|-------|----------|-------|
| 1 | 1 | 0 | 不攻擊 |
| 2 | 1 | 1 | 基礎攻擊 |
| 3 | 1 | 2 | 基礎攻擊 |
| 4 | 1 | 4 | Tetris |
| 2 | 2 | 2 | 1 + 1 連擊加成 |
| 3 | 3 | 4 | 2 + 2 連擊加成 |
| 4 | 4 | 7 | 4 + 3 連擊加成 |
| 4 | 10 | 7 | 4 + 3（上限） |

---

#### sendGarbageToPlayer(playerNum, garbageCount)

```javascript
/**
 * 發送垃圾行到指定玩家
 * @param {1 | 2} playerNum - 目標玩家編號
 * @param {number} garbageCount - 垃圾行數量
 * @throws {GridOverflowError} 如果無法加入（導致玩家失敗）
 */
sendGarbageToPlayer(playerNum: 1 | 2, garbageCount: number): void
```

**Pre-conditions**:
- `playerNum` 為 1 或 2
- `garbageCount > 0`

**Post-conditions**:
- 垃圾行已加入目標玩家的攻擊隊列
- 或立即加入網格（如果隊列已滿）

**Error Handling**:
- 如果加入垃圾導致 Grid overflow，捕捉錯誤並判定該玩家失敗

---

#### checkGameOver()

```javascript
/**
 * 檢查遊戲是否結束
 * @returns {1 | 2 | null} 勝利者編號，或 null（遊戲繼續）
 */
checkGameOver(): 1 | 2 | null
```

**Post-conditions**:
- 如果偵測到勝負，設定 `winner` 並停止遊戲

**Logic**:
```
IF player1.status === GAME_OVER AND player2.status === GAME_OVER
  → 平局（或根據分數判定）
ELSE IF player1.status === GAME_OVER
  → winner = 2
ELSE IF player2.status === GAME_OVER
  → winner = 1
ELSE
  → null
```

---

### Public Getters

#### getWinner()

```javascript
/**
 * 獲取勝利者
 * @returns {1 | 2 | null} 勝利者編號，或 null（遊戲未結束）
 */
getWinner(): 1 | 2 | null
```

---

#### getPlayer(num)

```javascript
/**
 * 獲取指定玩家的遊戲實例
 * @param {1 | 2} num - 玩家編號
 * @returns {Game} 玩家的 Game 實例
 * @throws {Error} 如果 num 不是 1 或 2
 */
getPlayer(num: 1 | 2): Game
```

**Example**:
```javascript
const p1Score = battle.getPlayer(1).getState().score;
const p2Level = battle.getPlayer(2).getState().level;
```

---

#### getAttackQueueLength(playerNum)

```javascript
/**
 * 獲取玩家待收到的垃圾行數量
 * @param {1 | 2} playerNum - 玩家編號
 * @returns {number} 攻擊隊列長度
 */
getAttackQueueLength(playerNum: 1 | 2): number
```

**Example**:
```javascript
const incoming = battle.getAttackQueueLength(1);
console.log(`Player 1 incoming: ${incoming} lines`);
```

---

## State Machine

```
┌──────┐  start()   ┌─────────┐  pause()  ┌────────┐
│ IDLE │─────────→  │ PLAYING │─────────→ │ PAUSED │
└──────┘            └────┬────┘           └───┬────┘
                         │                    │
                         │ resume()           │
                         │←───────────────────┘
                         │
                         │ player loses
                         ↓
                    ┌──────────┐
                    │GAME_OVER │
                    └──────────┘
```

## Error Handling

### GridOverflowError

當垃圾行無法加入（頂部已滿）時拋出。

```javascript
try {
  battle.sendGarbageToPlayer(2, 5);
} catch (e) {
  if (e instanceof GridOverflowError) {
    console.log(`Player ${e.playerNum} loses due to overflow`);
  }
}
```

### InvalidStateError

當在錯誤的狀態呼叫方法時拋出。

```javascript
battle.pause(); // 如果遊戲未開始 → Error
```

## Performance Guarantees

| Operation | Time Complexity | Max Time |
|-----------|-----------------|----------|
| `update()` | O(1) | 10ms |
| `processAttacks()` | O(1) | 1ms |
| `calculateGarbage()` | O(1) | 0.1ms |
| `sendGarbageToPlayer()` | O(n) n=garbageCount | 0.5ms |
| `checkGameOver()` | O(1) | 0.1ms |

## Compatibility

- 相容現有 `Game` 類別介面
- 不修改 `Game` 類別的公開 API
- 只依賴 `Game` 的公開方法

## Testing Contract

所有實作 `BattleGame` 的類別必須通過以下契約測試：

1. **初始化測試**：constructor 正確初始化所有 fields
2. **生命週期測試**：start/pause/resume 狀態轉換正確
3. **攻擊測試**：各種消行數與連擊組合的垃圾計算正確
4. **隊列測試**：攻擊隊列正確管理（加入、取出、上限）
5. **勝負測試**：各種失敗情境（單方、雙方同時）正確判定
6. **錯誤測試**：錯誤狀態呼叫正確拋出異常
7. **效能測試**：所有操作在時間預算內

## Version History

- **1.0.0** (2025-10-23): 初始版本
