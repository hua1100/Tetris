/**
 * Logger 單元測試
 *
 * 測試結構化日誌系統的所有功能
 */

import { Logger } from '../../src/game/Logger.js';
import { GameEvent } from '../../src/utils/Constants.js';

describe('Logger', () => {
  describe('建構子', () => {
    test('應使用預設值建立 Logger（enableConsole=true, enableStorage=false）', () => {
      const logger = new Logger();

      expect(logger.enableConsole).toBe(true);
      expect(logger.enableStorage).toBe(false);
      expect(logger.logs).toEqual([]);
    });

    test('應能自訂 enableConsole 和 enableStorage', () => {
      const logger = new Logger(false, true);

      expect(logger.enableConsole).toBe(false);
      expect(logger.enableStorage).toBe(true);
    });
  });

  describe('log() 基本功能', () => {
    test('應正確記錄事件與資料', () => {
      const logger = new Logger(false, true);

      logger.log(GameEvent.PIECE_SPAWN, {
        type: 'I',
        position: { x: 3, y: 0 },
      });

      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].event).toBe(GameEvent.PIECE_SPAWN);
      expect(logs[0].type).toBe('I');
      expect(logs[0].position).toEqual({ x: 3, y: 0 });
      expect(logs[0].timestamp).toBeDefined();
      expect(typeof logs[0].timestamp).toBe('number');
    });

    test('應在 enableStorage=false 時不儲存日誌', () => {
      const logger = new Logger(false, false);

      logger.log(GameEvent.GAME_START, {});

      const logs = logger.getLogs();
      expect(logs).toHaveLength(0);
    });

    test('應產生有效的時間戳', () => {
      const logger = new Logger(false, true);
      const before = Date.now();

      logger.log(GameEvent.GAME_START, {});

      const after = Date.now();
      const logs = logger.getLogs();

      expect(logs[0].timestamp).toBeGreaterThanOrEqual(before);
      expect(logs[0].timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('遊戲生命週期事件', () => {
    let logger;

    beforeEach(() => {
      logger = new Logger(false, true);
    });

    test('logGameStart() 應記錄 GAME_START 事件', () => {
      logger.logGameStart();

      const logs = logger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].event).toBe(GameEvent.GAME_START);
    });

    test('logGamePause() 應記錄 GAME_PAUSE 事件', () => {
      logger.logGamePause();

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.GAME_PAUSE);
    });

    test('logGameResume() 應記錄 GAME_RESUME 事件', () => {
      logger.logGameResume();

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.GAME_RESUME);
    });

    test('logGameOver() 應記錄 GAME_OVER 事件與最終分數', () => {
      logger.logGameOver(15000, 8);

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.GAME_OVER);
      expect(logs[0].finalScore).toBe(15000);
      expect(logs[0].finalLevel).toBe(8);
    });
  });

  describe('方塊事件', () => {
    let logger;

    beforeEach(() => {
      logger = new Logger(false, true);
    });

    test('logPieceSpawn() 應記錄方塊生成資訊', () => {
      const mockTetromino = {
        type: 'T',
        position: { x: 3, y: 0 },
        rotation: 0,
      };

      logger.logPieceSpawn(mockTetromino);

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.PIECE_SPAWN);
      expect(logs[0].type).toBe('T');
      expect(logs[0].position).toEqual({ x: 3, y: 0 });
      expect(logs[0].rotation).toBe(0);
    });

    test('logPieceMove() 應記錄移動方向與新位置', () => {
      const newPosition = { x: 4, y: 5 };

      logger.logPieceMove('LEFT', newPosition);

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.PIECE_MOVE);
      expect(logs[0].direction).toBe('LEFT');
      expect(logs[0].newPosition).toEqual({ x: 4, y: 5 });
    });

    test('logPieceRotate() 應記錄旋轉結果', () => {
      logger.logPieceRotate(1, true);

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.PIECE_ROTATE);
      expect(logs[0].direction).toBe(1);
      expect(logs[0].success).toBe(true);
    });

    test('logPieceLock() 應記錄方塊固定位置', () => {
      const position = { x: 3, y: 18 };

      logger.logPieceLock(position);

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.PIECE_LOCK);
      expect(logs[0].position).toEqual({ x: 3, y: 18 });
    });
  });

  describe('遊戲進度事件', () => {
    let logger;

    beforeEach(() => {
      logger = new Logger(false, true);
    });

    test('logLineClear() 應記錄消行數與得分', () => {
      logger.logLineClear(4, 800);

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.LINE_CLEAR);
      expect(logs[0].rowCount).toBe(4);
      expect(logs[0].score).toBe(800);
    });

    test('logLevelUp() 應記錄新等級與新速度', () => {
      logger.logLevelUp(5, 656);

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.LEVEL_UP);
      expect(logs[0].newLevel).toBe(5);
      expect(logs[0].newSpeed).toBe(656);
    });
  });

  describe('效能監控', () => {
    test('logInputLag() 應記錄輸入延遲', () => {
      const logger = new Logger(false, true);

      logger.logInputLag(25.5);

      const logs = logger.getLogs();
      expect(logs[0].event).toBe(GameEvent.INPUT_LAG);
      expect(logs[0].latency).toBe(25.5);
    });
  });

  describe('日誌管理', () => {
    test('getLogs() 應回傳所有日誌的副本', () => {
      const logger = new Logger(false, true);

      logger.logGameStart();
      logger.logGamePause();

      const logs = logger.getLogs();
      expect(logs).toHaveLength(2);

      // 驗證是副本（修改不影響原本）
      logs.push({ test: 'data' });
      expect(logger.getLogs()).toHaveLength(2);
    });

    test('clearLogs() 應清空所有日誌', () => {
      const logger = new Logger(false, true);

      logger.logGameStart();
      logger.logGamePause();
      logger.logGameResume();

      expect(logger.getLogs()).toHaveLength(3);

      logger.clearLogs();

      expect(logger.getLogs()).toHaveLength(0);
    });

    test('exportLogs() 應回傳 JSON 格式的日誌', () => {
      const logger = new Logger(false, true);

      logger.logGameStart();
      logger.logLineClear(2, 300);

      const jsonLogs = logger.exportLogs();
      const parsed = JSON.parse(jsonLogs);

      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(2);
      expect(parsed[0].event).toBe(GameEvent.GAME_START);
      expect(parsed[1].event).toBe(GameEvent.LINE_CLEAR);
    });
  });

  describe('多個事件序列', () => {
    test('應正確記錄完整的遊戲流程', () => {
      const logger = new Logger(false, true);

      // 模擬遊戲流程
      logger.logGameStart();
      logger.logPieceSpawn({ type: 'I', position: { x: 3, y: 0 }, rotation: 0 });
      logger.logPieceMove('LEFT', { x: 2, y: 0 });
      logger.logPieceRotate(1, true);
      logger.logPieceLock({ x: 2, y: 18 });
      logger.logLineClear(1, 100);
      logger.logGamePause();
      logger.logGameResume();
      logger.logGameOver(1000, 2);

      const logs = logger.getLogs();
      expect(logs).toHaveLength(9);

      // 驗證順序
      expect(logs[0].event).toBe(GameEvent.GAME_START);
      expect(logs[1].event).toBe(GameEvent.PIECE_SPAWN);
      expect(logs[2].event).toBe(GameEvent.PIECE_MOVE);
      expect(logs[3].event).toBe(GameEvent.PIECE_ROTATE);
      expect(logs[4].event).toBe(GameEvent.PIECE_LOCK);
      expect(logs[5].event).toBe(GameEvent.LINE_CLEAR);
      expect(logs[6].event).toBe(GameEvent.GAME_PAUSE);
      expect(logs[7].event).toBe(GameEvent.GAME_RESUME);
      expect(logs[8].event).toBe(GameEvent.GAME_OVER);
    });
  });
});
