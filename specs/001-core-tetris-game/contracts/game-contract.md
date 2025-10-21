# Game API 合約

**模組**: `src/game/Game.js`
**職責**: 遊戲主控制器，協調所有子系統，管理遊戲循環

---

## 類別：Game

### 建構子

```javascript
constructor()
```

**用途**: 初始化遊戲實例

**後置條件**:
- `gameState` 初始化為 `IDLE` 狀態
- 所有子系統（渲染器、輸入處理器等）已建立

**範例**:
```javascript
const game = new Game();
```

---

### start()

```javascript
start(): void
```

**用途**: 開始新遊戲

**前置條件**: 無（可隨時呼叫）

**後置條件**:
- 遊戲狀態變更為 `PLAYING`
- 遊戲板清空
- 分數、等級重設為初始值
- 生成第一個方塊
- 遊戲循環啟動

**副作用**: ✅ 修改 `gameState`

**日誌**: 發送 `GAME_START` 事件

**範例**:
```javascript
game.start();
// 遊戲狀態 -> PLAYING
```

---

### pause()

```javascript
pause(): void
```

**用途**: 暫停遊戲

**前置條件**: 遊戲狀態為 `PLAYING`

**後置條件**:
- 遊戲狀態變更為 `PAUSED`
- 遊戲循環暫停（方塊停止下落）

**副作用**: ✅ 修改 `gameState`

**日誌**: 發送 `GAME_PAUSE` 事件

---

### resume()

```javascript
resume(): void
```

**用途**: 恢復遊戲

**前置條件**: 遊戲狀態為 `PAUSED`

**後置條件**:
- 遊戲狀態變更為 `PLAYING`
- 遊戲循環恢復

**副作用**: ✅ 修改 `gameState`

**日誌**: 發送 `GAME_RESUME` 事件

---

### update(deltaTime)

```javascript
update(deltaTime: number): void
```

**用途**: 更新遊戲邏輯（每幀呼叫）

**參數**:
- `deltaTime` (number): 距離上次更新的時間差（毫秒）

**前置條件**: 遊戲狀態為 `PLAYING`

**後置條件**:
- 累積時間達到下落速度時，方塊自動下落
- 若方塊無法下落，則固定方塊並生成新方塊
- 檢查並消除完整的橫列
- 檢查遊戲結束條件

**副作用**: ✅ 修改 `gameState`, `currentPiece`, `grid`

**日誌**: 可能發送 `PIECE_MOVE`, `PIECE_LOCK`, `LINE_CLEAR`, `GAME_OVER` 事件

**範例**:
```javascript
function gameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  game.update(deltaTime);
  game.render();
  requestAnimationFrame(gameLoop);
}
```

---

### render()

```javascript
render(): void
```

**用途**: 渲染當前遊戲狀態到 Canvas

**前置條件**: 無

**後置條件**: Canvas 顯示最新的遊戲畫面

**副作用**: ❌ 不修改遊戲狀態（純渲染）

**範例**:
```javascript
game.render();  // 繪製到 Canvas
```

---

### handleInput(command)

```javascript
handleInput(command: InputCommand): void
```

**用途**: 處理玩家輸入指令

**參數**:
- `command` (InputCommand): 輸入指令枚舉值

**前置條件**: 遊戲狀態為 `PLAYING`

**後置條件**:
- 若指令合法，更新方塊位置/旋轉
- 若指令非法（碰撞），維持原狀

**副作用**: ✅ 可能修改 `currentPiece`

**日誌**: 發送 `PIECE_MOVE`, `PIECE_ROTATE` 事件，並記錄輸入延遲

**範例**:
```javascript
game.handleInput(InputCommand.MOVE_LEFT);
game.handleInput(InputCommand.ROTATE_CW);
```

---

### getState()

```javascript
getState(): GameStateSnapshot
```

**用途**: 取得遊戲狀態的唯讀快照

**回傳值**:
```javascript
{
  status: GameStatus,
  score: number,
  level: number,
  linesCleared: number,
  dropSpeed: number
}
```

**前置條件**: 無

**副作用**: ❌ 唯讀

**範例**:
```javascript
const state = game.getState();
console.log(`分數: ${state.score}, 等級: ${state.level}`);
```

---

## 事件發送

Game 類別會透過 `Logger` 發送以下事件：

| 事件 | 時機 | 附加資料 |
|------|------|---------|
| `GAME_START` | 遊戲開始 | - |
| `GAME_PAUSE` | 遊戲暫停 | - |
| `GAME_RESUME` | 遊戲恢復 | - |
| `GAME_OVER` | 遊戲結束 | `{ finalScore, finalLevel }` |
| `PIECE_SPAWN` | 新方塊生成 | `{ type, position, rotation }` |
| `PIECE_MOVE` | 方塊移動 | `{ direction, newPosition }` |
| `PIECE_ROTATE` | 方塊旋轉 | `{ direction, success }` |
| `PIECE_LOCK` | 方塊固定 | `{ position }` |
| `LINE_CLEAR` | 消行 | `{ rowCount, score }` |
| `LEVEL_UP` | 等級提升 | `{ newLevel, newSpeed }` |

---

**版本歷史**:
- v0.1 (2025-10-21): 初始 Game API 合約
