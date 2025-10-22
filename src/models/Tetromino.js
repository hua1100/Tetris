/**
 * Tetromino - 俄羅斯方塊（七種形狀）
 *
 * 職責：
 * - 代表方塊的類型、位置、旋轉狀態
 * - 提供移動與旋轉功能
 * - 計算方塊的絕對座標
 */

import { Position } from './Position.js';
import { TETROMINO_SHAPES, TETROMINO_COLORS } from '../utils/Constants.js';

export class Tetromino {
  /**
   * 建立新的 Tetromino 實例
   * @param {string} type - 方塊類型 (I, O, T, S, Z, J, L)
   */
  constructor(type) {
    this.type = type;
    this.rotation = 0; // 旋轉狀態 (0, 1, 2, 3)
    this.position = new Position(3, 0); // 初始位置（遊戲板中央上方）
    this.color = TETROMINO_COLORS[type]; // 方塊顏色
  }

  /**
   * 取得當前旋轉狀態的形狀矩陣
   * @returns {Array<Array<number>>} 形狀矩陣
   */
  getShape() {
    return TETROMINO_SHAPES[this.type][this.rotation];
  }

  /**
   * 取得所有方格的絕對座標
   * @returns {Array<{x: number, y: number, color: string}>}
   */
  getBlocks() {
    const shape = this.getShape();
    const blocks = [];

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          blocks.push({
            x: this.position.x + col,
            y: this.position.y + row,
            color: this.color,
          });
        }
      }
    }

    return blocks;
  }

  /**
   * 移動方塊
   * @param {number} dx - X 方向位移
   * @param {number} dy - Y 方向位移
   */
  move(dx, dy) {
    this.position = new Position(this.position.x + dx, this.position.y + dy);
  }

  /**
   * 旋轉方塊（順時針）
   */
  rotate() {
    this.rotation = (this.rotation + 1) % 4;
  }

  /**
   * 克隆方塊（用於預測性檢查）
   * @returns {Tetromino} 新的 Tetromino 實例
   */
  clone() {
    const cloned = new Tetromino(this.type);
    cloned.rotation = this.rotation;
    cloned.position = this.position.clone();
    return cloned;
  }
}
