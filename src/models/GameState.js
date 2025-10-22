/**
 * GameState - 遊戲整體狀態管理
 *
 * 職責：
 * - 管理遊戲狀態（IDLE, PLAYING, PAUSED, GAME_OVER）
 * - 追蹤分數、等級、消除行數
 * - 管理當前與下一個方塊
 * - 計算下落速度
 */

import { Grid } from './Grid.js';
import { Tetromino } from './Tetromino.js';
import { GameStatus, TetrominoType, GAME_CONSTANTS } from '../utils/Constants.js';

export class GameState {
  constructor() {
    this.status = GameStatus.IDLE;
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.currentPiece = null; // 當前下落的方塊
    this.nextPiece = null; // 下一個方塊（預覽）
    this.grid = new Grid(10, 20);
    this.dropSpeed = GAME_CONSTANTS.INITIAL_DROP_SPEED; // 下落速度（毫秒）
    this.lastDropTime = 0;
  }

  /**
   * 開始遊戲
   */
  start() {
    this.status = GameStatus.PLAYING;
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.grid.clear();
    this.spawnNewPiece();
    this.lastDropTime = Date.now();
  }

  /**
   * 暫停/恢復
   */
  togglePause() {
    if (this.status === GameStatus.PLAYING) {
      this.status = GameStatus.PAUSED;
    } else if (this.status === GameStatus.PAUSED) {
      this.status = GameStatus.PLAYING;
      this.lastDropTime = Date.now(); // 重設時間避免瞬間下落
    }
  }

  /**
   * 遊戲結束
   */
  gameOver() {
    this.status = GameStatus.GAME_OVER;
  }

  /**
   * 生成新方塊
   */
  spawnNewPiece() {
    this.currentPiece = this.nextPiece || this.createRandomPiece();
    this.nextPiece = this.createRandomPiece();
  }

  /**
   * 建立隨機方塊
   * @returns {Tetromino}
   */
  createRandomPiece() {
    const types = Object.values(TetrominoType);
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new Tetromino(randomType);
  }

  /**
   * 增加分數
   * @param {number} points - 增加的分數
   */
  addScore(points) {
    this.score += points;
  }

  /**
   * 增加消除行數
   * @param {number} count - 消除的行數
   */
  addClearedLines(count) {
    this.linesCleared += count;
    this.updateLevel();
  }

  /**
   * 更新等級（每 10 行提升一級）
   */
  updateLevel() {
    const newLevel = Math.floor(this.linesCleared / GAME_CONSTANTS.LINES_PER_LEVEL) + 1;
    if (newLevel !== this.level) {
      this.level = newLevel;
      this.updateDropSpeed();
    }
  }

  /**
   * 更新下落速度（每級快 10%）
   */
  updateDropSpeed() {
    this.dropSpeed = Math.max(
      GAME_CONSTANTS.INITIAL_DROP_SPEED * Math.pow(GAME_CONSTANTS.SPEED_DECREASE_RATE, this.level - 1),
      GAME_CONSTANTS.MIN_DROP_SPEED // 最快 50ms
    );
  }

  /**
   * 取得遊戲狀態快照（用於日誌）
   * @returns {Object}
   */
  getSnapshot() {
    return {
      status: this.status,
      score: this.score,
      level: this.level,
      linesCleared: this.linesCleared,
      dropSpeed: this.dropSpeed,
    };
  }
}
