# Systems API 合約

**模組**: `src/systems/`
**職責**: 定義遊戲邏輯系統的介面（碰撞檢測、消行、計分、等級管理）

---

## CollisionDetector（碰撞檢測系統）

### isValidPosition(tetromino, grid)

```javascript
static isValidPosition(tetromino: Tetromino, grid: Grid): boolean
```

**用途**: 檢查方塊在當前位置是否合法（不超出邊界、不與其他方塊重疊）

**參數**:
- `tetromino` (Tetromino): 待檢查的方塊
- `grid` (Grid): 遊戲板

**回傳值**:
- `true`: 位置合法
- `false`: 位置非法（碰撞）

**副作用**: ❌ 唯讀

**範例**:
```javascript
const isValid = CollisionDetector.isValidPosition(currentPiece, grid);
if (isValid) {
  // 允許移動
} else {
  // 拒絕移動
}
```

---

### canMoveLeft(tetromino, grid)

```javascript
static canMoveLeft(tetromino: Tetromino, grid: Grid): boolean
```

**用途**: 檢查方塊是否可以向左移動

**回傳值**: `true` 可移動，`false` 不可移動

**範例**:
```javascript
if (CollisionDetector.canMoveLeft(piece, grid)) {
  piece.move(-1, 0);
}
```

---

### canMoveRight(tetromino, grid)

```javascript
static canMoveRight(tetromino: Tetromino, grid: Grid): boolean
```

**用途**: 檢查方塊是否可以向右移動

---

### canMoveDown(tetromino, grid)

```javascript
static canMoveDown(tetromino: Tetromino, grid: Grid): boolean
```

**用途**: 檢查方塊是否可以向下移動

---

### canRotate(tetromino, grid, direction)

```javascript
static canRotate(
  tetromino: Tetromino,
  grid: Grid,
  direction: 1 | -1
): { canRotate: boolean, offset: Position | null }
```

**用途**: 檢查方塊是否可以旋轉（含牆踢檢測）

**參數**:
- `tetromino`: 待旋轉的方塊
- `grid`: 遊戲板
- `direction`: 旋轉方向（1 = 順時針，-1 = 逆時針）

**回傳值**:
```javascript
{
  canRotate: boolean,  // 是否可旋轉
  offset: Position     // 牆踢偏移量（若需要）
}
```

**範例**:
```javascript
const result = CollisionDetector.canRotate(piece, grid, 1);
if (result.canRotate) {
  piece.rotate();
  if (result.offset) {
    piece.position = piece.position.move(result.offset.x, result.offset.y);
  }
}
```

---

## RowClearer（消行系統）

### checkAndClearRows(grid)

```javascript
static checkAndClearRows(grid: Grid): { rowsCleared: number[], blocks: number }
```

**用途**: 檢查並清除所有完整的橫列

**參數**:
- `grid` (Grid): 遊戲板

**回傳值**:
```javascript
{
  rowsCleared: number[],  // 被清除的行號陣列
  blocks: number          // 清除的方塊總數
}
```

**副作用**: ✅ 修改 `grid`（移除完整列）

**範例**:
```javascript
const result = RowClearer.checkAndClearRows(grid);
if (result.rowsCleared.length > 0) {
  console.log(`清除了 ${result.rowsCleared.length} 行`);
}
```

---

### isRowComplete(grid, row)

```javascript
static isRowComplete(grid: Grid, row: number): boolean
```

**用途**: 檢查指定行是否已滿

**範例**:
```javascript
if (RowClearer.isRowComplete(grid, 19)) {
  console.log('底部行已滿');
}
```

---

## ScoreCalculator（計分系統）

### calculateScore(linesCleared, level)

```javascript
static calculateScore(linesCleared: number, level: number): number
```

**用途**: 根據消除行數和等級計算分數

**參數**:
- `linesCleared` (number): 同時消除的行數（1-4）
- `level` (number): 當前等級

**回傳值**: 獲得的分數

**公式**:
```
1 行: 100 × level
2 行: 300 × level
3 行: 500 × level
4 行: 800 × level
```

**範例**:
```javascript
const score = ScoreCalculator.calculateScore(4, 3);  // 4 行 Tetris，等級 3
console.log(score);  // 2400
```

---

### getScoreName(linesCleared)

```javascript
static getScoreName(linesCleared: number): string
```

**用途**: 取得消行類型的名稱

**回傳值**:
- 1: "Single"
- 2: "Double"
- 3: "Triple"
- 4: "Tetris"

**範例**:
```javascript
const name = ScoreCalculator.getScoreName(4);  // "Tetris"
```

---

## LevelManager（等級管理系統）

### calculateLevel(totalLinesCleared)

```javascript
static calculateLevel(totalLinesCleared: number): number
```

**用途**: 根據總消行數計算等級

**公式**: `level = floor(totalLinesCleared / 10) + 1`

**範例**:
```javascript
const level = LevelManager.calculateLevel(25);  // 3
```

---

### calculateDropSpeed(level)

```javascript
static calculateDropSpeed(level: number): number
```

**用途**: 根據等級計算方塊下落速度（毫秒）

**公式**: `speed = max(1000 × 0.9^(level-1), 50)`

**回傳值**: 下落間隔（毫秒）

**範例**:
```javascript
const speed = LevelManager.calculateDropSpeed(1);   // 1000ms
const speed2 = LevelManager.calculateDropSpeed(5);  // ~656ms
const speed3 = LevelManager.calculateDropSpeed(20); // 50ms (下限)
```

---

## GhostPieceCalculator（Ghost Piece 計算）

### calculateGhostPosition(tetromino, grid)

```javascript
static calculateGhostPosition(tetromino: Tetromino, grid: Grid): Position
```

**用途**: 計算方塊如果直接降落的最終位置

**回傳值**: Ghost Piece 的位置座標

**副作用**: ❌ 唯讀（不修改 tetromino 或 grid）

**範例**:
```javascript
const ghostPos = GhostPieceCalculator.calculateGhostPosition(currentPiece, grid);
// 渲染時在 ghostPos 繪製半透明預覽
```

---

## 系統設計原則

### 1. 無狀態設計

所有系統類別都是**靜態方法**，不儲存狀態：

```javascript
// ✅ 好的設計（無狀態）
class CollisionDetector {
  static isValidPosition(tetromino, grid) {
    // 純函數，不修改輸入
  }
}

// ❌ 不好的設計（有狀態）
class CollisionDetector {
  constructor() {
    this.cachedResults = {};  // 不必要的狀態
  }
}
```

### 2. 純函數優先

除非必須修改狀態（如 `RowClearer`），否則應為純函數：

```javascript
// ✅ 純函數
static isValidPosition(tetromino, grid) {
  // 不修改 tetromino 或 grid
  return result;
}

// ⚠️ 有副作用（但必要）
static checkAndClearRows(grid) {
  // 修改 grid（移除完整列）
  grid.removeRows(completeRows);
  return result;
}
```

### 3. 明確的副作用標示

合約中明確標示是否有副作用：

- ❌ **無副作用**：純函數，可安全並行呼叫
- ✅ **有副作用**：修改輸入參數或全域狀態

---

**版本歷史**:
- v0.1 (2025-10-21): 初始 Systems API 合約
