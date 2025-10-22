/**
 * Tetris 遊戲主進入點
 *
 * 此檔案負責：
 * 1. 初始化遊戲
 * 2. 設置事件監聽器
 * 3. 啟動遊戲循環
 */

import { Game } from './game/Game.js';
import { Renderer } from './rendering/Renderer.js';
import { GameStatus, KEY_BINDINGS, InputCommand } from './utils/Constants.js';

console.log('俄羅斯方塊遊戲初始化中...');

// 取得 Canvas 元素
const canvas = document.getElementById('game-canvas');
if (!canvas) {
  console.error('❌ Canvas 元素未找到');
  throw new Error('Canvas element not found');
}

// 初始化遊戲和渲染器
const game = new Game();
const renderer = new Renderer(canvas);

console.log('✅ Game 和 Renderer 已初始化');

// 遊戲循環
let lastTime = 0;
let animationFrameId = null;

function gameLoop(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // 更新遊戲狀態
  game.update(deltaTime);

  // 渲染畫面
  renderer.render(game.getState());

  // 繼續循環
  if (game.isRunning) {
    animationFrameId = requestAnimationFrame(gameLoop);
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
  animationFrameId = requestAnimationFrame(gameLoop);
}

/**
 * 處理鍵盤輸入
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  // 阻止方向鍵和空白鍵的預設行為
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
    event.preventDefault();
  }

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

// 設置鍵盤事件監聽
document.addEventListener('keydown', handleKeyDown);

// 開始按鈕
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

if (startButton) {
  startButton.addEventListener('click', () => {
    game.start();
    startGameLoop();
    startButton.style.display = 'none';
    if (restartButton) {
      restartButton.style.display = 'inline-block';
    }
  });
}

if (restartButton) {
  restartButton.addEventListener('click', () => {
    game.start();
    startGameLoop();
  });
}

// 初始渲染
renderer.render(game.getState());

console.log('✅ 遊戲初始化完成');
console.log('提示：按 空白鍵 或點擊「開始遊戲」按鈕開始遊戲');
console.log('操作：← → 移動，↑/W 旋轉，↓/S 加速下落，P 暫停');
