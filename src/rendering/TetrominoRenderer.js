/**
 * TetrominoRenderer - 方塊渲染器
 *
 * 職責：
 * - 渲染下落中的方塊
 * - 渲染幽靈方塊（預覽落點）
 */

import { GAME_CONSTANTS } from '../utils/Constants.js';

export class TetrominoRenderer {
  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
   */
  constructor(ctx) {
    this.ctx = ctx;
    this.blockSize = GAME_CONSTANTS.BLOCK_SIZE;
  }

  /**
   * 渲染方塊
   * @param {Tetromino} tetromino - 方塊
   */
  render(tetromino) {
    const blocks = tetromino.getBlocks();

    blocks.forEach(block => {
      this.renderBlock(block.x, block.y, block.color, 1.0);
    });
  }

  /**
   * 渲染幽靈方塊（預覽落點）
   * @param {Tetromino} tetromino - 方塊
   * @param {Grid} grid - 遊戲板
   */
  renderGhost(tetromino, grid) {
    // 計算幽靈方塊位置（硬降位置）
    const ghost = this.calculateGhostPosition(tetromino, grid);

    if (ghost) {
      const blocks = ghost.getBlocks();
      blocks.forEach(block => {
        this.renderBlock(block.x, block.y, block.color, 0.3); // 半透明
      });
    }
  }

  /**
   * 計算幽靈方塊位置
   * @param {Tetromino} tetromino - 方塊
   * @param {Grid} grid - 遊戲板
   * @returns {Tetromino|null} 幽靈方塊
   */
  calculateGhostPosition(tetromino, grid) {
    const ghost = tetromino.clone();

    // 持續向下移動直到碰撞
    while (this.canMovePiece(ghost, grid, 0, 1)) {
      ghost.move(0, 1);
    }

    // 如果幽靈位置與原位置相同，不顯示
    if (ghost.position.equals(tetromino.position)) {
      return null;
    }

    return ghost;
  }

  /**
   * 檢查方塊是否可移動
   * @param {Tetromino} piece - 方塊
   * @param {Grid} grid - 遊戲板
   * @param {number} dx - X 方向位移
   * @param {number} dy - Y 方向位移
   * @returns {boolean}
   */
  canMovePiece(piece, grid, dx, dy) {
    const testPiece = piece.clone();
    testPiece.move(dx, dy);

    const blocks = testPiece.getBlocks();

    for (const block of blocks) {
      if (!grid.isInBounds(block.x, block.y)) {
        return false;
      }

      if (grid.isOccupied(block.x, block.y)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 渲染單個方格
   * @param {number} col - 列
   * @param {number} row - 行
   * @param {string} color - 顏色
   * @param {number} alpha - 透明度 (0-1)
   */
  renderBlock(col, row, color, alpha = 1.0) {
    const x = col * this.blockSize;
    const y = row * this.blockSize;

    // 設定透明度
    this.ctx.globalAlpha = alpha;

    // 填充顏色
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 1, y + 1, this.blockSize - 2, this.blockSize - 2);

    // 繪製高光效果
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(x + 1, y + 1, this.blockSize - 2, 4);

    // 繪製陰影效果
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(x + 1, y + this.blockSize - 5, this.blockSize - 2, 4);

    // 重設透明度
    this.ctx.globalAlpha = 1.0;
  }
}
