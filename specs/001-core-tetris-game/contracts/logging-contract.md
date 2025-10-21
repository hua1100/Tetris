# Logger API 合約

**模組**: `src/game/Logger.js`
**職責**: 結構化日誌系統，記錄所有遊戲事件（符合憲法原則 7）

---

## 類別：Logger

### 建構子

```javascript
constructor(enableConsole = true, enableStorage = false)
```

**參數**:
- `enableConsole` (boolean): 是否輸出到瀏覽器 Console（預設 true）
- `enableStorage` (boolean): 是否儲存到記憶體陣列（預設 false，可用於除錯）

**範例**:
```javascript
const logger = new Logger(true, false);  // 僅 Console 輸出
```

---

### log(event, data)

```javascript
log(event: GameEvent, data: object = {}): void
```

**用途**: 記錄遊戲事件

**參數**:
- `event` (GameEvent): 事件類型枚舉值
- `data` (object): 額外的上下文資料

**後置條件**:
- 建立結構化日誌條目
- 若 `enableConsole` 為 true，輸出到 Console
- 若 `enableStorage` 為 true，儲存到內部陣列

**日誌格式**:
```javascript
{
  timestamp: number,       // Unix 時間戳（毫秒）
  event: string,           // 事件類型
  ...data                  // 額外資料（展開）
}
```

**範例**:
```javascript
logger.log(GameEvent.PIECE_SPAWN, {
  type: 'I',
  position: { x: 3, y: 0 },
  rotation: 0
});

// 輸出：
// {
//   "timestamp": 1634567890123,
//   "event": "PIECE_SPAWN",
//   "type": "I",
//   "position": { "x": 3, "y": 0 },
//   "rotation": 0
// }
```

---

### logGameStart()

```javascript
logGameStart(): void
```

**用途**: 記錄遊戲開始事件

**等同於**:
```javascript
logger.log(GameEvent.GAME_START, {});
```

---

### logPieceSpawn(tetromino)

```javascript
logPieceSpawn(tetromino: Tetromino): void
```

**用途**: 記錄方塊生成事件

**範例**:
```javascript
logger.logPieceSpawn(currentPiece);
// 自動提取 type, position, rotation
```

---

### logPieceMove(direction, newPosition)

```javascript
logPieceMove(direction: string, newPosition: Position): void
```

**參數**:
- `direction` (string): 移動方向（"LEFT", "RIGHT", "DOWN"）
- `newPosition` (Position): 新位置

**範例**:
```javascript
logger.logPieceMove('LEFT', new Position(2, 5));
```

---

### logPieceRotate(direction, success)

```javascript
logPieceRotate(direction: number, success: boolean): void
```

**參數**:
- `direction` (number): 旋轉方向（1 = 順時針，-1 = 逆時針）
- `success` (boolean): 旋轉是否成功

**範例**:
```javascript
logger.logPieceRotate(1, true);   // 成功旋轉
logger.logPieceRotate(1, false);  // 旋轉被阻擋
```

---

### logPieceLock(position)

```javascript
logPieceLock(position: Position): void
```

**用途**: 記錄方塊固定事件

---

### logLineClear(rowCount, score)

```javascript
logLineClear(rowCount: number, score: number): void
```

**用途**: 記錄消行事件

**範例**:
```javascript
logger.logLineClear(4, 800);  // Tetris!
```

---

### logLevelUp(newLevel, newSpeed)

```javascript
logLevelUp(newLevel: number, newSpeed: number): void
```

**用途**: 記錄等級提升事件

---

### logGameOver(finalScore, finalLevel)

```javascript
logGameOver(finalScore: number, finalLevel: number): void
```

**用途**: 記錄遊戲結束事件

---

### logInputLag(latency)

```javascript
logInputLag(latency: number): void
```

**用途**: 記錄輸入延遲過高事件

**參數**:
- `latency` (number): 輸入延遲（毫秒）

**觸發條件**: 當延遲 > 16ms 時

**範例**:
```javascript
if (latency > 16) {
  logger.logInputLag(latency);
}
```

---

### getLogs()

```javascript
getLogs(): LogEntry[]
```

**用途**: 取得所有儲存的日誌（僅當 `enableStorage` 為 true）

**回傳值**: 日誌條目陣列

**範例**:
```javascript
const logs = logger.getLogs();
console.table(logs);  // 表格顯示
```

---

### clearLogs()

```javascript
clearLogs(): void
```

**用途**: 清空儲存的日誌

---

### exportLogs()

```javascript
exportLogs(): string
```

**用途**: 匯出日誌為 JSON 字串

**範例**:
```javascript
const jsonLogs = logger.exportLogs();
// 可儲存到檔案或傳送到伺服器
```

---

## 日誌事件類型

### 遊戲生命週期

| 事件 | 資料欄位 | 說明 |
|------|---------|------|
| `GAME_START` | - | 遊戲開始 |
| `GAME_PAUSE` | - | 遊戲暫停 |
| `GAME_RESUME` | - | 遊戲恢復 |
| `GAME_OVER` | `finalScore`, `finalLevel` | 遊戲結束 |

### 方塊事件

| 事件 | 資料欄位 | 說明 |
|------|---------|------|
| `PIECE_SPAWN` | `type`, `position`, `rotation` | 方塊生成 |
| `PIECE_MOVE` | `direction`, `newPosition` | 方塊移動 |
| `PIECE_ROTATE` | `direction`, `success` | 方塊旋轉 |
| `PIECE_LOCK` | `position` | 方塊固定 |

### 遊戲進度

| 事件 | 資料欄位 | 說明 |
|------|---------|------|
| `LINE_CLEAR` | `rowCount`, `score` | 消行 |
| `LEVEL_UP` | `newLevel`, `newSpeed` | 等級提升 |

### 效能監控

| 事件 | 資料欄位 | 說明 |
|------|---------|------|
| `INPUT_LAG` | `latency` | 輸入延遲過高 |

---

## 使用範例

### 基本使用

```javascript
const logger = new Logger();

// 遊戲開始
logger.logGameStart();

// 方塊生成
logger.logPieceSpawn(tetromino);

// 玩家移動方塊
logger.logPieceMove('LEFT', new Position(2, 5));

// 旋轉成功
logger.logPieceRotate(1, true);

// 消行
logger.logLineClear(2, 300);

// 等級提升
logger.logLevelUp(2, 720);

// 遊戲結束
logger.logGameOver(15000, 8);
```

### 效能監控

```javascript
function handleInput(command) {
  const startTime = performance.now();

  // 處理輸入
  game.handleCommand(command);

  const endTime = performance.now();
  const latency = endTime - startTime;

  // 記錄延遲
  if (latency > GAME_CONSTANTS.INPUT_RESPONSE_THRESHOLD) {
    logger.logInputLag(latency);
  }
}
```

### 除錯模式

```javascript
// 開啟記憶體儲存
const logger = new Logger(true, true);

// ... 遊戲進行 ...

// 匯出日誌分析
const logs = logger.getLogs();
console.table(logs);

// 找出所有旋轉失敗事件
const failedRotations = logs.filter(
  log => log.event === 'PIECE_ROTATE' && log.success === false
);
console.log(`旋轉失敗次數: ${failedRotations.length}`);
```

---

## 設計決策

### 1. 結構化 JSON 格式

所有日誌都是 JSON 格式，便於：
- 機器解析
- 匯出/匯入
- 遠端傳送（未來可擴展）

### 2. 時間戳記

每個日誌包含高精度時間戳（毫秒），可用於：
- 效能分析
- 事件序列重建
- 播放回放（未來功能）

### 3. 可選的持久化

預設僅輸出到 Console（效能最佳），但可啟用記憶體儲存供除錯。

---

**版本歷史**:
- v0.1 (2025-10-21): 初始 Logger API 合約
