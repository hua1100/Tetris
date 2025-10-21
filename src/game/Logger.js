/**
 * 結構化日誌系統
 *
 * 符合憲法原則 7：所有模組必須輸出結構化日誌
 *
 * 功能：
 * - 記錄所有遊戲事件（方塊生成、移動、旋轉、消行等）
 * - JSON 格式輸出（機器可讀）
 * - 包含時間戳和完整上下文
 * - 支援效能監控（輸入延遲）
 */

import { GameEvent } from '../utils/Constants.js';

export class Logger {
  /**
   * 建立 Logger 實例
   *
   * @param {boolean} enableConsole - 是否輸出到瀏覽器 Console（預設 true）
   * @param {boolean} enableStorage - 是否儲存到記憶體陣列（預設 false，用於除錯）
   */
  constructor(enableConsole = true, enableStorage = false) {
    this.enableConsole = enableConsole;
    this.enableStorage = enableStorage;
    this.logs = [];
  }

  /**
   * 記錄遊戲事件
   *
   * @param {string} event - 事件類型（GameEvent 枚舉值）
   * @param {object} data - 額外的上下文資料
   */
  log(event, data = {}) {
    const logEntry = {
      timestamp: Date.now(),
      event: event,
      ...data,
    };

    // 輸出到 Console
    if (this.enableConsole) {
      console.log(JSON.stringify(logEntry));
    }

    // 儲存到記憶體
    if (this.enableStorage) {
      this.logs.push(logEntry);
    }
  }

  /**
   * 記錄遊戲開始事件
   */
  logGameStart() {
    this.log(GameEvent.GAME_START, {});
  }

  /**
   * 記錄遊戲暫停事件
   */
  logGamePause() {
    this.log(GameEvent.GAME_PAUSE, {});
  }

  /**
   * 記錄遊戲恢復事件
   */
  logGameResume() {
    this.log(GameEvent.GAME_RESUME, {});
  }

  /**
   * 記錄遊戲結束事件
   *
   * @param {number} finalScore - 最終分數
   * @param {number} finalLevel - 最終等級
   */
  logGameOver(finalScore, finalLevel) {
    this.log(GameEvent.GAME_OVER, {
      finalScore,
      finalLevel,
    });
  }

  /**
   * 記錄方塊生成事件
   *
   * @param {object} tetromino - 方塊實例
   */
  logPieceSpawn(tetromino) {
    this.log(GameEvent.PIECE_SPAWN, {
      type: tetromino.type,
      position: { x: tetromino.position.x, y: tetromino.position.y },
      rotation: tetromino.rotation,
    });
  }

  /**
   * 記錄方塊移動事件
   *
   * @param {string} direction - 移動方向（"LEFT", "RIGHT", "DOWN"）
   * @param {object} newPosition - 新位置（Position 實例）
   */
  logPieceMove(direction, newPosition) {
    this.log(GameEvent.PIECE_MOVE, {
      direction,
      newPosition: { x: newPosition.x, y: newPosition.y },
    });
  }

  /**
   * 記錄方塊旋轉事件
   *
   * @param {number} direction - 旋轉方向（1 = 順時針，-1 = 逆時針）
   * @param {boolean} success - 旋轉是否成功
   */
  logPieceRotate(direction, success) {
    this.log(GameEvent.PIECE_ROTATE, {
      direction,
      success,
    });
  }

  /**
   * 記錄方塊固定事件
   *
   * @param {object} position - 固定位置（Position 實例）
   */
  logPieceLock(position) {
    this.log(GameEvent.PIECE_LOCK, {
      position: { x: position.x, y: position.y },
    });
  }

  /**
   * 記錄消行事件
   *
   * @param {number} rowCount - 消除的行數
   * @param {number} score - 獲得的分數
   */
  logLineClear(rowCount, score) {
    this.log(GameEvent.LINE_CLEAR, {
      rowCount,
      score,
    });
  }

  /**
   * 記錄等級提升事件
   *
   * @param {number} newLevel - 新等級
   * @param {number} newSpeed - 新的下落速度（毫秒）
   */
  logLevelUp(newLevel, newSpeed) {
    this.log(GameEvent.LEVEL_UP, {
      newLevel,
      newSpeed,
    });
  }

  /**
   * 記錄輸入延遲過高事件
   *
   * @param {number} latency - 輸入延遲（毫秒）
   */
  logInputLag(latency) {
    this.log(GameEvent.INPUT_LAG, {
      latency,
    });
  }

  /**
   * 取得所有儲存的日誌
   *
   * @returns {Array} 日誌條目陣列
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * 清空儲存的日誌
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * 匯出日誌為 JSON 字串
   *
   * @returns {string} JSON 格式的日誌
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }
}
