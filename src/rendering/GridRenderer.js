/**
 * GridRenderer - 遊戲板渲染器
 *
 * 職責：
 * - 渲染遊戲板網格
 * - 渲染已固定的方塊
 */

import { GAME_CONSTANTS } from '../utils/Constants.js';

export class GridRenderer {
  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.blockSize = GAME_CONSTANTS.BLOCK_SIZE;
  }

  /**
   * 渲染遊戲板
   * @param {Grid} grid - 遊戲板
   * @param {number[]} clearingRows - 正在清除的行
   */
  render(grid, clearingRows = []) {
    // 渲染網格線
    this.renderGrid(grid);

    // 渲染已固定的方塊
    this.renderLockedBlocks(grid, clearingRows);
  }

  /**
   * 渲染網格線
   * @param {Grid} grid - 遊戲板
   */
  renderGrid(grid) {
    this.ctx.strokeStyle = '#333333';
    this.ctx.lineWidth = 1;

    // 繪製垂直線
    for (let col = 0; col <= grid.width; col++) {
      const x = col * this.blockSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, grid.height * this.blockSize);
      this.ctx.stroke();
    }

    // 繪製水平線
    for (let row = 0; row <= grid.height; row++) {
      const y = row * this.blockSize;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(grid.width * this.blockSize, y);
      this.ctx.stroke();
    }
  }

  /**
   * 渲染已固定的方塊
   * @param {Grid} grid - 遊戲板
   * @param {number[]} clearingRows - 正在清除的行
   */
  renderLockedBlocks(grid, clearingRows = []) {
    for (let row = 0; row < grid.height; row++) {
      const isClearing = clearingRows.includes(row);

      for (let col = 0; col < grid.width; col++) {
        const color = grid.getCell(col, row);
        if (color) {
          if (isClearing) {
            // 正在清除的行使用閃爍的白色效果
            this.renderClearingBlock(col, row);
          } else {
            this.renderBlock(col, row, color);
          }
        }
      }
    }
  }

  /**
   * 渲染單個方格
   * @param {number} col - 列
   * @param {number} row - 行
   * @param {string} color - 顏色
   */
  renderBlock(col, row, color) {
    const x = col * this.blockSize;
    const y = row * this.blockSize;

    // 填充顏色
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 1, y + 1, this.blockSize - 2, this.blockSize - 2);

    // 繪製高光效果
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x + 1, y + 1, this.blockSize - 2, 4);

    // 繪製陰影效果
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(x + 1, y + this.blockSize - 5, this.blockSize - 2, 4);
  }

  /**
   * 渲染正在清除的方格（閃爍效果）
   * @param {number} col - 列
   * @param {number} row - 行
   */
  renderClearingBlock(col, row) {
    const x = col * this.blockSize;
    const y = row * this.blockSize;

    // 閃爍的白色效果
    const time = Date.now();
    const flash = Math.sin(time * 0.02) * 0.5 + 0.5; // 0-1 之間振盪

    // 填充白色帶透明度
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + flash * 0.5})`;
    this.ctx.fillRect(x + 1, y + 1, this.blockSize - 2, this.blockSize - 2);

    // 繪製邊框發光效果
    this.ctx.strokeStyle = `rgba(255, 255, 0, ${flash})`;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x + 2, y + 2, this.blockSize - 4, this.blockSize - 4);
  }
}
