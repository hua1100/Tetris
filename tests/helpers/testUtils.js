/**
 * 測試輔助函數
 *
 * 提供常用的測試工具函數，簡化測試撰寫
 */

/**
 * 建立測試用的 mock Logger
 *
 * @returns {object} Mock Logger 實例
 */
export function createMockLogger() {
  const logs = [];

  return {
    log: (event, data) => {
      logs.push({ event, data, timestamp: Date.now() });
    },
    logGameStart: () => logs.push({ event: 'GAME_START' }),
    logGamePause: () => logs.push({ event: 'GAME_PAUSE' }),
    logGameResume: () => logs.push({ event: 'GAME_RESUME' }),
    logGameOver: (finalScore, finalLevel) =>
      logs.push({ event: 'GAME_OVER', finalScore, finalLevel }),
    logPieceSpawn: tetromino =>
      logs.push({ event: 'PIECE_SPAWN', type: tetromino.type }),
    logPieceMove: (direction, newPosition) =>
      logs.push({ event: 'PIECE_MOVE', direction, newPosition }),
    logPieceRotate: (direction, success) =>
      logs.push({ event: 'PIECE_ROTATE', direction, success }),
    logPieceLock: position => logs.push({ event: 'PIECE_LOCK', position }),
    logLineClear: (rowCount, score) =>
      logs.push({ event: 'LINE_CLEAR', rowCount, score }),
    logLevelUp: (newLevel, newSpeed) =>
      logs.push({ event: 'LEVEL_UP', newLevel, newSpeed }),
    logInputLag: latency => logs.push({ event: 'INPUT_LAG', latency }),
    getLogs: () => [...logs],
    clearLogs: () => (logs.length = 0),
  };
}

/**
 * 建立測試用的 2D 陣列（Grid 資料）
 *
 * @param {number} width - 寬度
 * @param {number} height - 高度
 * @param {*} fillValue - 填充值（預設 null）
 * @returns {Array<Array>} 二維陣列
 */
export function create2DArray(width, height, fillValue = null) {
  return Array(height)
    .fill(null)
    .map(() => Array(width).fill(fillValue));
}

/**
 * 比較兩個位置是否相等
 *
 * @param {object} pos1 - 位置 1（{x, y}）
 * @param {object} pos2 - 位置 2（{x, y}）
 * @returns {boolean} 是否相等
 */
export function positionsEqual(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

/**
 * 等待指定時間（用於測試非同步邏輯）
 *
 * @param {number} ms - 等待時間（毫秒）
 * @returns {Promise} Promise
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 模擬鍵盤事件
 *
 * @param {string} code - 鍵盤碼（如 'ArrowLeft', 'KeyW'）
 * @returns {KeyboardEvent} 模擬的鍵盤事件
 */
export function createKeyboardEvent(code) {
  return new KeyboardEvent('keydown', {
    code: code,
    bubbles: true,
  });
}

/**
 * 斷言陣列包含特定元素
 *
 * @param {Array} array - 陣列
 * @param {*} element - 元素
 * @param {string} message - 錯誤訊息
 */
export function assertArrayContains(array, element, message = '') {
  if (!array.includes(element)) {
    throw new Error(message || `Array does not contain ${element}`);
  }
}

/**
 * 斷言陣列長度
 *
 * @param {Array} array - 陣列
 * @param {number} expectedLength - 預期長度
 * @param {string} message - 錯誤訊息
 */
export function assertArrayLength(array, expectedLength, message = '') {
  if (array.length !== expectedLength) {
    throw new Error(
      message || `Expected length ${expectedLength}, got ${array.length}`
    );
  }
}
