/**
 * Renderer - 主渲染器
 *
 * 職責：
 * - 協調所有子渲染器
 * - 管理 Canvas 上下文
 * - 清除畫面
 */

import { GridRenderer } from './GridRenderer.js';
import { TetrominoRenderer } from './TetrominoRenderer.js';
import { UIRenderer } from './UIRenderer.js';

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas - Canvas 元素
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // 初始化子渲染器
    this.gridRenderer = new GridRenderer(this.ctx);
    this.tetrominoRenderer = new TetrominoRenderer(this.ctx);
    this.uiRenderer = new UIRenderer();
  }

  /**
   * 渲染遊戲畫面
   * @param {GameState} gameState - 遊戲狀態
   */
  render(gameState) {
    // 清除畫面
    this.clear();

    // 渲染遊戲板
    this.gridRenderer.render(gameState.grid);

    // 渲染當前方塊
    if (gameState.currentPiece) {
      this.tetrominoRenderer.render(gameState.currentPiece);
    }

    // 渲染幽靈方塊（預覽落點）
    if (gameState.currentPiece) {
      this.tetrominoRenderer.renderGhost(gameState.currentPiece, gameState.grid);
    }

    // 渲染 UI 元素
    this.uiRenderer.render(gameState);
  }

  /**
   * 清除畫面
   */
  clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
