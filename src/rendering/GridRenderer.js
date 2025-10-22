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
   */
  render(grid) {
    // 渲染網格線
    this.renderGrid(grid);

    // 渲染已固定的方塊
    this.renderLockedBlocks(grid);
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
   */
  renderLockedBlocks(grid) {
    for (let row = 0; row < grid.height; row++) {
      for (let col = 0; col < grid.width; col++) {
        const color = grid.getCell(col, row);
        if (color) {
          this.renderBlock(col, row, color);
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
}
