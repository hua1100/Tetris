# 資料模型：俄羅斯方塊核心遊戲

**階段**: Phase 1 - 資料模型設計
**日期**: 2025-10-21
**目的**: 定義所有遊戲實體的資料結構與狀態管理

---

## 模型概覽

本遊戲包含以下核心實體：

| 實體 | 職責 | 可變性 |
|------|------|--------|
| `Tetromino` | 代表七種方塊及其狀態 | 可變（位置、旋轉） |
| `Grid` | 10x20 遊戲板，記錄固定方塊 | 可變（新增、消行） |
| `GameState` | 遊戲整體狀態（分數、等級等） | 可變 |
| `Position` | 二維座標 | 不可變（值對象） |
| `TetrominoType` | 方塊類型枚舉 | 不可變（常數） |
| `RotationState` | 旋轉狀態（0-3） | 不可變（整數） |

**設計原則**：
- ✅ 值對象（Value Objects）不可變，避免副作用
- ✅ 實體（Entities）職責單一
- ✅ 使用描述性命名（符合憲法原則 6）
- ✅ 避免過度抽象（符合憲法原則 1）

---

## 1. Tetromino（方塊）

### 1.1 類別定義

```javascript
class Tetromino {
  constructor(type) {
    this.type = type;           // TetrominoType 枚舉
    this.rotation = 0;          // 旋轉狀態 (0, 1, 2, 3)
    this.position = new Position(3, 0);  // 初始位置（遊戲板中央上方）
    this.color = TETROMINO_COLORS[type]; // 方塊顏色
  }

  // 取得當前旋轉狀態的形狀矩陣
  getShape() {
    return TETROMINO_SHAPES[this.type][this.rotation];
  }

  // 取得所有方格的絕對座標
  getBlocks() {
    const shape = this.getShape();
    const blocks = [];

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          blocks.push({
            x: this.position.x + col,
            y: this.position.y + row,
            color: this.color
          });
        }
      }
    }

    return blocks;
  }

  // 移動方塊
  move(dx, dy) {
    this.position = new Position(
      this.position.x + dx,
      this.position.y + dy
    );
  }

  // 旋轉方塊（順時針）
  rotate() {
    this.rotation = (this.rotation + 1) % 4;
  }

  // 克隆方塊（用於預測性檢查）
  clone() {
    const cloned = new Tetromino(this.type);
    cloned.rotation = this.rotation;
    cloned.position = this.position.clone();
    return cloned;
  }
}
```

### 1.2 方塊類型枚舉

```javascript
const TetrominoType = Object.freeze({
  I: 'I',
  O: 'O',
  T: 'T',
  S: 'S',
  Z: 'Z',
  J: 'J',
  L: 'L'
});
```

### 1.3 方塊形狀定義

```javascript
const TETROMINO_SHAPES = {
  I: [
    // 0° - 水平
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    // 90° - 垂直
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ],
    // 180° - 水平（與 0° 相同，但位置不同）
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ],
    // 270° - 垂直（與 90° 相同，但位置不同）
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ]
  ],

  O: [
    // O 型不旋轉，四個狀態相同
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]]
  ],

  T: [
    // 0° - 向上
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    // 90° - 向右
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0]
    ],
    // 180° - 向下
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    // 270° - 向左
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ],

  S: [
    // 0°
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    // 90°
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1]
    ],
    // 180°（與 0° 相同）
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0]
    ],
    // 270°（與 90° 相同）
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]
    ]
  ],

  Z: [
    // 0°
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    // 90°
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ],
    // 180°
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1]
    ],
    // 270°
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ]
  ],

  J: [
    // 0° - 左下
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    // 90° - 右上
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    // 180° - 右上
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1]
    ],
    // 270° - 左下
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0]
    ]
  ],

  L: [
    // 0° - 右下
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    // 90° - 左上
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1]
    ],
    // 180° - 左上
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    // 270° - 右下
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ]
  ]
};

// 凍結以防修改
Object.freeze(TETROMINO_SHAPES);
```

### 1.4 方塊顏色定義

```javascript
const TETROMINO_COLORS = Object.freeze({
  I: '#00FFFF',  // Cyan 青色
  O: '#FFFF00',  // Yellow 黃色
  T: '#9900FF',  // Purple 紫色
  S: '#00FF00',  // Green 綠色
  Z: '#FF0000',  // Red 紅色
  J: '#0000FF',  // Blue 藍色
  L: '#FF7F00'   // Orange 橘色
});
```

---

## 2. Grid（遊戲板）

### 2.1 類別定義

```javascript
class Grid {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.cells = this.createEmptyGrid();
  }

  // 建立空白網格
  createEmptyGrid() {
    return Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(null));
  }

  // 檢查座標是否在邊界內
  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  // 檢查格子是否被佔用
  isOccupied(x, y) {
    if (!this.isInBounds(x, y)) return true;  // 邊界外視為佔用
    return this.cells[y][x] !== null;
  }

  // 取得格子的顏色
  getCell(x, y) {
    if (!this.isInBounds(x, y)) return null;
    return this.cells[y][x];
  }

  // 設定格子（固定方塊）
  setCell(x, y, color) {
    if (this.isInBounds(x, y)) {
      this.cells[y][x] = color;
    }
  }

  // 固定方塊到網格
  lockTetromino(tetromino) {
    const blocks = tetromino.getBlocks();
    blocks.forEach(block => {
      this.setCell(block.x, block.y, block.color);
    });
  }

  // 檢查某一行是否已滿
  isRowComplete(row) {
    if (row < 0 || row >= this.height) return false;
    return this.cells[row].every(cell => cell !== null);
  }

  // 取得所有已滿的行號
  getCompleteRows() {
    const completeRows = [];
    for (let row = 0; row < this.height; row++) {
      if (this.isRowComplete(row)) {
        completeRows.push(row);
      }
    }
    return completeRows;
  }

  // 移除指定的行
  removeRow(row) {
    if (row < 0 || row >= this.height) return;
    this.cells.splice(row, 1);
    this.cells.unshift(Array(this.width).fill(null));  // 頂部新增空行
  }

  // 移除多行（由上往下）
  removeRows(rows) {
    // 從下往上移除（避免索引變動問題）
    rows.sort((a, b) => b - a);
    rows.forEach(row => this.removeRow(row));
  }

  // 清空整個網格
  clear() {
    this.cells = this.createEmptyGrid();
  }

  // 克隆網格（用於預測）
  clone() {
    const cloned = new Grid(this.width, this.height);
    cloned.cells = this.cells.map(row => [...row]);
    return cloned;
  }
}
```

---

## 3. Position（座標）

### 3.1 值對象定義

```javascript
class Position {
  constructor(x, y) {
    this._x = x;
    this._y = y;
    Object.freeze(this);  // 不可變
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  // 建立新位置（移動）
  move(dx, dy) {
    return new Position(this._x + dx, this._y + dy);
  }

  left(distance = 1) {
    return new Position(this._x - distance, this._y);
  }

  right(distance = 1) {
    return new Position(this._x + distance, this._y);
  }

  up(distance = 1) {
    return new Position(this._x, this._y - distance);
  }

  down(distance = 1) {
    return new Position(this._x, this._y + distance);
  }

  // 相等性比較
  equals(other) {
    return this._x === other.x && this._y === other.y;
  }

  // 克隆
  clone() {
    return new Position(this._x, this._y);
  }

  // 字串表示（除錯用）
  toString() {
    return `Position(${this._x}, ${this._y})`;
  }
}
```

---

## 4. GameState（遊戲狀態）

### 4.1 狀態枚舉

```javascript
const GameStatus = Object.freeze({
  IDLE: 'IDLE',           // 尚未開始
  PLAYING: 'PLAYING',     // 遊戲進行中
  PAUSED: 'PAUSED',       // 暫停
  GAME_OVER: 'GAME_OVER'  // 遊戲結束
});
```

### 4.2 類別定義

```javascript
class GameState {
  constructor() {
    this.status = GameStatus.IDLE;
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.currentPiece = null;       // 當前下落的方塊
    this.nextPiece = null;          // 下一個方塊（預覽）
    this.grid = new Grid(10, 20);
    this.dropSpeed = 1000;          // 下落速度（毫秒）
    this.lastDropTime = 0;
  }

  // 開始遊戲
  start() {
    this.status = GameStatus.PLAYING;
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.grid.clear();
    this.spawnNewPiece();
    this.lastDropTime = Date.now();
  }

  // 暫停/恢復
  togglePause() {
    if (this.status === GameStatus.PLAYING) {
      this.status = GameStatus.PAUSED;
    } else if (this.status === GameStatus.PAUSED) {
      this.status = GameStatus.PLAYING;
      this.lastDropTime = Date.now();  // 重設時間避免瞬間下落
    }
  }

  // 遊戲結束
  gameOver() {
    this.status = GameStatus.GAME_OVER;
  }

  // 生成新方塊
  spawnNewPiece() {
    this.currentPiece = this.nextPiece || this.createRandomPiece();
    this.nextPiece = this.createRandomPiece();
  }

  // 建立隨機方塊
  createRandomPiece() {
    const types = Object.values(TetrominoType);
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new Tetromino(randomType);
  }

  // 增加分數
  addScore(points) {
    this.score += points;
  }

  // 增加消除行數
  addClearedLines(count) {
    this.linesCleared += count;
    this.updateLevel();
  }

  // 更新等級（每 10 行提升一級）
  updateLevel() {
    const newLevel = Math.floor(this.linesCleared / 10) + 1;
    if (newLevel !== this.level) {
      this.level = newLevel;
      this.updateDropSpeed();
    }
  }

  // 更新下落速度（每級快 10%）
  updateDropSpeed() {
    this.dropSpeed = Math.max(
      1000 * Math.pow(0.9, this.level - 1),
      50  // 最快 50ms
    );
  }

  // 取得遊戲狀態快照（用於日誌）
  getSnapshot() {
    return {
      status: this.status,
      score: this.score,
      level: this.level,
      linesCleared: this.linesCleared,
      dropSpeed: this.dropSpeed
    };
  }
}
```

---

## 5. 輔助資料結構

### 5.1 輸入指令枚舉

```javascript
const InputCommand = Object.freeze({
  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  MOVE_DOWN: 'MOVE_DOWN',      // 加速下落
  ROTATE_CW: 'ROTATE_CW',      // 順時針旋轉
  ROTATE_CCW: 'ROTATE_CCW',    // 逆時針旋轉（可選）
  HARD_DROP: 'HARD_DROP',      // 硬降（瞬間落底）
  PAUSE: 'PAUSE'
});
```

### 5.2 遊戲事件類型

```javascript
const GameEvent = Object.freeze({
  GAME_START: 'GAME_START',
  GAME_PAUSE: 'GAME_PAUSE',
  GAME_RESUME: 'GAME_RESUME',
  GAME_OVER: 'GAME_OVER',
  PIECE_SPAWN: 'PIECE_SPAWN',
  PIECE_MOVE: 'PIECE_MOVE',
  PIECE_ROTATE: 'PIECE_ROTATE',
  PIECE_LOCK: 'PIECE_LOCK',
  LINE_CLEAR: 'LINE_CLEAR',
  LEVEL_UP: 'LEVEL_UP',
  INPUT_LAG: 'INPUT_LAG'
});
```

### 5.3 日誌條目格式

```javascript
class LogEntry {
  constructor(event, data = {}) {
    this.timestamp = Date.now();
    this.event = event;          // GameEvent 枚舉值
    this.data = data;            // 額外資料
  }

  toJSON() {
    return {
      timestamp: this.timestamp,
      event: this.event,
      ...this.data
    };
  }
}

// 範例使用
const logEntry = new LogEntry(GameEvent.PIECE_SPAWN, {
  type: 'I',
  position: { x: 3, y: 0 },
  rotation: 0
});

console.log(JSON.stringify(logEntry.toJSON()));
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

## 6. 計分規則資料

### 6.1 計分表

```javascript
const SCORE_TABLE = Object.freeze({
  1: 100,   // 1 行
  2: 300,   // 2 行
  3: 500,   // 3 行
  4: 800    // 4 行（Tetris）
});

// 計算分數（可乘以等級係數）
function calculateScore(linesCleared, level = 1) {
  const baseScore = SCORE_TABLE[linesCleared] || 0;
  return baseScore * level;
}
```

---

## 7. 常數定義

### 7.1 遊戲常數

```javascript
const GAME_CONSTANTS = Object.freeze({
  GRID_WIDTH: 10,
  GRID_HEIGHT: 20,
  BLOCK_SIZE: 30,              // 像素
  INITIAL_DROP_SPEED: 1000,    // 毫秒
  MIN_DROP_SPEED: 50,          // 毫秒
  SPEED_DECREASE_RATE: 0.9,    // 每級快 10%
  LINES_PER_LEVEL: 10,
  TARGET_FPS: 60,
  INPUT_RESPONSE_THRESHOLD: 16 // 毫秒
});
```

### 7.2 鍵盤映射

```javascript
const KEY_BINDINGS = Object.freeze({
  // 方向鍵
  ArrowLeft: InputCommand.MOVE_LEFT,
  ArrowRight: InputCommand.MOVE_RIGHT,
  ArrowDown: InputCommand.MOVE_DOWN,
  ArrowUp: InputCommand.ROTATE_CW,

  // WASD
  KeyA: InputCommand.MOVE_LEFT,
  KeyD: InputCommand.MOVE_RIGHT,
  KeyS: InputCommand.MOVE_DOWN,
  KeyW: InputCommand.ROTATE_CW,

  // 其他
  Space: InputCommand.HARD_DROP,
  KeyP: InputCommand.PAUSE
});
```

---

## 8. 資料流程圖

```
使用者輸入
    ↓
InputCommand
    ↓
Game.handleCommand()
    ↓
嘗試移動/旋轉 Tetromino
    ↓
CollisionDetector.isValid()
    ├─ 合法 → 更新 Tetromino.position/rotation
    └─ 非法 → 拒絕操作
    ↓
Renderer.render(GameState)
    ↓
繪製到 Canvas
```

---

## 9. 狀態轉換圖

```
IDLE
  ↓ start()
PLAYING
  ↓ togglePause()
PAUSED
  ↓ togglePause()
PLAYING
  ↓ gameOver()
GAME_OVER
  ↓ start()
IDLE
```

---

## 10. 資料驗證規則

### 10.1 不變量 (Invariants)

**Tetromino**：
- `type` 必須是 `TetrominoType` 中的一個
- `rotation` 必須在 0-3 之間
- `position.x` 必須在 -3 到 12 之間（允許部分超出邊界）
- `position.y` 必須在 -3 到 22 之間

**Grid**：
- `width` 和 `height` 必須 > 0
- `cells` 陣列長度必須 = `height`
- 每列陣列長度必須 = `width`
- 每個格子必須是 `null` 或合法的顏色字串

**GameState**：
- `score` 必須 >= 0
- `level` 必須 >= 1
- `linesCleared` 必須 >= 0
- `dropSpeed` 必須 >= `MIN_DROP_SPEED`

### 10.2 驗證函數（可選）

```javascript
function validateTetromino(tetromino) {
  if (!Object.values(TetrominoType).includes(tetromino.type)) {
    throw new Error(`Invalid tetromino type: ${tetromino.type}`);
  }
  if (tetromino.rotation < 0 || tetromino.rotation > 3) {
    throw new Error(`Invalid rotation: ${tetromino.rotation}`);
  }
  // ... 其他驗證
}
```

**決策**：在開發階段可使用，生產環境可移除以提升效能。

---

## 11. 記憶體管理考量

### 11.1 物件池（可選優化）

對於頻繁建立/銷毀的物件（如 `Position`），可考慮使用物件池：

```javascript
class PositionPool {
  constructor(size = 100) {
    this.pool = [];
    for (let i = 0; i < size; i++) {
      this.pool.push(new Position(0, 0));
    }
  }

  acquire(x, y) {
    if (this.pool.length > 0) {
      const pos = this.pool.pop();
      pos._x = x;
      pos._y = y;
      return pos;
    }
    return new Position(x, y);
  }

  release(position) {
    this.pool.push(position);
  }
}
```

**決策**：**暫不實作**（避免過早優化），僅在效能測試證明需要時才加入。

---

## 12. 設計決策總結

| 決策 | 理由 |
|------|------|
| 使用類別（Class）而非純物件 | 封裝性、方法繼承、清晰的介面 |
| Position 不可變 | 避免副作用，函數式編程風格 |
| 預定義旋轉狀態 | 簡單、快速、易測試 |
| Grid 使用二維陣列 | 直觀、效能足夠 |
| 枚舉使用 Object.freeze | 防止意外修改，型別安全 |

---

## 13. 下一步驟

1. ✅ 完成資料模型設計（此文件）
2. ⏳ 定義模組介面合約（contracts/）
3. ⏳ 建立快速開始指南（quickstart.md）
4. ⏳ 建立任務分解（tasks.md）
5. ⏳ 開始 TDD 實作

---

**版本歷史**:
- v0.1 (2025-10-21): 初始資料模型設計
