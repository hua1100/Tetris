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
  constructor(enableAnimations = true) {
    this.state = new GameState();
    this.logger = new Logger(true, false); // 啟用 console，不啟用 storage
    this.isRunning = false;
    this.lastUpdateTime = 0;
    this.dropTimer = 0; // 累積下落時間
    this.lockDelay = 500; // 鎖定延遲（毫秒）
    this.lockTimer = 0; // 鎖定計時器
    this.isAtBottom = false; // 是否在底部
    this.clearedRows = []; // 正在清除的行（用於動畫）
    this.clearDelay = 400; // 消行動畫延遲（毫秒）
    this.clearTimer = 0; // 消行計時器
    this.isClearing = false; // 是否正在消行動畫
    this.combo = 0; // 連擊數
    this.comboTimer = 0; // 連擊顯示計時器
    this.comboDisplayDuration = 2000; // 連擊顯示持續時間
    this.enableAnimations = enableAnimations; // 是否啟用動畫
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

    // 處理消行動畫
    if (this.isClearing) {
      this.clearTimer += deltaTime;

      if (this.clearTimer >= this.clearDelay) {
        // 動畫結束，實際清除行
        this.finishClearLines();
        this.isClearing = false;
        this.clearTimer = 0;
      }

      return; // 消行動畫期間不處理其他邏輯
    }

    // 更新連擊顯示計時器
    if (this.comboTimer > 0) {
      this.comboTimer -= deltaTime;
      if (this.comboTimer <= 0) {
        this.comboTimer = 0;
      }
    }

    // 累積下落時間
    this.dropTimer += deltaTime;

    // 檢查是否需要自動下落
    if (this.dropTimer >= this.state.dropSpeed) {
      this.dropTimer = 0;

      // 嘗試下落
      const canDrop = this.tryMovePieceDown();

      if (!canDrop) {
        // 無法下落，進入鎖定延遲狀態
        this.isAtBottom = true;
        this.lockTimer = 0;
      }
    }

    // 處理鎖定延遲
    if (this.isAtBottom) {
      this.lockTimer += deltaTime;

      if (this.lockTimer >= this.lockDelay) {
        // 鎖定延遲時間到，鎖定方塊
        this.lockCurrentPiece();
        this.isAtBottom = false;
        this.lockTimer = 0;
      }
    }
  }

  /**
   * 嘗試向下移動方塊（不鎖定）
   * @returns {boolean} 是否成功移動
   */
  tryMovePieceDown() {
    const testPiece = this.state.currentPiece.clone();
    testPiece.move(0, 1);

    if (this.canMovePiece(testPiece)) {
      this.state.currentPiece.move(0, 1);
      this.logger.logPieceMove('DOWN', {
        x: this.state.currentPiece.position.x,
        y: this.state.currentPiece.position.y,
      });

      // 成功移動，重置鎖定狀態
      this.isAtBottom = false;
      this.lockTimer = 0;

      return true;
    }

    return false;
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

      // 重置鎖定計時器（允許在底部調整位置）
      if (this.isAtBottom) {
        this.lockTimer = 0;
      }

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

      // 重置鎖定計時器（允許在底部調整位置）
      if (this.isAtBottom) {
        this.lockTimer = 0;
      }

      return true;
    }

    return false;
  }

  /**
   * 向下移動方塊（玩家按下向下鍵）
   * @returns {boolean} 是否成功移動
   */
  movePieceDown() {
    const moved = this.tryMovePieceDown();

    if (!moved) {
      // 無法再下移，立即鎖定（不等待延遲）
      this.lockCurrentPiece();
      this.isAtBottom = false;
      this.lockTimer = 0;
    }

    return moved;
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

      // 重置鎖定計時器（允許在底部旋轉調整）
      if (this.isAtBottom) {
        this.lockTimer = 0;
      }

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

    if (completeRows.length === 0) {
      // 沒有消行，重置連擊
      this.combo = 0;
      return;
    }

    // 記錄要清除的行（用於動畫）
    this.clearedRows = completeRows;

    // 增加連擊數
    this.combo++;
    this.comboTimer = this.comboDisplayDuration;

    if (this.enableAnimations) {
      // 進入消行動畫狀態
      this.isClearing = true;
      this.clearTimer = 0;
    } else {
      // 測試模式：直接清除，不使用動畫
      this.finishClearLines();
    }
  }

  /**
   * 完成清除行（動畫結束後）
   */
  finishClearLines() {
    if (this.clearedRows.length === 0) return;

    // 移除完整行
    this.state.grid.removeRows(this.clearedRows);

    // 計算分數（基礎分數 × 等級 × 連擊倍率）
    const baseScore = SCORE_TABLE[this.clearedRows.length] || 0;
    const comboMultiplier = this.combo > 1 ? 1 + (this.combo - 1) * 0.5 : 1;
    const score = Math.floor(baseScore * this.state.level * comboMultiplier);

    // 更新狀態
    const oldLevel = this.state.level;
    this.state.addScore(score);
    this.state.addClearedLines(this.clearedRows.length);

    // 記錄日誌
    this.logger.logLineClear(this.clearedRows.length, score);

    // 檢查是否升級
    if (this.state.level > oldLevel) {
      this.logger.logLevelUp(this.state.level, this.state.dropSpeed);
    }

    // 清空清除行列表
    this.clearedRows = [];
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

  /**
   * 取得連擊數
   * @returns {number}
   */
  getCombo() {
    return this.combo;
  }

  /**
   * 取得正在清除的行
   * @returns {number[]}
   */
  getClearingRows() {
    return this.isClearing ? this.clearedRows : [];
  }

  /**
   * 取得連擊是否應該顯示
   * @returns {boolean}
   */
  shouldShowCombo() {
    return this.comboTimer > 0 && this.combo > 1;
  }
}
