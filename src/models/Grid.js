/**
 * Grid - 遊戲板（10x20 網格）
 *
 * 職責：
 * - 記錄固定方塊的位置與顏色
 * - 檢測碰撞與邊界
 * - 消除完整的行
 * - 管理垃圾行（對戰模式）
 */

import { GARBAGE_COLOR } from '../utils/Constants.js';

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

  // ============================================================================
  // 垃圾行系統（對戰模式）
  // ============================================================================

  /**
   * 建立一行垃圾行（9 個垃圾方塊 + 1 個隨機空隙）
   * @returns {Array<string|null>} 垃圾行陣列
   */
  createGarbageLine() {
    const line = Array(this.width).fill(GARBAGE_COLOR);
    const gapPosition = Math.floor(Math.random() * this.width);
    line[gapPosition] = null;
    return line;
  }

  /**
   * 檢查是否能加入指定數量的垃圾行
   * @param {number} count - 垃圾行數量
   * @returns {boolean} 是否能加入
   */
  canAddGarbageLines(count) {
    // 檢查頂部是否有足夠空間
    for (let row = 0; row < count && row < this.height; row++) {
      if (this.cells[row].some(cell => cell !== null)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 在底部加入垃圾行（對戰模式攻擊）
   * @param {number} count - 垃圾行數量
   * @throws {Error} 如果頂部無足夠空間
   */
  addGarbageLines(count) {
    if (count <= 0) return;

    // 檢查空間
    if (!this.canAddGarbageLines(count)) {
      throw new Error(`Grid overflow - cannot add ${count} garbage lines`);
    }

    // 移除頂部的空行
    this.cells.splice(0, count);

    // 在底部加入垃圾行
    for (let i = 0; i < count; i++) {
      const garbageLine = this.createGarbageLine();
      this.cells.push(garbageLine);
    }
  }
}
