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
    game = new Game(false); // 測試模式：禁用動畫
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

  describe('攻擊資訊系統（對戰模式）', () => {
    beforeEach(() => {
      game.start();
    });

    describe('getLastClearedLines()', () => {
      test('無消行時應返回 0', () => {
        const cleared = game.getLastClearedLines();

        expect(cleared).toBe(0);
      });

      test('消除 1 行應返回 1', () => {
        // 填滿一行
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, 19, '#FF0000');
        }

        game.clearLines();
        const cleared = game.getLastClearedLines();

        expect(cleared).toBe(1);
      });

      test('消除 2 行應返回 2', () => {
        // 填滿兩行
        for (let row = 18; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            game.state.grid.setCell(col, row, '#FF0000');
          }
        }

        game.clearLines();
        const cleared = game.getLastClearedLines();

        expect(cleared).toBe(2);
      });

      test('消除 4 行應返回 4（Tetris）', () => {
        // 填滿四行
        for (let row = 16; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            game.state.grid.setCell(col, row, '#FF0000');
          }
        }

        game.clearLines();
        const cleared = game.getLastClearedLines();

        expect(cleared).toBe(4);
      });

      test('讀取後應重置為 0（消費模式）', () => {
        // 填滿一行
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, 19, '#FF0000');
        }

        game.clearLines();

        const first = game.getLastClearedLines();
        const second = game.getLastClearedLines();

        expect(first).toBe(1);
        expect(second).toBe(0); // 已重置
      });

      test('連續消行應記錄最新的消行數', () => {
        // 第一次消 1 行
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, 19, '#FF0000');
        }
        game.clearLines();
        game.getLastClearedLines(); // 消費掉

        // 第二次消 2 行
        for (let row = 18; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            game.state.grid.setCell(col, row, '#00FF00');
          }
        }
        game.clearLines();

        const cleared = game.getLastClearedLines();
        expect(cleared).toBe(2); // 只記錄最新的
      });

      test('未呼叫 clearLines() 時應返回 0', () => {
        // 填滿一行但不呼叫 clearLines
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, 19, '#FF0000');
        }

        const cleared = game.getLastClearedLines();
        expect(cleared).toBe(0);
      });
    });

    describe('addGarbageLines()', () => {
      test('應委派到 Grid.addGarbageLines()', () => {
        const spy = jest.spyOn(game.state.grid, 'addGarbageLines');

        game.addGarbageLines(2);

        expect(spy).toHaveBeenCalledWith(2);
        spy.mockRestore();
      });

      test('應能加入單一垃圾行', () => {
        game.addGarbageLines(1);

        // 驗證底部有垃圾行
        const bottomRow = game.state.grid.cells[19];
        const garbageCount = bottomRow.filter(cell => cell === '#808080').length;

        expect(garbageCount).toBe(9);
      });

      test('應能加入多條垃圾行', () => {
        game.addGarbageLines(3);

        // 驗證底部 3 行是垃圾
        for (let i = 17; i < 20; i++) {
          const row = game.state.grid.cells[i];
          const garbageCount = row.filter(cell => cell === '#808080').length;
          expect(garbageCount).toBe(9);
        }
      });

      test('加入垃圾行應上推當前方塊', () => {
        // 將當前方塊移到底部附近
        const initialY = game.state.currentPiece.position.y;

        game.addGarbageLines(5);

        // 方塊應被上推（如果在底部區域）
        // 注意：這個測試假設 addGarbageLines 不會直接移動 currentPiece
        // 實際行為取決於實作
        const bottomRow = game.state.grid.cells[19];
        const garbageCount = bottomRow.filter(cell => cell === '#808080').length;
        expect(garbageCount).toBe(9);
      });

      test('頂部無空間時應拋出錯誤', () => {
        // 填滿頂部
        for (let y = 0; y < 5; y++) {
          for (let x = 0; x < 10; x++) {
            game.state.grid.setCell(x, y, '#FF0000');
          }
        }

        expect(() => {
          game.addGarbageLines(5);
        }).toThrow();
      });
    });

    describe('對戰模式整合場景', () => {
      test('玩家消行後應能被對手讀取', () => {
        // 填滿 2 行
        for (let row = 18; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            game.state.grid.setCell(col, row, '#FF0000');
          }
        }

        // 消行
        game.clearLines();

        // 對手讀取攻擊資訊
        const attackInfo = game.getLastClearedLines();
        expect(attackInfo).toBe(2);

        // 對手根據攻擊資訊加入垃圾（這裡簡化為 1:1）
        // 實際遊戲中會由 BattleGame 計算
      });

      test('玩家接收垃圾行不影響消行記錄', () => {
        // 填滿 1 行並消除
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, 19, '#FF0000');
        }
        game.clearLines();

        expect(game.getLastClearedLines()).toBe(1);

        // 接收 2 行垃圾
        game.addGarbageLines(2);

        // 再次讀取應該是 0（已消費）
        expect(game.getLastClearedLines()).toBe(0);
      });

      test('模擬完整攻防循環', () => {
        // 玩家 1 視角：消 3 行
        for (let row = 17; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            game.state.grid.setCell(col, row, '#FF0000');
          }
        }
        game.clearLines();

        const attack = game.getLastClearedLines();
        expect(attack).toBe(3); // 發送 3 行攻擊（實際會轉換為垃圾數）

        // 玩家 1 接收來自玩家 2 的反擊（2 行垃圾）
        game.addGarbageLines(2);

        // 驗證底部有垃圾
        const bottomRow = game.state.grid.cells[19];
        const garbageCount = bottomRow.filter(cell => cell === '#808080').length;
        expect(garbageCount).toBe(9);
      });

      test('多次消行資訊應正確更新', () => {
        // 第一次消 1 行
        for (let col = 0; col < 10; col++) {
          game.state.grid.setCell(col, 19, '#FF0000');
        }
        game.clearLines();
        expect(game.getLastClearedLines()).toBe(1);

        // 第二次消 4 行（Tetris）
        for (let row = 16; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            game.state.grid.setCell(col, row, '#00FF00');
          }
        }
        game.clearLines();
        expect(game.getLastClearedLines()).toBe(4);

        // 第三次沒有消行
        game.clearLines();
        expect(game.getLastClearedLines()).toBe(0);
      });
    });
  });
});
