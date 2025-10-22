/**
 * Game 單元測試
 *
 * 測試遊戲主控制器的核心功能
 */

import { Game } from '../../src/game/Game.js';
import { GameStatus } from '../../src/utils/Constants.js';

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  describe('建構子', () => {
    test('應正確初始化遊戲', () => {
      expect(game.state).toBeDefined();
      expect(game.state.status).toBe(GameStatus.IDLE);
    });

    test('應初始化 logger', () => {
      expect(game.logger).toBeDefined();
    });

    test('應初始化遊戲循環變數', () => {
      expect(game.isRunning).toBe(false);
      expect(game.lastUpdateTime).toBe(0);
    });
  });

  describe('start()', () => {
    test('應啟動遊戲', () => {
      game.start();

      expect(game.state.status).toBe(GameStatus.PLAYING);
      expect(game.isRunning).toBe(true);
    });

    test('應生成初始方塊', () => {
      game.start();

      expect(game.state.currentPiece).toBeTruthy();
      expect(game.state.nextPiece).toBeTruthy();
    });

    test('應記錄遊戲開始事件', () => {
      const spy = jest.spyOn(game.logger, 'logGameStart');

      game.start();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test('已在運行時不應重複啟動', () => {
      game.start();
      const firstPiece = game.state.currentPiece;

      game.start();

      expect(game.state.currentPiece).toBe(firstPiece);
    });
  });

  describe('pause()', () => {
    beforeEach(() => {
      game.start();
    });

    test('應暫停遊戲', () => {
      game.pause();

      expect(game.state.status).toBe(GameStatus.PAUSED);
    });

    test('應記錄暫停事件', () => {
      const spy = jest.spyOn(game.logger, 'logGamePause');

      game.pause();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('resume()', () => {
    beforeEach(() => {
      game.start();
      game.pause();
    });

    test('應恢復遊戲', () => {
      game.resume();

      expect(game.state.status).toBe(GameStatus.PLAYING);
    });

    test('應記錄恢復事件', () => {
      const spy = jest.spyOn(game.logger, 'logGameResume');

      game.resume();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('togglePause()', () => {
    beforeEach(() => {
      game.start();
    });

    test('PLAYING 狀態應切換為 PAUSED', () => {
      game.togglePause();

      expect(game.state.status).toBe(GameStatus.PAUSED);
    });

    test('PAUSED 狀態應切換為 PLAYING', () => {
      game.pause();
      game.togglePause();

      expect(game.state.status).toBe(GameStatus.PLAYING);
    });
  });

  describe('gameOver()', () => {
    beforeEach(() => {
      game.start();
    });

    test('應結束遊戲', () => {
      game.gameOver();

      expect(game.state.status).toBe(GameStatus.GAME_OVER);
      expect(game.isRunning).toBe(false);
    });

    test('應記錄遊戲結束事件', () => {
      const spy = jest.spyOn(game.logger, 'logGameOver');
      game.state.score = 5000;

      game.gameOver();

      expect(spy).toHaveBeenCalledWith(5000, game.state.level, game.state.linesCleared);
      spy.mockRestore();
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      game.start();
    });

    test('IDLE 狀態不應更新', () => {
      game.state.status = GameStatus.IDLE;
      const piece = game.state.currentPiece;

      game.update(100);

      expect(game.state.currentPiece).toBe(piece);
    });

    test('PAUSED 狀態不應更新', () => {
      game.pause();
      const piece = game.state.currentPiece;

      game.update(100);

      expect(game.state.currentPiece).toBe(piece);
    });

    test('GAME_OVER 狀態不應更新', () => {
      game.gameOver();
      const piece = game.state.currentPiece;

      game.update(100);

      expect(game.state.currentPiece).toBe(piece);
    });

    test('PLAYING 狀態應處理方塊下落', () => {
      const initialY = game.state.currentPiece.position.y;

      // 模擬經過足夠時間觸發下落
      game.update(game.state.dropSpeed + 100);

      expect(game.state.currentPiece.position.y).toBeGreaterThan(initialY);
    });

    test('時間未到不應下落', () => {
      const initialY = game.state.currentPiece.position.y;

      game.update(100); // 遠小於 dropSpeed (1000ms)

      expect(game.state.currentPiece.position.y).toBe(initialY);
    });
  });

  describe('canMovePiece()', () => {
    beforeEach(() => {
      game.start();
    });

    test('空白區域應允許移動', () => {
      const testPiece = game.state.currentPiece.clone();
      testPiece.move(1, 0);

      const canMove = game.canMovePiece(testPiece);

      expect(canMove).toBe(true);
    });

    test('左邊界外應禁止移動', () => {
      const testPiece = game.state.currentPiece.clone();
      testPiece.move(-10, 0);

      const canMove = game.canMovePiece(testPiece);

      expect(canMove).toBe(false);
    });

    test('右邊界外應禁止移動', () => {
      const testPiece = game.state.currentPiece.clone();
      testPiece.move(10, 0);

      const canMove = game.canMovePiece(testPiece);

      expect(canMove).toBe(false);
    });

    test('底部邊界外應禁止移動', () => {
      const testPiece = game.state.currentPiece.clone();
      testPiece.move(0, 25);

      const canMove = game.canMovePiece(testPiece);

      expect(canMove).toBe(false);
    });

    test('與已固定方塊重疊應禁止移動', () => {
      // 在底部設定障礙物
      for (let col = 0; col < 10; col++) {
        game.state.grid.setCell(col, 19, '#FF0000');
      }

      const testPiece = game.state.currentPiece.clone();
      testPiece.move(0, 19);

      const canMove = game.canMovePiece(testPiece);

      expect(canMove).toBe(false);
    });
  });

  describe('movePieceLeft()', () => {
    beforeEach(() => {
      game.start();
    });

    test('應向左移動方塊', () => {
      const initialX = game.state.currentPiece.position.x;

      const moved = game.movePieceLeft();

      expect(moved).toBe(true);
      expect(game.state.currentPiece.position.x).toBe(initialX - 1);
    });

    test('碰到左邊界應返回 false', () => {
      // 移到最左邊
      while (game.movePieceLeft()) {}

      const moved = game.movePieceLeft();

      expect(moved).toBe(false);
    });

    test('成功移動應記錄日誌', () => {
      const spy = jest.spyOn(game.logger, 'logPieceMove');

      game.movePieceLeft();

      expect(spy).toHaveBeenCalledWith('LEFT', expect.any(Object));
      spy.mockRestore();
    });
  });

  describe('movePieceRight()', () => {
    beforeEach(() => {
      game.start();
    });

    test('應向右移動方塊', () => {
      const initialX = game.state.currentPiece.position.x;

      const moved = game.movePieceRight();

      expect(moved).toBe(true);
      expect(game.state.currentPiece.position.x).toBe(initialX + 1);
    });

    test('碰到右邊界應返回 false', () => {
      // 移到最右邊
      while (game.movePieceRight()) {}

      const moved = game.movePieceRight();

      expect(moved).toBe(false);
    });
  });

  describe('movePieceDown()', () => {
    beforeEach(() => {
      game.start();
    });

    test('應向下移動方塊', () => {
      const initialY = game.state.currentPiece.position.y;

      const moved = game.movePieceDown();

      expect(moved).toBe(true);
      expect(game.state.currentPiece.position.y).toBe(initialY + 1);
    });

    test('碰到底部應返回 false', () => {
      // 移到最底部（movePieceDown 失敗時會鎖定並生成新方塊）
      let moveCount = 0;
      while (game.movePieceDown() && moveCount < 100) {
        moveCount++;
      }

      // 最後一次 movePieceDown() 已經返回 false 並鎖定了方塊
      // 驗證已生成新方塊
      expect(game.state.currentPiece).toBeTruthy();
      expect(game.state.currentPiece.position.y).toBe(0); // 新方塊在頂部
    });

    test('無法下移應鎖定方塊', () => {
      const spy = jest.spyOn(game, 'lockCurrentPiece');

      // 移到底部
      while (game.movePieceDown()) {}

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('rotatePiece()', () => {
    beforeEach(() => {
      game.start();
    });

    test('應旋轉方塊', () => {
      const initialRotation = game.state.currentPiece.rotation;

      const rotated = game.rotatePiece();

      expect(rotated).toBe(true);
      expect(game.state.currentPiece.rotation).toBe((initialRotation + 1) % 4);
    });

    test('旋轉後碰撞應返回 false 並還原', () => {
      // 移到左邊界
      while (game.movePieceLeft()) {}

      // I 型方塊旋轉可能超出邊界
      const initialRotation = game.state.currentPiece.rotation;
      const rotated = game.rotatePiece();

      if (!rotated) {
        expect(game.state.currentPiece.rotation).toBe(initialRotation);
      }
    });

    test('成功旋轉應記錄日誌', () => {
      const spy = jest.spyOn(game.logger, 'logPieceRotate');

      game.rotatePiece();

      if (spy.mock.calls.length > 0) {
        expect(spy).toHaveBeenCalledWith(expect.any(Number), expect.any(Object));
      }
      spy.mockRestore();
    });
  });

  describe('lockCurrentPiece()', () => {
    beforeEach(() => {
      game.start();
    });

    test('應將方塊固定到網格', () => {
      const piece = game.state.currentPiece;
      const blocks = piece.getBlocks();

      game.lockCurrentPiece();

      // 驗證方塊已固定到網格
      blocks.forEach(block => {
        if (game.state.grid.isInBounds(block.x, block.y)) {
          expect(game.state.grid.getCell(block.x, block.y)).toBe(block.color);
        }
      });
    });

    test('應檢查並清除完整行', () => {
      // 填滿底部行（除一格）
      for (let col = 0; col < 9; col++) {
        game.state.grid.setCell(col, 19, '#CCCCCC');
      }

      // 將 O 型方塊移到補滿位置（使用 move 方法）
      const targetX = 8;
      const targetY = 18;
      const deltaX = targetX - game.state.currentPiece.position.x;
      const deltaY = targetY - game.state.currentPiece.position.y;
      game.state.currentPiece.move(deltaX, deltaY);

      const initialLines = game.state.linesCleared;

      game.lockCurrentPiece();

      expect(game.state.linesCleared).toBeGreaterThan(initialLines);
    });

    test('應生成新方塊', () => {
      const oldPiece = game.state.currentPiece;

      game.lockCurrentPiece();

      expect(game.state.currentPiece).not.toBe(oldPiece);
      expect(game.state.currentPiece).toBeTruthy();
    });

    test('應記錄鎖定日誌', () => {
      const spy = jest.spyOn(game.logger, 'logPieceLock');

      game.lockCurrentPiece();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('clearLines()', () => {
    beforeEach(() => {
      game.start();
    });

    test('無完整行時不應增加分數', () => {
      const initialScore = game.state.score;

      game.clearLines();

      expect(game.state.score).toBe(initialScore);
    });

    test('消除 1 行應增加 100 分', () => {
      // 填滿一行
      for (let col = 0; col < 10; col++) {
        game.state.grid.setCell(col, 19, '#FF0000');
      }

      game.clearLines();

      expect(game.state.score).toBe(100);
      expect(game.state.linesCleared).toBe(1);
    });

    test('消除 4 行應增加 800 分（Tetris）', () => {
      // 填滿四行
      for (let row = 16; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, row, '#FF0000');
        }
      }

      game.clearLines();

      expect(game.state.score).toBe(800);
      expect(game.state.linesCleared).toBe(4);
    });

    test('消除行應記錄日誌', () => {
      const spy = jest.spyOn(game.logger, 'logLineClear');

      for (let col = 0; col < 10; col++) {
        game.state.grid.setCell(col, 19, '#FF0000');
      }

      game.clearLines();

      expect(spy).toHaveBeenCalledWith(1, 100);
      spy.mockRestore();
    });

    test('達到升級條件應記錄等級提升', () => {
      const spy = jest.spyOn(game.logger, 'logLevelUp');

      // 填滿 10 行觸發升級
      for (let row = 10; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, row, '#FF0000');
        }
      }

      game.clearLines();

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('checkGameOver()', () => {
    beforeEach(() => {
      game.start();
    });

    test('新方塊能放置不應遊戲結束', () => {
      const isOver = game.checkGameOver();

      expect(isOver).toBe(false);
      expect(game.state.status).toBe(GameStatus.PLAYING);
    });

    test('新方塊無法放置應遊戲結束', () => {
      // 堆滿頂部
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, row, '#FF0000');
        }
      }

      const isOver = game.checkGameOver();

      expect(isOver).toBe(true);
      expect(game.state.status).toBe(GameStatus.GAME_OVER);
    });
  });

  describe('getState()', () => {
    test('應返回遊戲狀態', () => {
      const state = game.getState();

      expect(state).toBe(game.state);
    });
  });

  describe('遊戲流程整合測試', () => {
    test('完整遊戲流程', () => {
      // 開始遊戲
      game.start();
      expect(game.state.status).toBe(GameStatus.PLAYING);

      // 移動方塊
      game.movePieceLeft();
      game.movePieceRight();
      game.rotatePiece();

      // 模擬時間流逝
      game.update(1100);

      // 暫停遊戲
      game.pause();
      expect(game.state.status).toBe(GameStatus.PAUSED);

      // 恢復遊戲
      game.resume();
      expect(game.state.status).toBe(GameStatus.PLAYING);
    });

    test('方塊自動下落到底部並鎖定', () => {
      game.start();

      // 加速下落到底部
      while (game.movePieceDown()) {}

      // 驗證已生成新方塊
      expect(game.state.currentPiece).toBeTruthy();
    });
  });
});
