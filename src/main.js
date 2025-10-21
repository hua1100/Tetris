/**
 * Tetris 遊戲主進入點
 *
 * 此檔案負責：
 * 1. 初始化遊戲
 * 2. 設置事件監聽器
 * 3. 啟動遊戲循環
 */

// TODO: 在 Phase 3 (US1) 實作完成後，將引入以下模組：
// import { Game } from './game/Game.js';
// import { Logger } from './game/Logger.js';

console.log('俄羅斯方塊遊戲初始化中...');
console.log('專案結構已建立，準備開始 TDD 開發');

// 取得 Canvas 元素
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// 取得 UI 元素
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// 驗證 Canvas 設置
if (canvas && ctx) {
  console.log('✅ Canvas 已成功初始化');
  console.log(`Canvas 尺寸: ${canvas.width}x${canvas.height}`);

  // 繪製測試網格（驗證渲染功能）
  drawTestGrid(ctx, canvas.width, canvas.height);
} else {
  console.error('❌ Canvas 初始化失敗');
}

// 開始按鈕事件（暫時）
startButton.addEventListener('click', () => {
  console.log('開始遊戲按鈕已點擊');
  console.log('提示：Game 類別將在 Phase 3 (US1) 實作');
  startButton.style.display = 'none';
  restartButton.style.display = 'inline-block';

  // TODO: 在 Phase 3 實作後，替換為實際遊戲啟動邏輯
  // game.start();
});

// 重新開始按鈕事件（暫時）
restartButton.addEventListener('click', () => {
  console.log('重新開始按鈕已點擊');
  location.reload();
});

/**
 * 繪製測試網格（驗證 Canvas 渲染功能）
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {number} width - Canvas 寬度
 * @param {number} height - Canvas 高度
 */
function drawTestGrid(ctx, width, height) {
  const blockSize = 30; // 每個方塊 30x30 像素
  const cols = width / blockSize;  // 10 欄
  const rows = height / blockSize; // 20 列

  // 清空畫布
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // 繪製網格線
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      ctx.strokeRect(
        col * blockSize,
        row * blockSize,
        blockSize,
        blockSize
      );
    }
  }

  // 在中央繪製測試方塊（模擬 I 型方塊）
  ctx.fillStyle = '#00FFFF'; // 青色
  const centerCol = Math.floor(cols / 2) - 2;

  for (let i = 0; i < 4; i++) {
    ctx.fillRect(
      (centerCol + i) * blockSize + 1,
      blockSize + 1,
      blockSize - 2,
      blockSize - 2
    );
  }

  console.log('✅ 測試網格已繪製（10x20 網格 + I 型方塊）');
}

console.log('✅ Phase 1 (Setup) 完成');
console.log('下一步：Phase 2 (Foundational) - 建立 Constants.js 和 Logger.js');
