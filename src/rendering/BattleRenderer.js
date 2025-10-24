/**
 * BattleRenderer - 雙人對戰渲染器
 *
 * 職責：
 * - 並排渲染兩個玩家的遊戲畫面
 * - 協調兩個獨立的渲染器
 * - 管理畫面布局與偏移
 */

import { Renderer } from './Renderer.js';
import { GAME_CONSTANTS, TETROMINO_SHAPES } from '../utils/Constants.js';

export class BattleRenderer {
  /**
   * @param {HTMLCanvasElement} canvas - Canvas 元素
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // 計算布局
    const gridWidth = GAME_CONSTANTS.GRID_WIDTH * GAME_CONSTANTS.BLOCK_SIZE;
    const gridHeight = GAME_CONSTANTS.GRID_HEIGHT * GAME_CONSTANTS.BLOCK_SIZE;
    const sideUIWidth = 150; // 側邊 UI 寬度（下一個方塊預覽）
    const gap = 30; // 間距

    this.player1Offset = { x: 30, y: 40 }; // 玩家 1 偏移（留上方空間給標籤）
    this.player2Offset = { x: 30 + gridWidth + sideUIWidth + gap, y: 40 }; // 玩家 2 偏移

    // 建立兩個獨立的臨時 canvas 用於渲染各玩家
    this.createPlayerCanvas();

    // 建立兩個 Renderer 實例
    this.renderer1 = new Renderer(this.player1Canvas);
    this.renderer2 = new Renderer(this.player2Canvas);
  }

  /**
   * 建立玩家專用的 canvas
   */
  createPlayerCanvas() {
    const width = GAME_CONSTANTS.GRID_WIDTH * GAME_CONSTANTS.BLOCK_SIZE + 200; // 加上 UI 空間
    const height = GAME_CONSTANTS.GRID_HEIGHT * GAME_CONSTANTS.BLOCK_SIZE;

    // 玩家 1 的 canvas
    this.player1Canvas = document.createElement('canvas');
    this.player1Canvas.width = width;
    this.player1Canvas.height = height;

    // 玩家 2 的 canvas
    this.player2Canvas = document.createElement('canvas');
    this.player2Canvas.width = width;
    this.player2Canvas.height = height;
  }

  /**
   * 渲染對戰畫面
   * @param {BattleGame} battleGame - 對戰遊戲實例
   */
  render(battleGame) {
    // 清除主畫面
    this.clear();

    // 渲染玩家 1
    const p1State = battleGame.player1.state;
    const p1ClearingRows = battleGame.player1.getClearingRows();
    const p1Combo = battleGame.player1.getCombo();
    const p1ShowCombo = battleGame.player1.shouldShowCombo();

    this.renderer1.render(p1State, p1ClearingRows, p1Combo, p1ShowCombo);

    // 渲染玩家 2
    const p2State = battleGame.player2.state;
    const p2ClearingRows = battleGame.player2.getClearingRows();
    const p2Combo = battleGame.player2.getCombo();
    const p2ShowCombo = battleGame.player2.shouldShowCombo();

    this.renderer2.render(p2State, p2ClearingRows, p2Combo, p2ShowCombo);

    // 將玩家畫面複製到主 canvas
    this.ctx.drawImage(this.player1Canvas, this.player1Offset.x, this.player1Offset.y);
    this.ctx.drawImage(this.player2Canvas, this.player2Offset.x, this.player2Offset.y);

    // 渲染玩家標籤
    this.renderPlayerLabels();

    // 渲染攻擊隊列指示器
    this.renderAttackQueues(battleGame);

    // 渲染下一個方塊預覽
    this.renderNextPiecePreviews(battleGame);

    // 渲染勝負結果
    const winner = battleGame.getWinner();
    if (winner !== null) {
      this.renderWinner(winner);
    }
  }

  /**
   * 渲染玩家標籤
   */
  renderPlayerLabels() {
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';

    const gridWidth = GAME_CONSTANTS.GRID_WIDTH * GAME_CONSTANTS.BLOCK_SIZE;

    // 玩家 1 標籤
    this.ctx.fillStyle = '#00FFFF';
    this.ctx.fillText('PLAYER 1', this.player1Offset.x + gridWidth / 2, this.player1Offset.y - 15);

    // 玩家 2 標籤
    this.ctx.fillStyle = '#FF00FF';
    this.ctx.fillText('PLAYER 2', this.player2Offset.x + gridWidth / 2, this.player2Offset.y - 15);
  }

  /**
   * 渲染攻擊隊列指示器（顯示即將到來的垃圾行數）
   * @param {BattleGame} battleGame - 對戰遊戲實例
   */
  renderAttackQueues(battleGame) {
    const gridHeight = GAME_CONSTANTS.GRID_HEIGHT * GAME_CONSTANTS.BLOCK_SIZE;

    // 計算攻擊隊列總數
    const p1QueueTotal = battleGame.attackQueue1.reduce((sum, count) => sum + count, 0);
    const p2QueueTotal = battleGame.attackQueue2.reduce((sum, count) => sum + count, 0);

    // 玩家 1 的攻擊隊列指示器
    if (p1QueueTotal > 0) {
      const x = this.player1Offset.x + 5;
      const y = this.player1Offset.y + gridHeight - 30;
      this.renderQueueIndicator(x, y, p1QueueTotal, '#FF6B6B');
    }

    // 玩家 2 的攻擊隊列指示器
    if (p2QueueTotal > 0) {
      const x = this.player2Offset.x + 5;
      const y = this.player2Offset.y + gridHeight - 30;
      this.renderQueueIndicator(x, y, p2QueueTotal, '#FF6B6B');
    }
  }

  /**
   * 渲染單個攻擊隊列指示器
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @param {number} count - 垃圾行數
   * @param {string} color - 顏色
   */
  renderQueueIndicator(x, y, count, color) {
    // 繪製背景框
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(x, y, 90, 25);

    // 繪製邊框（閃爍效果）
    const time = Date.now();
    const flash = Math.sin(time * 0.005) * 0.3 + 0.7; // 0.4-1.0 之間振盪
    this.ctx.strokeStyle = `rgba(255, 107, 107, ${flash})`;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, 90, 25);

    // 繪製警告圖示 (▼)
    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('▼', x + 5, y + 13);

    // 繪製垃圾行數
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText(`${count} line${count > 1 ? 's' : ''}`, x + 25, y + 13);
  }

  /**
   * 渲染兩個玩家的下一個方塊預覽
   * @param {BattleGame} battleGame - 對戰遊戲實例
   */
  renderNextPiecePreviews(battleGame) {
    const gridWidth = GAME_CONSTANTS.GRID_WIDTH * GAME_CONSTANTS.BLOCK_SIZE;
    const blockSize = GAME_CONSTANTS.BLOCK_SIZE;

    // 玩家 1 的下一個方塊（在遊戲板右側）
    if (battleGame.player1.state.nextPiece) {
      const x = this.player1Offset.x + gridWidth + 15;
      const y = this.player1Offset.y + 50;
      this.renderNextPieceBox(x, y, battleGame.player1.state.nextPiece, blockSize, 'NEXT');
    }

    // 玩家 2 的下一個方塊（在遊戲板右側）
    if (battleGame.player2.state.nextPiece) {
      const x = this.player2Offset.x + gridWidth + 15;
      const y = this.player2Offset.y + 50;
      this.renderNextPieceBox(x, y, battleGame.player2.state.nextPiece, blockSize, 'NEXT');
    }
  }

  /**
   * 渲染單個下一個方塊預覽框
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   * @param {Tetromino} tetromino - 方塊
   * @param {number} blockSize - 方塊大小
   * @param {string} label - 標籤文字
   */
  renderNextPieceBox(x, y, tetromino, blockSize, label) {
    const boxWidth = 120;
    const boxHeight = 120;

    // 繪製標籤
    this.ctx.font = 'bold 14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText(label, x + boxWidth / 2, y - 10);

    // 繪製背景框
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(x, y, boxWidth, boxHeight);

    // 繪製邊框
    this.ctx.strokeStyle = '#444444';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, boxWidth, boxHeight);

    // 取得方塊形狀
    const shape = TETROMINO_SHAPES[tetromino.type][0]; // 使用初始旋轉狀態

    // 計算居中位置
    const shapeWidth = shape[0].length;
    const shapeHeight = shape.length;
    const offsetX = x + (boxWidth - shapeWidth * blockSize) / 2;
    const offsetY = y + (boxHeight - shapeHeight * blockSize) / 2;

    // 渲染方塊
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const blockX = offsetX + col * blockSize;
          const blockY = offsetY + row * blockSize;

          // 填充顏色
          this.ctx.fillStyle = tetromino.color;
          this.ctx.fillRect(blockX + 1, blockY + 1, blockSize - 2, blockSize - 2);

          // 繪製高光效果
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          this.ctx.fillRect(blockX + 1, blockY + 1, blockSize - 2, 4);

          // 繪製陰影效果
          this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          this.ctx.fillRect(blockX + 1, blockY + blockSize - 5, blockSize - 2, 4);
        }
      }
    }
  }

  /**
   * 渲染控制說明
   */
  renderControls() {
    const startY = this.canvas.height - 80;
    const leftX = 30;
    const rightX = this.canvas.width / 2 + 30;

    this.ctx.font = '12px Arial';
    this.ctx.textAlign = 'left';

    // 玩家 1 控制說明
    this.ctx.fillStyle = '#00FFFF';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('Player 1:', leftX, startY);

    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText('W=旋轉 A=左 S=下 D=右 Space=硬降', leftX, startY + 18);

    // 玩家 2 控制說明
    this.ctx.fillStyle = '#FF00FF';
    this.ctx.font = 'bold 14px Arial';
    this.ctx.fillText('Player 2:', rightX, startY);

    this.ctx.font = '11px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText('↑=旋轉 ←=左 ↓=下 →=右 Enter=硬降', rightX, startY + 18);

    // 共用控制
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('P 鍵暫停', this.canvas.width / 2, startY + 45);
  }

  /**
   * 渲染勝負結果
   * @param {1 | 2 | 'draw'} winner - 勝利者
   */
  renderWinner(winner) {
    // 半透明黑色遮罩
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 勝利訊息
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    let message;
    if (winner === 'draw') {
      this.ctx.fillStyle = '#FFFF00';
      message = 'DRAW!';
    } else {
      this.ctx.fillStyle = winner === 1 ? '#00FFFF' : '#FF00FF';
      message = `PLAYER ${winner} WINS!`;
    }

    this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);

    // 提示訊息
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillText('Press SPACE to restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
  }

  /**
   * 清除畫面
   */
  clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
