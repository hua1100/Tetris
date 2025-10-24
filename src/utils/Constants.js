/**
 * 遊戲常數定義
 *
 * 包含所有遊戲相關的常數：
 * - 遊戲板尺寸
 * - 方塊形狀定義
 * - 顏色配置
 * - 計分規則
 * - 效能目標
 */

// ============================================================================
// 方塊類型枚舉
// ============================================================================

export const TetrominoType = Object.freeze({
  I: 'I',
  O: 'O',
  T: 'T',
  S: 'S',
  Z: 'Z',
  J: 'J',
  L: 'L',
});

// ============================================================================
// 方塊形狀定義（每種方塊有 4 個旋轉狀態）
// ============================================================================

export const TETROMINO_SHAPES = Object.freeze({
  I: [
    // 0° - 水平
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // 90° - 垂直
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    // 180° - 水平
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    // 270° - 垂直
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],

  O: [
    // O 型不旋轉，四個狀態相同
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ],

  T: [
    // 0° - 向上
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90° - 向右
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    // 180° - 向下
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    // 270° - 向左
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],

  S: [
    // 0°
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    // 90°
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    // 180°
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    // 270°
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],

  Z: [
    // 0°
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    // 90°
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    // 180°
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    // 270°
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],

  J: [
    // 0° - 左下
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90° - 右上
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    // 180° - 右上
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    // 270° - 左下
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],

  L: [
    // 0° - 右下
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    // 90° - 左上
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    // 180° - 左上
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    // 270° - 右下
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
});

// ============================================================================
// 方塊顏色定義
// ============================================================================

export const TETROMINO_COLORS = Object.freeze({
  I: '#00FFFF', // Cyan 青色
  O: '#FFFF00', // Yellow 黃色
  T: '#9900FF', // Purple 紫色
  S: '#00FF00', // Green 綠色
  Z: '#FF0000', // Red 紅色
  J: '#0000FF', // Blue 藍色
  L: '#FF7F00', // Orange 橘色
});

// ============================================================================
// 遊戲常數
// ============================================================================

export const GAME_CONSTANTS = Object.freeze({
  // 遊戲板尺寸
  GRID_WIDTH: 10,
  GRID_HEIGHT: 20,
  BLOCK_SIZE: 30, // 像素

  // 下落速度
  INITIAL_DROP_SPEED: 800, // 毫秒（從 1000 降低到 800）
  MIN_DROP_SPEED: 100, // 毫秒（從 50 提高到 100，避免太快）
  SPEED_DECREASE_RATE: 0.85, // 每級快 15%（從 0.9 改為 0.85）

  // 等級系統
  LINES_PER_LEVEL: 8, // 每 8 行升級（從 10 改為 8，更快升級）

  // 效能目標
  TARGET_FPS: 60,
  INPUT_RESPONSE_THRESHOLD: 16, // 毫秒
});

// ============================================================================
// 計分表
// ============================================================================

export const SCORE_TABLE = Object.freeze({
  1: 100, // 1 行 - Single
  2: 300, // 2 行 - Double
  3: 500, // 3 行 - Triple
  4: 800, // 4 行 - Tetris
});

// ============================================================================
// 遊戲狀態枚舉
// ============================================================================

export const GameStatus = Object.freeze({
  IDLE: 'IDLE', // 尚未開始
  PLAYING: 'PLAYING', // 遊戲進行中
  PAUSED: 'PAUSED', // 暫停
  GAME_OVER: 'GAME_OVER', // 遊戲結束
});

// ============================================================================
// 輸入指令枚舉
// ============================================================================

export const InputCommand = Object.freeze({
  MOVE_LEFT: 'MOVE_LEFT',
  MOVE_RIGHT: 'MOVE_RIGHT',
  MOVE_DOWN: 'MOVE_DOWN', // 加速下落
  ROTATE_CW: 'ROTATE_CW', // 順時針旋轉
  HARD_DROP: 'HARD_DROP', // 硬降（瞬間落底）
  PAUSE: 'PAUSE',
});

// ============================================================================
// 鍵盤映射
// ============================================================================

export const KEY_BINDINGS = Object.freeze({
  // 方向鍵
  ArrowLeft: InputCommand.MOVE_LEFT,
  ArrowRight: InputCommand.MOVE_RIGHT,
  ArrowDown: InputCommand.MOVE_DOWN,
  ArrowUp: InputCommand.ROTATE_CW,

  // WASD
  KeyA: InputCommand.MOVE_LEFT,
  KeyD: InputCommand.MOVE_RIGHT,
  KeyS: InputCommand.MOVE_DOWN,
  KeyW: InputCommand.ROTATE_CW,

  // 其他
  Space: InputCommand.HARD_DROP,
  KeyP: InputCommand.PAUSE,
});

// ============================================================================
// 遊戲事件類型（用於日誌）
// ============================================================================

export const GameEvent = Object.freeze({
  GAME_START: 'GAME_START',
  GAME_PAUSE: 'GAME_PAUSE',
  GAME_RESUME: 'GAME_RESUME',
  GAME_OVER: 'GAME_OVER',
  PIECE_SPAWN: 'PIECE_SPAWN',
  PIECE_MOVE: 'PIECE_MOVE',
  PIECE_ROTATE: 'PIECE_ROTATE',
  PIECE_LOCK: 'PIECE_LOCK',
  LINE_CLEAR: 'LINE_CLEAR',
  LEVEL_UP: 'LEVEL_UP',
  INPUT_LAG: 'INPUT_LAG',
});

// ============================================================================
// 對戰模式常數（Battle Mode）
// ============================================================================

// 遊戲模式枚舉
export const GameMode = Object.freeze({
  SINGLE_PLAYER: 'SINGLE_PLAYER',
  BATTLE: 'BATTLE',
});

// 垃圾行顏色
export const GARBAGE_COLOR = '#808080'; // 灰色

// 攻擊表（消行數 → 垃圾行數）
export const ATTACK_TABLE = Object.freeze({
  1: 0,  // 消 1 行不攻擊
  2: 1,  // 消 2 行送 1 行垃圾
  3: 2,  // 消 3 行送 2 行垃圾
  4: 4,  // 消 4 行送 4 行垃圾（Tetris）
});

// 連擊加成表
export const COMBO_BONUS = Object.freeze({
  1: 0,  // 無連擊
  2: 1,  // 2 連擊 +1 行
  3: 2,  // 3 連擊 +2 行
  // 4 以上統一 +3
});

/**
 * 取得連擊加成
 * @param {number} combo - 連擊數
 * @returns {number} 加成的垃圾行數
 */
export function getComboBonus(combo) {
  return combo >= 4 ? 3 : (COMBO_BONUS[combo] || 0);
}

// 玩家 1 按鍵映射（WASD + Space）
export const PLAYER1_KEY_BINDINGS = Object.freeze({
  KeyW: InputCommand.ROTATE_CW,
  KeyA: InputCommand.MOVE_LEFT,
  KeyS: InputCommand.MOVE_DOWN,
  KeyD: InputCommand.MOVE_RIGHT,
  Space: InputCommand.HARD_DROP,
});

// 玩家 2 按鍵映射（方向鍵 + Enter）
export const PLAYER2_KEY_BINDINGS = Object.freeze({
  ArrowUp: InputCommand.ROTATE_CW,
  ArrowLeft: InputCommand.MOVE_LEFT,
  ArrowDown: InputCommand.MOVE_DOWN,
  ArrowRight: InputCommand.MOVE_RIGHT,
  Enter: InputCommand.HARD_DROP,
});

// 暫停鍵（共用）
export const PAUSE_KEY = 'KeyP';

// 攻擊隊列最大長度
export const MAX_ATTACK_QUEUE_LENGTH = 20;
