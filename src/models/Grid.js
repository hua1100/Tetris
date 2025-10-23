/**
 * Grid - 遊戲板（10x20 網格）
 *
 * 職責：
 * - 記錄固定方塊的位置與顏色
 * - 檢測碰撞與邊界
 * - 消除完整的行
 */

export class Grid {
  /**
   * 建立新的 Grid 實例
   * @param {number} width - 網格寬度（預設 10）
   * @param {number} height - 網格高度（預設 20）
   */
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.cells = this.createEmptyGrid();
  }

  /**
   * 建立空白網格
   * @returns {Array<Array<string|null>>} 二維陣列
   */
  createEmptyGrid() {
    return Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(null));
  }

  /**
   * 檢查座標是否在邊界內
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @returns {boolean} 是否在邊界內
   */
  isInBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * 檢查格子是否被佔用
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @returns {boolean} 是否被佔用（邊界外視為已佔用）
   */
  isOccupied(x, y) {
    if (!this.isInBounds(x, y)) return true; // 邊界外視為佔用
    return this.cells[y][x] !== null;
  }

  /**
   * 取得格子的顏色
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @returns {string|null} 顏色字串或 null
   */
  getCell(x, y) {
    if (!this.isInBounds(x, y)) return null;
    return this.cells[y][x];
  }

  /**
   * 設定格子（固定方塊）
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @param {string|null} color - 顏色字串
   */
  setCell(x, y, color) {
    if (this.isInBounds(x, y)) {
      this.cells[y][x] = color;
    }
  }

  /**
   * 固定方塊到網格
   * @param {Tetromino} tetromino - 要固定的方塊
   */
  lockTetromino(tetromino) {
    const blocks = tetromino.getBlocks();
    blocks.forEach(block => {
      this.setCell(block.x, block.y, block.color);
    });
  }

  /**
   * 檢查某一行是否已滿
   * @param {number} row - 行號
   * @returns {boolean} 是否已滿
   */
  isRowComplete(row) {
    if (row < 0 || row >= this.height) return false;
    return this.cells[row].every(cell => cell !== null);
  }

  /**
   * 取得所有已滿的行號
   * @returns {Array<number>} 完整行的行號陣列
   */
  getCompleteRows() {
    const completeRows = [];
    for (let row = 0; row < this.height; row++) {
      if (this.isRowComplete(row)) {
        completeRows.push(row);
      }
    }
    return completeRows;
  }

  /**
   * 移除指定的行
   * @param {number} row - 要移除的行號
   */
  removeRow(row) {
    if (row < 0 || row >= this.height) return;
    this.cells.splice(row, 1);
    this.cells.unshift(Array(this.width).fill(null)); // 頂部新增空行
  }

  /**
   * 移除多行（由上往下）
   * @param {Array<number>} rows - 要移除的行號陣列
   */
  removeRows(rows) {
    if (rows.length === 0) return;
    
    // 移除重複的行號並排序（從大到小）
    const uniqueRows = [...new Set(rows)].sort((a, b) => b - a);
    
    // 一次性移除所有行
    uniqueRows.forEach(row => {
      if (row >= 0 && row < this.height) {
        this.cells.splice(row, 1);
      }
    });
    
    // 在頂部添加相應數量的空行
    for (let i = 0; i < uniqueRows.length; i++) {
      this.cells.unshift(Array(this.width).fill(null));
    }
  }

  /**
   * 清空整個網格
   */
  clear() {
    this.cells = this.createEmptyGrid();
  }

  /**
   * 克隆網格（用於預測）
   * @returns {Grid} 新的 Grid 實例
   */
  clone() {
    const cloned = new Grid(this.width, this.height);
    cloned.cells = this.cells.map(row => [...row]);
    return cloned;
  }
}
