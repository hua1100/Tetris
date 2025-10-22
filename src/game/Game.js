/**
 * Game - 遊戲主控制器
 *
 * 職責：
 * - 管理遊戲循環（update loop）
 * - 處理方塊移動、旋轉、下落
 * - 碰撞檢測
 * - 消行與計分
 * - 遊戲狀態轉換
 */

import { GameState } from '../models/GameState.js';
import { Logger } from './Logger.js';
import { GameStatus, SCORE_TABLE } from '../utils/Constants.js';

export class Game {
  constructor() {
    this.state = new GameState();
    this.logger = new Logger(true, false); // 啟用 console，不啟用 storage
    this.isRunning = false;
    this.lastUpdateTime = 0;
  }

  /**
   * 開始遊戲
   */
  start() {
    if (this.isRunning) return;

    this.state.start();
    this.isRunning = true;
    this.lastUpdateTime = Date.now();
    this.logger.logGameStart();
  }

  /**
   * 暫停遊戲
   */
  pause() {
    if (this.state.status !== GameStatus.PLAYING) return;

    this.state.togglePause();
    this.logger.logGamePause();
  }

  /**
   * 恢復遊戲
   */
  resume() {
    if (this.state.status !== GameStatus.PAUSED) return;

    this.state.togglePause();
    this.lastUpdateTime = Date.now();
    this.logger.logGameResume();
  }

  /**
   * 切換暫停狀態
   */
  togglePause() {
    if (this.state.status === GameStatus.PLAYING) {
      this.pause();
    } else if (this.state.status === GameStatus.PAUSED) {
      this.resume();
    }
  }

  /**
   * 遊戲結束
   */
  gameOver() {
    this.state.gameOver();
    this.isRunning = false;
    this.logger.logGameOver(
      this.state.score,
      this.state.level,
      this.state.linesCleared
    );
  }

  /**
   * 遊戲更新循環
   * @param {number} deltaTime - 距離上次更新的時間（毫秒）
   */
  update(deltaTime) {
    if (this.state.status !== GameStatus.PLAYING) return;

    // 檢查是否需要下落
    const timeSinceLastDrop = deltaTime;
    if (timeSinceLastDrop >= this.state.dropSpeed) {
      this.movePieceDown();
      this.state.lastDropTime = Date.now();
    }
  }

  /**
   * 檢查方塊是否可移動到指定位置
   * @param {Tetromino} piece - 要檢查的方塊
   * @returns {boolean} 是否可移動
   */
  canMovePiece(piece) {
    const blocks = piece.getBlocks();

    for (const block of blocks) {
      // 檢查邊界
      if (!this.state.grid.isInBounds(block.x, block.y)) {
        return false;
      }

      // 檢查是否與已固定方塊重疊
      if (this.state.grid.isOccupied(block.x, block.y)) {
        return false;
      }
    }

    return true;
  }

  /**
   * 向左移動方塊
   * @returns {boolean} 是否成功移動
   */
  movePieceLeft() {
    const testPiece = this.state.currentPiece.clone();
    testPiece.move(-1, 0);

    if (this.canMovePiece(testPiece)) {
      this.state.currentPiece.move(-1, 0);
      this.logger.logPieceMove('LEFT', {
        x: this.state.currentPiece.position.x,
        y: this.state.currentPiece.position.y,
      });
      return true;
    }

    return false;
  }

  /**
   * 向右移動方塊
   * @returns {boolean} 是否成功移動
   */
  movePieceRight() {
    const testPiece = this.state.currentPiece.clone();
    testPiece.move(1, 0);

    if (this.canMovePiece(testPiece)) {
      this.state.currentPiece.move(1, 0);
      this.logger.logPieceMove('RIGHT', {
        x: this.state.currentPiece.position.x,
        y: this.state.currentPiece.position.y,
      });
      return true;
    }

    return false;
  }

  /**
   * 向下移動方塊
   * @returns {boolean} 是否成功移動
   */
  movePieceDown() {
    const testPiece = this.state.currentPiece.clone();
    testPiece.move(0, 1);

    if (this.canMovePiece(testPiece)) {
      this.state.currentPiece.move(0, 1);
      this.logger.logPieceMove('DOWN', {
        x: this.state.currentPiece.position.x,
        y: this.state.currentPiece.position.y,
      });
      return true;
    }

    // 無法下移，鎖定方塊
    this.lockCurrentPiece();
    return false;
  }

  /**
   * 旋轉方塊
   * @returns {boolean} 是否成功旋轉
   */
  rotatePiece() {
    const testPiece = this.state.currentPiece.clone();
    testPiece.rotate();

    if (this.canMovePiece(testPiece)) {
      this.state.currentPiece.rotate();
      this.logger.logPieceRotate(
        this.state.currentPiece.rotation,
        {
          x: this.state.currentPiece.position.x,
          y: this.state.currentPiece.position.y,
        }
      );
      return true;
    }

    return false;
  }

  /**
   * 鎖定當前方塊到網格
   */
  lockCurrentPiece() {
    // 固定方塊
    this.state.grid.lockTetromino(this.state.currentPiece);

    this.logger.logPieceLock(
      this.state.currentPiece.type,
      {
        x: this.state.currentPiece.position.x,
        y: this.state.currentPiece.position.y,
      }
    );

    // 清除完整行
    this.clearLines();

    // 生成新方塊
    this.state.spawnNewPiece();

    this.logger.logPieceSpawn(this.state.currentPiece);

    // 檢查遊戲是否結束
    this.checkGameOver();
  }

  /**
   * 清除完整行並計分
   */
  clearLines() {
    const completeRows = this.state.grid.getCompleteRows();

    if (completeRows.length === 0) return;

    // 移除完整行
    this.state.grid.removeRows(completeRows);

    // 計算分數（基礎分數 × 等級）
    const baseScore = SCORE_TABLE[completeRows.length] || 0;
    const score = baseScore * this.state.level;

    // 更新狀態
    const oldLevel = this.state.level;
    this.state.addScore(score);
    this.state.addClearedLines(completeRows.length);

    // 記錄日誌
    this.logger.logLineClear(completeRows.length, score);

    // 檢查是否升級
    if (this.state.level > oldLevel) {
      this.logger.logLevelUp(this.state.level, this.state.dropSpeed);
    }
  }

  /**
   * 檢查遊戲是否結束
   * @returns {boolean} 是否遊戲結束
   */
  checkGameOver() {
    // 檢查新方塊是否能放置
    if (!this.canMovePiece(this.state.currentPiece)) {
      this.gameOver();
      return true;
    }

    return false;
  }

  /**
   * 取得遊戲狀態
   * @returns {GameState}
   */
  getState() {
    return this.state;
  }
}
