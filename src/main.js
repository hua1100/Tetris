/**
 * Tetris 遊戲主進入點
 *
 * 此檔案負責：
 * 1. 初始化遊戲（單人/對戰模式）
 * 2. 設置事件監聽器
 * 3. 啟動遊戲循環
 * 4. 輸入路由（對戰模式下分配給不同玩家）
 */

import { Game } from './game/Game.js';
import { BattleGame } from './game/BattleGame.js';
import { Renderer } from './rendering/Renderer.js';
import { BattleRenderer } from './rendering/BattleRenderer.js';
import {
  GameStatus,
  GameMode,
  KEY_BINDINGS,
  PLAYER1_KEY_BINDINGS,
  PLAYER2_KEY_BINDINGS,
  PAUSE_KEY,
  InputCommand
} from './utils/Constants.js';

console.log('俄羅斯方塊遊戲初始化中...');

// 取得 Canvas 元素
const canvas = document.getElementById('game-canvas');
if (!canvas) {
  console.error('❌ Canvas 元素未找到');
  throw new Error('Canvas element not found');
}

// 遊戲狀態
let currentMode = null; // GameMode.SINGLE_PLAYER 或 GameMode.BATTLE
let game = null;
let battleGame = null;
let renderer = null;
let battleRenderer = null;

// 遊戲循環變數
let lastTime = 0;
let animationFrameId = null;

/**
 * 初始化單人模式
 */
function initSinglePlayerMode() {
  currentMode = GameMode.SINGLE_PLAYER;

  // 調整 canvas 大小
  canvas.width = 300;
  canvas.height = 600;

  // 顯示單人模式的側邊欄
  const sidebar = document.querySelector('.game-sidebar');
  if (sidebar) {
    sidebar.style.display = 'block';
  }

  // 隱藏對戰模式的控制說明
  const battleControlsOverlay = document.getElementById('battle-controls-overlay');
  if (battleControlsOverlay) {
    battleControlsOverlay.style.display = 'none';
  }

  // 建立單人遊戲實例
  game = new Game();
  renderer = new Renderer(canvas);

  console.log('✅ 單人模式已初始化');

  // 初始渲染
  renderer.render(
    game.getState(),
    game.getClearingRows(),
    game.getCombo(),
    game.shouldShowCombo()
  );
}

/**
 * 初始化對戰模式
 */
function initBattleMode() {
  currentMode = GameMode.BATTLE;

  // 調整 canvas 大小（雙玩家並排 + 預覽框 + 邊距）
  canvas.width = 960; // 兩個遊戲板(300x2) + 預覽框(140x2) + 間距 + 邊距
  canvas.height = 660; // 遊戲板高度 600 + 頂部標籤 40 + 底部空間 20

  // 隱藏單人模式的側邊欄
  const sidebar = document.querySelector('.game-sidebar');
  if (sidebar) {
    sidebar.style.display = 'none';
  }

  // 顯示對戰模式的控制說明
  const battleControlsOverlay = document.getElementById('battle-controls-overlay');
  if (battleControlsOverlay) {
    battleControlsOverlay.style.display = 'block';
  }

  // 建立對戰遊戲實例
  battleGame = new BattleGame();
  battleRenderer = new BattleRenderer(canvas);

  console.log('✅ 對戰模式已初始化');

  // 初始渲染
  battleRenderer.render(battleGame);
}

/**
 * 遊戲循環（單人模式）
 */
function singlePlayerGameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // 更新遊戲狀態
  game.update(deltaTime);

  // 渲染畫面
  renderer.render(
    game.getState(),
    game.getClearingRows(),
    game.getCombo(),
    game.shouldShowCombo()
  );

  // 繼續循環
  if (game.isRunning) {
    animationFrameId = requestAnimationFrame(singlePlayerGameLoop);
  }
}

/**
 * 遊戲循環（對戰模式）
 */
function battleGameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // 更新遊戲狀態
  battleGame.update(deltaTime);

  // 渲染畫面
  battleRenderer.render(battleGame);

  // 繼續循環
  if (battleGame.isRunning) {
    animationFrameId = requestAnimationFrame(battleGameLoop);
  }
}

/**
 * 開始遊戲循環
 */
function startGameLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  lastTime = performance.now();

  if (currentMode === GameMode.SINGLE_PLAYER) {
    animationFrameId = requestAnimationFrame(singlePlayerGameLoop);
  } else if (currentMode === GameMode.BATTLE) {
    animationFrameId = requestAnimationFrame(battleGameLoop);
  }
}

/**
 * 處理單人模式鍵盤輸入
 * @param {KeyboardEvent} event
 */
function handleSinglePlayerInput(event) {
  const command = KEY_BINDINGS[event.code];
  if (!command) return;

  const state = game.getState();

  // 處理指令
  switch (command) {
    case InputCommand.MOVE_LEFT:
      if (state.status === GameStatus.PLAYING) {
        game.movePieceLeft();
      }
      break;

    case InputCommand.MOVE_RIGHT:
      if (state.status === GameStatus.PLAYING) {
        game.movePieceRight();
      }
      break;

    case InputCommand.MOVE_DOWN:
      if (state.status === GameStatus.PLAYING) {
        game.movePieceDown();
      }
      break;

    case InputCommand.ROTATE_CW:
      if (state.status === GameStatus.PLAYING) {
        game.rotatePiece();
      }
      break;

    case InputCommand.HARD_DROP:
      if (state.status === GameStatus.IDLE || state.status === GameStatus.GAME_OVER) {
        // 開始或重新開始遊戲
        game.start();
        startGameLoop();
      } else if (state.status === GameStatus.PLAYING) {
        // 硬降
        while (game.movePieceDown()) {}
      }
      break;

    case InputCommand.PAUSE:
      if (state.status === GameStatus.PLAYING || state.status === GameStatus.PAUSED) {
        game.togglePause();
      }
      break;
  }
}

/**
 * 處理對戰模式鍵盤輸入
 * @param {KeyboardEvent} event
 */
function handleBattleInput(event) {
  // 暫停鍵（共用）
  if (event.code === PAUSE_KEY) {
    if (battleGame.player1.state.status === GameStatus.PLAYING) {
      battleGame.pause();
    } else if (battleGame.player1.state.status === GameStatus.PAUSED) {
      battleGame.resume();
    }
    return;
  }

  // 玩家 1 輸入（WASD + Space）
  const p1Command = PLAYER1_KEY_BINDINGS[event.code];
  if (p1Command && battleGame.player1.state.status === GameStatus.PLAYING) {
    handlePlayerCommand(battleGame.player1, p1Command);
  }

  // 玩家 2 輸入（方向鍵 + Enter）
  const p2Command = PLAYER2_KEY_BINDINGS[event.code];
  if (p2Command && battleGame.player2.state.status === GameStatus.PLAYING) {
    handlePlayerCommand(battleGame.player2, p2Command);
  }

  // 重新開始（Space - 遊戲結束後）
  if (event.code === 'Space' && battleGame.getWinner() !== null) {
    battleGame = new BattleGame();
    battleGame.start();
    startGameLoop();
  }
}

/**
 * 處理單一玩家的指令
 * @param {Game} player - 玩家實例
 * @param {string} command - 指令
 */
function handlePlayerCommand(player, command) {
  switch (command) {
    case InputCommand.MOVE_LEFT:
      player.movePieceLeft();
      break;
    case InputCommand.MOVE_RIGHT:
      player.movePieceRight();
      break;
    case InputCommand.MOVE_DOWN:
      player.movePieceDown();
      break;
    case InputCommand.ROTATE_CW:
      player.rotatePiece();
      break;
    case InputCommand.HARD_DROP:
      while (player.movePieceDown()) {}
      break;
  }
}

/**
 * 處理鍵盤輸入（路由到對應模式）
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  // 阻止方向鍵和空白鍵的預設行為
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(event.code)) {
    event.preventDefault();
  }

  if (currentMode === GameMode.SINGLE_PLAYER) {
    handleSinglePlayerInput(event);
  } else if (currentMode === GameMode.BATTLE) {
    handleBattleInput(event);
  }
}

// 設置鍵盤事件監聽
document.addEventListener('keydown', handleKeyDown);

// 模式選擇按鈕
const modeSelection = document.getElementById('mode-selection');
const gameContent = document.querySelector('.game-content');
const singlePlayerBtn = document.getElementById('single-player-btn');
const battleModeBtn = document.getElementById('battle-mode-btn');

if (singlePlayerBtn) {
  singlePlayerBtn.addEventListener('click', () => {
    modeSelection.style.display = 'none';
    gameContent.style.display = 'flex';

    // 顯示單人模式操作說明
    const singleControls = document.getElementById('single-player-controls');
    const battleControls = document.getElementById('battle-controls');
    if (singleControls) singleControls.style.display = 'block';
    if (battleControls) battleControls.style.display = 'none';

    initSinglePlayerMode();
    game.start();
    startGameLoop();
  });
}

if (battleModeBtn) {
  battleModeBtn.addEventListener('click', () => {
    modeSelection.style.display = 'none';
    gameContent.style.display = 'flex';

    // 顯示對戰模式操作說明
    const singleControls = document.getElementById('single-player-controls');
    const battleControls = document.getElementById('battle-controls');
    if (singleControls) singleControls.style.display = 'none';
    if (battleControls) battleControls.style.display = 'block';

    initBattleMode();
    battleGame.start();
    startGameLoop();
  });
}

// 開始/重新開始按鈕（單人模式用）
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

if (startButton) {
  startButton.addEventListener('click', () => {
    if (currentMode === GameMode.SINGLE_PLAYER && game) {
      game.start();
      startGameLoop();
      startButton.style.display = 'none';
      if (restartButton) {
        restartButton.style.display = 'inline-block';
      }
    }
  });
}

if (restartButton) {
  restartButton.addEventListener('click', () => {
    if (currentMode === GameMode.SINGLE_PLAYER && game) {
      game.start();
      startGameLoop();
    } else if (currentMode === GameMode.BATTLE && battleGame) {
      battleGame = new BattleGame();
      battleGame.start();
      startGameLoop();
    }
  });
}

console.log('✅ 遊戲初始化完成');
console.log('請選擇遊戲模式：單人模式 或 雙人對戰');
