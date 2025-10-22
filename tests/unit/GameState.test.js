/**
 * GameState 單元測試
 *
 * 測試遊戲整體狀態管理（分數、等級、狀態轉換等）
 */

import { GameState } from '../../src/models/GameState.js';
import { Grid } from '../../src/models/Grid.js';
import { Tetromino } from '../../src/models/Tetromino.js';
import { GameStatus, TetrominoType } from '../../src/utils/Constants.js';

describe('GameState', () => {
  describe('建構子', () => {
    test('應使用 IDLE 狀態初始化', () => {
      const state = new GameState();

      expect(state.status).toBe(GameStatus.IDLE);
    });

    test('應初始化分數為 0', () => {
      const state = new GameState();

      expect(state.score).toBe(0);
    });

    test('應初始化等級為 1', () => {
      const state = new GameState();

      expect(state.level).toBe(1);
    });

    test('應初始化消除行數為 0', () => {
      const state = new GameState();

      expect(state.linesCleared).toBe(0);
    });

    test('應初始化 currentPiece 為 null', () => {
      const state = new GameState();

      expect(state.currentPiece).toBeNull();
    });

    test('應初始化 nextPiece 為 null', () => {
      const state = new GameState();

      expect(state.nextPiece).toBeNull();
    });

    test('應建立 10x20 的 Grid', () => {
      const state = new GameState();

      expect(state.grid).toBeInstanceOf(Grid);
      expect(state.grid.width).toBe(10);
      expect(state.grid.height).toBe(20);
    });

    test('應初始化下落速度為 800ms', () => {
      const state = new GameState();

      expect(state.dropSpeed).toBe(800);
    });

    test('應初始化 lastDropTime 為 0', () => {
      const state = new GameState();

      expect(state.lastDropTime).toBe(0);
    });
  });

  describe('start()', () => {
    test('應將狀態設為 PLAYING', () => {
      const state = new GameState();

      state.start();

      expect(state.status).toBe(GameStatus.PLAYING);
    });

    test('應重置分數為 0', () => {
      const state = new GameState();
      state.score = 5000;

      state.start();

      expect(state.score).toBe(0);
    });

    test('應重置等級為 1', () => {
      const state = new GameState();
      state.level = 10;

      state.start();

      expect(state.level).toBe(1);
    });

    test('應重置消除行數為 0', () => {
      const state = new GameState();
      state.linesCleared = 50;

      state.start();

      expect(state.linesCleared).toBe(0);
    });

    test('應清空網格', () => {
      const state = new GameState();
      state.grid.setCell(5, 10, '#FF0000');

      state.start();

      expect(state.grid.getCell(5, 10)).toBeNull();
    });

    test('應生成新方塊', () => {
      const state = new GameState();

      state.start();

      expect(state.currentPiece).toBeInstanceOf(Tetromino);
      expect(state.nextPiece).toBeInstanceOf(Tetromino);
    });

    test('應設定 lastDropTime', () => {
      const state = new GameState();
      const before = Date.now();

      state.start();

      const after = Date.now();
      expect(state.lastDropTime).toBeGreaterThanOrEqual(before);
      expect(state.lastDropTime).toBeLessThanOrEqual(after);
    });

    test('應可重新開始已結束的遊戲', () => {
      const state = new GameState();
      state.status = GameStatus.GAME_OVER;
      state.score = 10000;

      state.start();

      expect(state.status).toBe(GameStatus.PLAYING);
      expect(state.score).toBe(0);
    });
  });

  describe('togglePause()', () => {
    test('PLAYING 狀態應切換為 PAUSED', () => {
      const state = new GameState();
      state.status = GameStatus.PLAYING;

      state.togglePause();

      expect(state.status).toBe(GameStatus.PAUSED);
    });

    test('PAUSED 狀態應切換為 PLAYING', () => {
      const state = new GameState();
      state.status = GameStatus.PAUSED;

      state.togglePause();

      expect(state.status).toBe(GameStatus.PLAYING);
    });

    test('從暫停恢復應重設 lastDropTime', () => {
      const state = new GameState();
      state.status = GameStatus.PAUSED;
      const before = Date.now();

      state.togglePause();

      const after = Date.now();
      expect(state.lastDropTime).toBeGreaterThanOrEqual(before);
      expect(state.lastDropTime).toBeLessThanOrEqual(after);
    });

    test('IDLE 狀態不應受影響', () => {
      const state = new GameState();
      state.status = GameStatus.IDLE;

      state.togglePause();

      expect(state.status).toBe(GameStatus.IDLE);
    });

    test('GAME_OVER 狀態不應受影響', () => {
      const state = new GameState();
      state.status = GameStatus.GAME_OVER;

      state.togglePause();

      expect(state.status).toBe(GameStatus.GAME_OVER);
    });

    test('連續切換應正確交替', () => {
      const state = new GameState();
      state.status = GameStatus.PLAYING;

      state.togglePause(); // PLAYING → PAUSED
      expect(state.status).toBe(GameStatus.PAUSED);

      state.togglePause(); // PAUSED → PLAYING
      expect(state.status).toBe(GameStatus.PLAYING);

      state.togglePause(); // PLAYING → PAUSED
      expect(state.status).toBe(GameStatus.PAUSED);
    });
  });

  describe('gameOver()', () => {
    test('應將狀態設為 GAME_OVER', () => {
      const state = new GameState();
      state.status = GameStatus.PLAYING;

      state.gameOver();

      expect(state.status).toBe(GameStatus.GAME_OVER);
    });

    test('應保留最終分數', () => {
      const state = new GameState();
      state.score = 15000;

      state.gameOver();

      expect(state.score).toBe(15000);
    });

    test('應保留最終等級', () => {
      const state = new GameState();
      state.level = 8;

      state.gameOver();

      expect(state.level).toBe(8);
    });

    test('應保留消除行數', () => {
      const state = new GameState();
      state.linesCleared = 75;

      state.gameOver();

      expect(state.linesCleared).toBe(75);
    });
  });

  describe('spawnNewPiece()', () => {
    test('應將 nextPiece 移至 currentPiece', () => {
      const state = new GameState();
      const mockNext = new Tetromino(TetrominoType.I);
      state.nextPiece = mockNext;

      state.spawnNewPiece();

      expect(state.currentPiece).toBe(mockNext);
    });

    test('應生成新的 nextPiece', () => {
      const state = new GameState();
      state.nextPiece = new Tetromino(TetrominoType.O);

      state.spawnNewPiece();

      expect(state.nextPiece).toBeInstanceOf(Tetromino);
      expect(state.nextPiece).not.toBe(state.currentPiece);
    });

    test('首次生成應建立 currentPiece 和 nextPiece', () => {
      const state = new GameState();

      state.spawnNewPiece();

      expect(state.currentPiece).toBeInstanceOf(Tetromino);
      expect(state.nextPiece).toBeInstanceOf(Tetromino);
    });

    test('連續生成應正確輪替', () => {
      const state = new GameState();

      state.spawnNewPiece();
      const first = state.currentPiece;
      const second = state.nextPiece;

      state.spawnNewPiece();

      expect(state.currentPiece).toBe(second);
      expect(state.nextPiece).not.toBe(first);
      expect(state.nextPiece).not.toBe(second);
    });
  });

  describe('createRandomPiece()', () => {
    test('應返回 Tetromino 實例', () => {
      const state = new GameState();

      const piece = state.createRandomPiece();

      expect(piece).toBeInstanceOf(Tetromino);
    });

    test('應隨機生成七種方塊之一', () => {
      const state = new GameState();
      const types = new Set();

      // 生成多個方塊，收集類型
      for (let i = 0; i < 50; i++) {
        const piece = state.createRandomPiece();
        types.add(piece.type);
      }

      // 應涵蓋多種類型（隨機性測試）
      expect(types.size).toBeGreaterThan(1);
    });

    test('每次生成應為新實例', () => {
      const state = new GameState();

      const piece1 = state.createRandomPiece();
      const piece2 = state.createRandomPiece();

      expect(piece1).not.toBe(piece2);
    });

    test('生成的方塊應有有效類型', () => {
      const state = new GameState();
      const validTypes = Object.values(TetrominoType);

      for (let i = 0; i < 20; i++) {
        const piece = state.createRandomPiece();
        expect(validTypes).toContain(piece.type);
      }
    });

    test('應有機率生成所有七種方塊', () => {
      const state = new GameState();
      const types = new Set();

      // 生成足夠多次以覆蓋所有類型
      for (let i = 0; i < 200; i++) {
        const piece = state.createRandomPiece();
        types.add(piece.type);
      }

      // 高機率應生成所有 7 種
      expect(types.size).toBeGreaterThanOrEqual(5); // 至少 5 種（避免隨機失敗）
    });
  });

  describe('addScore()', () => {
    test('應正確增加分數', () => {
      const state = new GameState();

      state.addScore(100);

      expect(state.score).toBe(100);
    });

    test('應累加分數', () => {
      const state = new GameState();

      state.addScore(100);
      state.addScore(300);
      state.addScore(500);

      expect(state.score).toBe(900);
    });

    test('應允許增加大額分數', () => {
      const state = new GameState();

      state.addScore(10000);

      expect(state.score).toBe(10000);
    });

    test('應允許增加零分', () => {
      const state = new GameState();
      state.score = 500;

      state.addScore(0);

      expect(state.score).toBe(500);
    });

    test('已有分數時應正確累加', () => {
      const state = new GameState();
      state.score = 2000;

      state.addScore(800);

      expect(state.score).toBe(2800);
    });
  });

  describe('addClearedLines()', () => {
    test('應增加消除行數', () => {
      const state = new GameState();

      state.addClearedLines(4);

      expect(state.linesCleared).toBe(4);
    });

    test('應累加消除行數', () => {
      const state = new GameState();

      state.addClearedLines(1);
      state.addClearedLines(2);
      state.addClearedLines(4);

      expect(state.linesCleared).toBe(7);
    });

    test('應觸發等級更新', () => {
      const state = new GameState();

      state.addClearedLines(10); // 達到升級條件

      expect(state.level).toBe(2);
    });

    test('消除 1-7 行不應升級', () => {
      const state = new GameState();

      state.addClearedLines(7);

      expect(state.level).toBe(1);
    });

    test('消除 8 行應升至 2 級', () => {
      const state = new GameState();

      state.addClearedLines(8);

      expect(state.level).toBe(2);
    });

    test('消除 16 行應升至 3 級', () => {
      const state = new GameState();

      state.addClearedLines(16);

      expect(state.level).toBe(3);
    });

    test('逐步消除應正確升級', () => {
      const state = new GameState();

      state.addClearedLines(4);  // 總計 4
      expect(state.level).toBe(1);

      state.addClearedLines(4);  // 總計 8
      expect(state.level).toBe(2);

      state.addClearedLines(8); // 總計 16
      expect(state.level).toBe(3);
    });
  });

  describe('updateLevel()', () => {
    test('0-7 行應為 1 級', () => {
      const state = new GameState();
      state.linesCleared = 7;

      state.updateLevel();

      expect(state.level).toBe(1);
    });

    test('8-15 行應為 2 級', () => {
      const state = new GameState();
      state.linesCleared = 12;

      state.updateLevel();

      expect(state.level).toBe(2);
    });

    test('16-23 行應為 3 級', () => {
      const state = new GameState();
      state.linesCleared = 20;

      state.updateLevel();

      expect(state.level).toBe(3);
    });

    test('100 行應為 13 級', () => {
      const state = new GameState();
      state.linesCleared = 100;

      state.updateLevel();

      expect(state.level).toBe(13);
    });

    test('等級提升應更新下落速度', () => {
      const state = new GameState();
      state.linesCleared = 8; // 新配置：每 8 行升級
      const oldSpeed = state.dropSpeed;

      state.updateLevel();

      expect(state.level).toBe(2);
      expect(state.dropSpeed).toBeLessThan(oldSpeed);
    });

    test('等級不變時不應更新速度', () => {
      const state = new GameState();
      state.level = 6;
      state.linesCleared = 44; // 新配置：44/8 = 5.5，向下取整 5，加 1 = 6
      state.dropSpeed = 800 * Math.pow(0.85, 5); // 6 級速度
      const oldSpeed = state.dropSpeed;

      state.updateLevel();

      expect(state.level).toBe(6);
      expect(state.dropSpeed).toBe(oldSpeed);
    });
  });

  describe('updateDropSpeed()', () => {
    test('1 級速度應為 800ms', () => {
      const state = new GameState();
      state.level = 1;

      state.updateDropSpeed();

      expect(state.dropSpeed).toBe(800);
    });

    test('2 級速度應為 800 * 0.85 = 680ms', () => {
      const state = new GameState();
      state.level = 2;

      state.updateDropSpeed();

      expect(state.dropSpeed).toBe(680);
    });

    test('3 級速度應為 800 * 0.85^2 = 578ms', () => {
      const state = new GameState();
      state.level = 3;

      state.updateDropSpeed();

      expect(state.dropSpeed).toBeCloseTo(578, 0);
    });

    test('每級遞減 15%', () => {
      const state = new GameState();

      for (let level = 1; level <= 5; level++) {
        state.level = level;
        state.updateDropSpeed();

        const expected = 800 * Math.pow(0.85, level - 1);
        expect(state.dropSpeed).toBeCloseTo(expected, 0);
      }
    });

    test('速度應有下限 100ms', () => {
      const state = new GameState();
      state.level = 100; // 極高等級

      state.updateDropSpeed();

      expect(state.dropSpeed).toBeGreaterThanOrEqual(100);
    });

    test('高等級應達到最低速度 100ms', () => {
      const state = new GameState();
      state.level = 50;

      state.updateDropSpeed();

      expect(state.dropSpeed).toBe(100);
    });

    test('10 級速度應約為 196ms', () => {
      const state = new GameState();
      state.level = 10;

      state.updateDropSpeed();

      const expected = 800 * Math.pow(0.85, 9);
      expect(state.dropSpeed).toBeCloseTo(expected, 0);
    });
  });

  describe('getSnapshot()', () => {
    test('應返回包含狀態的物件', () => {
      const state = new GameState();
      const snapshot = state.getSnapshot();

      expect(typeof snapshot).toBe('object');
      expect(snapshot).toHaveProperty('status');
      expect(snapshot).toHaveProperty('score');
      expect(snapshot).toHaveProperty('level');
      expect(snapshot).toHaveProperty('linesCleared');
      expect(snapshot).toHaveProperty('dropSpeed');
    });

    test('應正確反映當前狀態', () => {
      const state = new GameState();
      state.status = GameStatus.PLAYING;
      state.score = 5000;
      state.level = 3;
      state.linesCleared = 25;
      state.dropSpeed = 810;

      const snapshot = state.getSnapshot();

      expect(snapshot.status).toBe(GameStatus.PLAYING);
      expect(snapshot.score).toBe(5000);
      expect(snapshot.level).toBe(3);
      expect(snapshot.linesCleared).toBe(25);
      expect(snapshot.dropSpeed).toBe(810);
    });

    test('應返回新物件（非引用）', () => {
      const state = new GameState();
      const snapshot1 = state.getSnapshot();
      const snapshot2 = state.getSnapshot();

      expect(snapshot1).not.toBe(snapshot2);
    });

    test('修改快照不應影響狀態', () => {
      const state = new GameState();
      state.score = 1000;
      const snapshot = state.getSnapshot();

      snapshot.score = 9999;

      expect(state.score).toBe(1000);
    });

    test('應可用於日誌記錄', () => {
      const state = new GameState();
      state.status = GameStatus.PLAYING;
      state.score = 2000;

      const snapshot = state.getSnapshot();
      const json = JSON.stringify(snapshot);

      expect(json).toContain('"score":2000');
      expect(json).toContain('"status":"PLAYING"');
    });
  });

  describe('狀態轉換', () => {
    test('完整遊戲流程：IDLE → PLAYING → PAUSED → PLAYING → GAME_OVER', () => {
      const state = new GameState();

      expect(state.status).toBe(GameStatus.IDLE);

      state.start();
      expect(state.status).toBe(GameStatus.PLAYING);

      state.togglePause();
      expect(state.status).toBe(GameStatus.PAUSED);

      state.togglePause();
      expect(state.status).toBe(GameStatus.PLAYING);

      state.gameOver();
      expect(state.status).toBe(GameStatus.GAME_OVER);
    });

    test('重新開始流程：GAME_OVER → PLAYING', () => {
      const state = new GameState();
      state.status = GameStatus.GAME_OVER;
      state.score = 10000;

      state.start();

      expect(state.status).toBe(GameStatus.PLAYING);
      expect(state.score).toBe(0);
    });
  });

  describe('實際使用場景', () => {
    test('模擬遊戲開始到升級', () => {
      const state = new GameState();

      state.start();
      expect(state.status).toBe(GameStatus.PLAYING);
      expect(state.currentPiece).toBeTruthy();

      // 消除 8 行（新配置：每 8 行升級）
      state.addClearedLines(8);
      state.addScore(1000);

      expect(state.level).toBe(2);
      expect(state.score).toBe(1000);
      expect(state.dropSpeed).toBe(680); // 800 * 0.85
    });

    test('模擬快速升級到高等級', () => {
      const state = new GameState();
      state.start();

      // 快速消除 100 行
      state.addClearedLines(100);

      expect(state.level).toBe(13); // 100/8 = 12.5, floor(12.5) = 12, 12 + 1 = 13
      expect(state.linesCleared).toBe(100);
      expect(state.dropSpeed).toBeLessThan(500);
    });

    test('模擬暫停與恢復', () => {
      const state = new GameState();
      state.start();

      const timeBefore = state.lastDropTime;

      // 模擬一段時間後暫停
      state.togglePause();
      expect(state.status).toBe(GameStatus.PAUSED);

      // 恢復遊戲
      state.togglePause();
      expect(state.status).toBe(GameStatus.PLAYING);
      expect(state.lastDropTime).toBeGreaterThanOrEqual(timeBefore);
    });

    test('模擬遊戲結束並查看最終成績', () => {
      const state = new GameState();
      state.start();

      state.addScore(15000);
      state.addClearedLines(75);

      state.gameOver();

      const snapshot = state.getSnapshot();
      expect(snapshot.status).toBe(GameStatus.GAME_OVER);
      expect(snapshot.score).toBe(15000);
      expect(snapshot.level).toBe(10); // 75 / 8 = 9.375, floor(9.375) + 1 = 10
    });

    test('模擬方塊生成週期', () => {
      const state = new GameState();

      state.spawnNewPiece();
      const piece1 = state.currentPiece;
      const piece2 = state.nextPiece;

      state.spawnNewPiece();
      expect(state.currentPiece).toBe(piece2);
      expect(state.nextPiece).not.toBe(piece1);
      expect(state.nextPiece).not.toBe(piece2);

      state.spawnNewPiece();
      expect(state.currentPiece).toBeTruthy();
      expect(state.nextPiece).toBeTruthy();
    });

    test('模擬計分系統', () => {
      const state = new GameState();
      state.start();

      // 單行消除
      state.addScore(100);
      state.addClearedLines(1);

      // 雙行消除
      state.addScore(300);
      state.addClearedLines(2);

      // 四連消
      state.addScore(800);
      state.addClearedLines(4);

      expect(state.score).toBe(1200);
      expect(state.linesCleared).toBe(7);
    });

    test('模擬等級與速度的關係', () => {
      const state = new GameState();
      state.start();

      const speeds = [];

      for (let i = 1; i <= 10; i++) {
        state.linesCleared = (i - 1) * 10;
        state.updateLevel();
        speeds.push(state.dropSpeed);
      }

      // 速度應遞減
      for (let i = 1; i < speeds.length; i++) {
        expect(speeds[i]).toBeLessThan(speeds[i - 1]);
      }
    });
  });

  describe('邊界條件', () => {
    test('應處理極高分數', () => {
      const state = new GameState();

      state.addScore(Number.MAX_SAFE_INTEGER);

      expect(state.score).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('應處理極高等級', () => {
      const state = new GameState();
      state.linesCleared = 1000;

      state.updateLevel();

      expect(state.level).toBe(126); // 1000 / 8 = 125, 125 + 1 = 126
      expect(state.dropSpeed).toBe(100); // 最低速度
    });

    test('應處理零行消除', () => {
      const state = new GameState();

      state.addClearedLines(0);

      expect(state.linesCleared).toBe(0);
      expect(state.level).toBe(1);
    });

    test('連續多次 start() 應重置狀態', () => {
      const state = new GameState();

      state.start();
      state.addScore(5000);
      state.addClearedLines(25);

      state.start();

      expect(state.score).toBe(0);
      expect(state.linesCleared).toBe(0);
      expect(state.level).toBe(1);
    });

    test('IDLE 狀態下 gameOver() 應改變狀態', () => {
      const state = new GameState();
      expect(state.status).toBe(GameStatus.IDLE);

      state.gameOver();

      expect(state.status).toBe(GameStatus.GAME_OVER);
    });
  });

  describe('型別安全', () => {
    test('應為 GameState 類別的實例', () => {
      const state = new GameState();

      expect(state).toBeInstanceOf(GameState);
    });

    test('grid 應為 Grid 實例', () => {
      const state = new GameState();

      expect(state.grid).toBeInstanceOf(Grid);
    });

    test('currentPiece 應為 Tetromino 或 null', () => {
      const state = new GameState();

      expect(state.currentPiece === null || state.currentPiece instanceof Tetromino).toBe(true);

      state.spawnNewPiece();

      expect(state.currentPiece).toBeInstanceOf(Tetromino);
    });

    test('nextPiece 應為 Tetromino 或 null', () => {
      const state = new GameState();

      expect(state.nextPiece === null || state.nextPiece instanceof Tetromino).toBe(true);

      state.spawnNewPiece();

      expect(state.nextPiece).toBeInstanceOf(Tetromino);
    });

    test('status 應為 GameStatus 枚舉值', () => {
      const state = new GameState();
      const validStatuses = Object.values(GameStatus);

      expect(validStatuses).toContain(state.status);

      state.start();
      expect(validStatuses).toContain(state.status);

      state.togglePause();
      expect(validStatuses).toContain(state.status);

      state.gameOver();
      expect(validStatuses).toContain(state.status);
    });

    test('數值屬性應為數字類型', () => {
      const state = new GameState();

      expect(typeof state.score).toBe('number');
      expect(typeof state.level).toBe('number');
      expect(typeof state.linesCleared).toBe('number');
      expect(typeof state.dropSpeed).toBe('number');
      expect(typeof state.lastDropTime).toBe('number');
    });

    test('getSnapshot() 應返回純物件', () => {
      const state = new GameState();
      const snapshot = state.getSnapshot();

      expect(snapshot.constructor).toBe(Object);
      expect(snapshot).not.toBeInstanceOf(GameState);
    });
  });

  describe('等級計算公式驗證', () => {
    test('每 8 行提升一級的公式', () => {
      const state = new GameState();

      const testCases = [
        { lines: 0, expectedLevel: 1 },
        { lines: 7, expectedLevel: 1 },
        { lines: 8, expectedLevel: 2 },
        { lines: 15, expectedLevel: 2 },
        { lines: 16, expectedLevel: 3 },
        { lines: 40, expectedLevel: 6 },
        { lines: 79, expectedLevel: 10 },
        { lines: 80, expectedLevel: 11 },
      ];

      testCases.forEach(({ lines, expectedLevel }) => {
        state.linesCleared = lines;
        state.updateLevel();
        expect(state.level).toBe(expectedLevel);
      });
    });

    test('速度遞減公式：800 * 0.85^(level-1)', () => {
      const state = new GameState();

      const testCases = [
        { level: 1, expectedSpeed: 800 },
        { level: 2, expectedSpeed: 680 },
        { level: 3, expectedSpeed: 578 },
        { level: 4, expectedSpeed: 491.3 },
        { level: 5, expectedSpeed: 417.605 },
      ];

      testCases.forEach(({ level, expectedSpeed }) => {
        state.level = level;
        state.updateDropSpeed();
        expect(state.dropSpeed).toBeCloseTo(expectedSpeed, 0);
      });
    });
  });
});
