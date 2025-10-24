/**
 * BattleGame - 雙人對戰遊戲協調器
 *
 * 職責：
 * - 管理兩個獨立的 Game 實例
 * - 協調雙方的攻擊與防禦
 * - 判定勝負
 * - 同步更新兩位玩家的遊戲狀態
 */

import { Game } from './Game.js';
import { GameStatus, ATTACK_TABLE, getComboBonus, MAX_ATTACK_QUEUE_LENGTH } from '../utils/Constants.js';

export class BattleGame {
  /**
   * 建立新的對戰遊戲實例
   * @param {boolean} enableAnimations - 是否啟用動畫（預設 true）
   */
  constructor(enableAnimations = true) {
    // 雙玩家實例
    this.player1 = new Game(enableAnimations);
    this.player2 = new Game(enableAnimations);

    // 攻擊隊列（待發送給各玩家的垃圾行）
    this.attackQueue1 = []; // 玩家 1 待接收的垃圾
    this.attackQueue2 = []; // 玩家 2 待接收的垃圾

    // 遊戲狀態
    this.winner = null; // 勝利者：1, 2, 'draw', 或 null
    this.isRunning = false;
    this.lastUpdateTime = 0;
  }

  /**
   * 開始對戰遊戲
   */
  start() {
    if (this.isRunning) return;

    this.player1.start();
    this.player2.start();
    this.isRunning = true;
    this.lastUpdateTime = Date.now();
  }

  /**
   * 暫停對戰遊戲
   */
  pause() {
    if (!this.isRunning) return;

    this.player1.pause();
    this.player2.pause();
  }

  /**
   * 恢復對戰遊戲
   */
  resume() {
    // 檢查是否處於暫停狀態
    if (this.player1.state.status !== GameStatus.PAUSED) return;

    this.player1.resume();
    this.player2.resume();
    this.lastUpdateTime = Date.now(); // 重置時間避免跳躍
  }

  /**
   * 更新對戰遊戲狀態（每幀呼叫）
   * @param {number} deltaTime - 距離上次更新的時間（毫秒）
   */
  update(deltaTime) {
    if (!this.isRunning || this.winner) return;

    // 更新兩位玩家
    this.player1.update(deltaTime);
    this.player2.update(deltaTime);

    // 處理攻擊系統
    this.processAttacks();

    // 檢查勝負
    this.checkGameOver();
  }

  /**
   * 計算攻擊產生的垃圾行數
   * @param {number} linesCleared - 消除的行數
   * @param {number} combo - 當前連擊數
   * @returns {number} 垃圾行數
   */
  calculateGarbage(linesCleared, combo) {
    // 基礎攻擊（從 ATTACK_TABLE 取得）
    const baseAttack = ATTACK_TABLE[linesCleared] || 0;

    // 連擊加成（上限 +3）
    const comboBonus = getComboBonus(combo);

    return baseAttack + comboBonus;
  }

  /**
   * 發送垃圾行給指定玩家
   * @param {1 | 2} playerNum - 玩家編號
   * @param {number} garbageCount - 垃圾行數
   */
  sendGarbageToPlayer(playerNum, garbageCount) {
    if (playerNum !== 1 && playerNum !== 2) {
      throw new Error(`Invalid player number: ${playerNum}. Must be 1 or 2.`);
    }

    if (garbageCount <= 0) return;

    // 加入對應玩家的攻擊隊列
    if (playerNum === 1) {
      this.attackQueue1.push(garbageCount);
    } else {
      this.attackQueue2.push(garbageCount);
    }
  }

  /**
   * 處理攻擊系統（每次更新呼叫）
   * - 先處理上一輪的攻擊隊列（將垃圾行加入玩家遊戲板）
   * - 然後檢查本輪玩家是否消行並計算攻擊發送給對手（加入隊列，下一輪才會處理）
   */
  processAttacks() {
    // 階段 1: 先保存當前隊列（這是上一輪產生的攻擊）
    const queue1ToProcess = [...this.attackQueue1];
    const queue2ToProcess = [...this.attackQueue2];

    // 清空隊列，準備接收本輪新的攻擊
    this.attackQueue1 = [];
    this.attackQueue2 = [];

    // 階段 2: 檢查玩家是否消行，並產生攻擊加入隊列（下一輪才會處理）
    const p1Cleared = this.player1.getLastClearedLines();
    if (p1Cleared >= 2) {
      const garbage = this.calculateGarbage(p1Cleared, this.player1.getCombo());
      this.sendGarbageToPlayer(2, garbage);
    }

    const p2Cleared = this.player2.getLastClearedLines();
    if (p2Cleared >= 2) {
      const garbage = this.calculateGarbage(p2Cleared, this.player2.getCombo());
      this.sendGarbageToPlayer(1, garbage);
    }

    // 階段 3: 處理上一輪的攻擊隊列，將垃圾行加入玩家遊戲板
    if (queue1ToProcess.length > 0) {
      const totalGarbage = queue1ToProcess.reduce((sum, count) => sum + count, 0);

      try {
        this.player1.state.grid.addGarbageLines(totalGarbage);
      } catch (error) {
        // 垃圾溢出導致玩家失敗
        this.player1.gameOver();
      }
    }

    if (queue2ToProcess.length > 0) {
      const totalGarbage = queue2ToProcess.reduce((sum, count) => sum + count, 0);

      try {
        this.player2.state.grid.addGarbageLines(totalGarbage);
      } catch (error) {
        // 垃圾溢出導致玩家失敗
        this.player2.gameOver();
      }
    }
  }

  /**
   * 檢查遊戲是否結束並判定勝負
   */
  checkGameOver() {
    const p1Over = this.player1.state.status === GameStatus.GAME_OVER;
    const p2Over = this.player2.state.status === GameStatus.GAME_OVER;

    if (p1Over && p2Over) {
      // 平局
      this.winner = 'draw';
      this.isRunning = false;
    } else if (p1Over) {
      // 玩家 2 勝利
      this.winner = 2;
      this.isRunning = false;
    } else if (p2Over) {
      // 玩家 1 勝利
      this.winner = 1;
      this.isRunning = false;
    }
  }

  /**
   * 獲取指定玩家的 Game 實例
   * @param {1 | 2} num - 玩家編號
   * @returns {Game} 玩家的 Game 實例
   */
  getPlayer(num) {
    if (num === 1) return this.player1;
    if (num === 2) return this.player2;
    throw new Error(`Invalid player number: ${num}. Must be 1 or 2.`);
  }

  /**
   * 獲取勝利者
   * @returns {1 | 2 | 'draw' | null} 勝利者編號，或 null（遊戲未結束）
   */
  getWinner() {
    // 如果已經有勝者，直接返回
    if (this.winner !== null) {
      return this.winner;
    }

    // 動態檢查當前狀態
    const p1Over = this.player1.state.status === GameStatus.GAME_OVER;
    const p2Over = this.player2.state.status === GameStatus.GAME_OVER;

    if (p1Over && p2Over) {
      this.winner = 'draw';
    } else if (p1Over) {
      this.winner = 2;
    } else if (p2Over) {
      this.winner = 1;
    }

    return this.winner;
  }
}
