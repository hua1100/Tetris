/**
 * UIRenderer - UI 元素渲染器
 *
 * 職責：
 * - 更新分數、等級、行數顯示
 * - 渲染下一個方塊預覽
 * - 顯示遊戲狀態訊息
 */

import { GameStatus, TETROMINO_SHAPES, GAME_CONSTANTS } from '../utils/Constants.js';

export class UIRenderer {
  constructor() {
    // 取得 DOM 元素
    this.scoreElement = document.getElementById('score');
    this.levelElement = document.getElementById('level');
    this.linesElement = document.getElementById('lines');
    this.nextPieceCanvas = document.getElementById('next-piece-canvas');
    this.statusElement = document.getElementById('status');

    // 初始化下一個方塊 canvas
    if (this.nextPieceCanvas) {
      this.nextPieceCtx = this.nextPieceCanvas.getContext('2d');
    }

    this.blockSize = GAME_CONSTANTS.BLOCK_SIZE;
  }

  /**
   * 渲染 UI 元素
   * @param {GameState} gameState - 遊戲狀態
   */
  render(gameState) {
    this.updateScore(gameState.score);
    this.updateLevel(gameState.level);
    this.updateLines(gameState.linesCleared);
    this.updateStatus(gameState.status);

    if (gameState.nextPiece && this.nextPieceCtx) {
      this.renderNextPiece(gameState.nextPiece);
    }
  }

  /**
   * 更新分數顯示
   * @param {number} score - 分數
   */
  updateScore(score) {
    if (this.scoreElement) {
      this.scoreElement.textContent = score;
    }
  }

  /**
   * 更新等級顯示
   * @param {number} level - 等級
   */
  updateLevel(level) {
    if (this.levelElement) {
      this.levelElement.textContent = level;
    }
  }

  /**
   * 更新消除行數顯示
   * @param {number} lines - 消除行數
   */
  updateLines(lines) {
    if (this.linesElement) {
      this.linesElement.textContent = lines;
    }
  }

  /**
   * 更新遊戲狀態顯示
   * @param {string} status - 遊戲狀態
   */
  updateStatus(status) {
    if (!this.statusElement) return;

    switch (status) {
      case GameStatus.IDLE:
        this.statusElement.textContent = '按 空白鍵 開始';
        this.statusElement.style.display = 'block';
        break;
      case GameStatus.PLAYING:
        this.statusElement.style.display = 'none';
        break;
      case GameStatus.PAUSED:
        this.statusElement.textContent = '暫停中 - 按 P 繼續';
        this.statusElement.style.display = 'block';
        break;
      case GameStatus.GAME_OVER:
        this.statusElement.textContent = '遊戲結束 - 按 空白鍵 重新開始';
        this.statusElement.style.display = 'block';
        break;
    }
  }

  /**
   * 渲染下一個方塊
   * @param {Tetromino} tetromino - 方塊
   */
  renderNextPiece(tetromino) {
    if (!this.nextPieceCtx) return;

    const canvas = this.nextPieceCanvas;

    // 清除畫面
    this.nextPieceCtx.fillStyle = '#000000';
    this.nextPieceCtx.fillRect(0, 0, canvas.width, canvas.height);

    // 取得方塊形狀
    const shape = TETROMINO_SHAPES[tetromino.type][0]; // 使用初始旋轉狀態

    // 計算居中位置
    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;
    const offsetX = (canvas.width - shapeWidth * this.blockSize) / 2;
    const offsetY = (canvas.height - shapeHeight * this.blockSize) / 2;

    // 渲染方塊
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const x = offsetX + col * this.blockSize;
          const y = offsetY + row * this.blockSize;

          // 填充顏色
          this.nextPieceCtx.fillStyle = tetromino.color;
          this.nextPieceCtx.fillRect(x + 1, y + 1, this.blockSize - 2, this.blockSize - 2);

          // 繪製高光效果
          this.nextPieceCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          this.nextPieceCtx.fillRect(x + 1, y + 1, this.blockSize - 2, 4);

          // 繪製陰影效果
          this.nextPieceCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          this.nextPieceCtx.fillRect(x + 1, y + this.blockSize - 5, this.blockSize - 2, 4);
        }
      }
    }
  }
}
