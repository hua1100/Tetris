/**
 * BattleGame 單元測試
 *
 * 測試雙人對戰遊戲協調器的核心功能
 */

import { BattleGame } from '../../src/game/BattleGame.js';
import { GameStatus } from '../../src/utils/Constants.js';

describe('BattleGame', () => {
  let battle;

  beforeEach(() => {
    battle = new BattleGame(false); // 測試模式：禁用動畫
  });

  describe('初始化 (Initialization)', () => {
    test('應正確初始化雙玩家實例', () => {
      expect(battle.player1).toBeDefined();
      expect(battle.player2).toBeDefined();
      expect(battle.player1).not.toBe(battle.player2);
    });

    test('應初始化空的攻擊隊列', () => {
      expect(battle.attackQueue1).toBeDefined();
      expect(battle.attackQueue2).toBeDefined();
      expect(battle.attackQueue1).toEqual([]);
      expect(battle.attackQueue2).toEqual([]);
    });

    test('應初始化為未開始狀態', () => {
      expect(battle.isRunning).toBe(false);
      expect(battle.winner).toBeNull();
    });

    test('兩個玩家應該都是 IDLE 狀態', () => {
      expect(battle.player1.state.status).toBe(GameStatus.IDLE);
      expect(battle.player2.state.status).toBe(GameStatus.IDLE);
    });

    test('應能使用動畫模式初始化', () => {
      const battleWithAnim = new BattleGame(true);
      expect(battleWithAnim.player1).toBeDefined();
      expect(battleWithAnim.player2).toBeDefined();
    });
  });

  describe('生命週期 (Lifecycle)', () => {
    describe('start()', () => {
      test('應啟動兩位玩家的遊戲', () => {
        battle.start();

        expect(battle.player1.state.status).toBe(GameStatus.PLAYING);
        expect(battle.player2.state.status).toBe(GameStatus.PLAYING);
      });

      test('應設定 isRunning 為 true', () => {
        battle.start();

        expect(battle.isRunning).toBe(true);
      });

      test('應初始化 lastUpdateTime', () => {
        battle.start();

        expect(battle.lastUpdateTime).toBeGreaterThan(0);
      });

      test('兩位玩家應該都有初始方塊', () => {
        battle.start();

        expect(battle.player1.state.currentPiece).toBeTruthy();
        expect(battle.player2.state.currentPiece).toBeTruthy();
      });

      test('已啟動的遊戲不應重複啟動', () => {
        battle.start();
        const firstTime = battle.lastUpdateTime;

        battle.start();

        expect(battle.lastUpdateTime).toBe(firstTime);
      });
    });

    describe('pause()', () => {
      beforeEach(() => {
        battle.start();
      });

      test('應暫停兩位玩家的遊戲', () => {
        battle.pause();

        expect(battle.player1.state.status).toBe(GameStatus.PAUSED);
        expect(battle.player2.state.status).toBe(GameStatus.PAUSED);
      });

      test('未啟動的遊戲不應暫停', () => {
        const newBattle = new BattleGame(false);

        newBattle.pause();

        expect(newBattle.player1.state.status).toBe(GameStatus.IDLE);
        expect(newBattle.player2.state.status).toBe(GameStatus.IDLE);
      });
    });

    describe('resume()', () => {
      beforeEach(() => {
        battle.start();
        battle.pause();
      });

      test('應恢復兩位玩家的遊戲', () => {
        battle.resume();

        expect(battle.player1.state.status).toBe(GameStatus.PLAYING);
        expect(battle.player2.state.status).toBe(GameStatus.PLAYING);
      });

      test('應重置 lastUpdateTime 避免時間跳躍', () => {
        const timeBeforePause = battle.lastUpdateTime;

        // 模擬暫停一段時間
        jest.advanceTimersByTime(1000);

        battle.resume();

        expect(battle.lastUpdateTime).toBeGreaterThan(timeBeforePause);
      });

      test('未暫停的遊戲不應恢復', () => {
        battle.resume(); // 已經在 PLAYING 狀態

        // 不應有錯誤，狀態保持
        expect(battle.player1.state.status).toBe(GameStatus.PLAYING);
        expect(battle.player2.state.status).toBe(GameStatus.PLAYING);
      });
    });
  });

  describe('雙玩家更新 (Dual Player Update)', () => {
    beforeEach(() => {
      battle.start();
    });

    test('update() 應更新兩位玩家', () => {
      const p1InitialY = battle.player1.state.currentPiece.position.y;
      const p2InitialY = battle.player2.state.currentPiece.position.y;

      // 模擬足夠時間讓方塊下落
      battle.update(1000);

      // 至少其中一位玩家的方塊應該下落
      const p1Moved = battle.player1.state.currentPiece.position.y !== p1InitialY;
      const p2Moved = battle.player2.state.currentPiece.position.y !== p2InitialY;

      expect(p1Moved || p2Moved).toBe(true);
    });

    test('update() 在未啟動時不應更新', () => {
      const newBattle = new BattleGame(false);

      newBattle.update(1000);

      expect(newBattle.player1.state.status).toBe(GameStatus.IDLE);
      expect(newBattle.player2.state.status).toBe(GameStatus.IDLE);
    });

    test('update() 應累積 deltaTime', () => {
      battle.update(100);
      battle.update(100);
      battle.update(100);

      // 玩家應該接收到時間累積
      expect(battle.lastUpdateTime).toBeGreaterThan(0);
    });

    test('update() 應處理極小的 deltaTime', () => {
      battle.update(1);

      // 不應該有錯誤
      expect(battle.isRunning).toBe(true);
    });

    test('update() 應處理極大的 deltaTime', () => {
      battle.update(10000);

      // 不應該有錯誤
      expect(battle.isRunning).toBe(true);
    });
  });

  describe('玩家存取 (Player Access)', () => {
    test('getPlayer(1) 應返回玩家 1', () => {
      const player = battle.getPlayer(1);

      expect(player).toBe(battle.player1);
    });

    test('getPlayer(2) 應返回玩家 2', () => {
      const player = battle.getPlayer(2);

      expect(player).toBe(battle.player2);
    });

    test('getPlayer() 應拋出錯誤當編號無效', () => {
      expect(() => battle.getPlayer(0)).toThrow();
      expect(() => battle.getPlayer(3)).toThrow();
      expect(() => battle.getPlayer(-1)).toThrow();
    });
  });

  describe('勝負判定 (Winner Detection)', () => {
    test('getWinner() 初始應返回 null', () => {
      expect(battle.getWinner()).toBeNull();
    });

    test('遊戲進行中應返回 null', () => {
      battle.start();

      expect(battle.getWinner()).toBeNull();
    });

    test('玩家 1 遊戲結束應設定玩家 2 為勝者', () => {
      battle.start();

      // 模擬玩家 1 失敗
      battle.player1.gameOver();

      expect(battle.getWinner()).toBe(2);
    });

    test('玩家 2 遊戲結束應設定玩家 1 為勝者', () => {
      battle.start();

      // 模擬玩家 2 失敗
      battle.player2.gameOver();

      expect(battle.getWinner()).toBe(1);
    });

    test('兩位玩家同時失敗應判定為平局', () => {
      battle.start();

      // 模擬兩位玩家同時失敗
      battle.player1.gameOver();
      battle.player2.gameOver();

      expect(battle.getWinner()).toBe('draw');
    });
  });

  describe('整合測試 (Integration)', () => {
    test('完整遊戲流程', () => {
      // 開始遊戲
      battle.start();
      expect(battle.isRunning).toBe(true);

      // 更新遊戲
      battle.update(100);

      // 暫停遊戲
      battle.pause();
      expect(battle.player1.state.status).toBe(GameStatus.PAUSED);

      // 恢復遊戲
      battle.resume();
      expect(battle.player1.state.status).toBe(GameStatus.PLAYING);

      // 玩家 1 失敗
      battle.player1.gameOver();
      expect(battle.getWinner()).toBe(2);
    });

    test('兩位玩家應該有獨立的遊戲狀態', () => {
      battle.start();

      // 移動玩家 1 的方塊
      const p1InitialX = battle.player1.state.currentPiece.position.x;
      battle.player1.movePieceLeft();

      // 玩家 2 的方塊不應受影響
      const p2X = battle.player2.state.currentPiece.position.x;

      expect(battle.player1.state.currentPiece.position.x).toBe(p1InitialX - 1);
      expect(battle.player2.state.currentPiece.position.x).toBe(p2X);
    });

    test('兩位玩家應該有獨立的分數', () => {
      battle.start();

      // 玩家 1 消行
      for (let col = 0; col < 10; col++) {
        battle.player1.state.grid.setCell(col, 19, '#FF0000');
      }
      battle.player1.clearLines();

      // 玩家 1 有分數，玩家 2 沒有
      expect(battle.player1.state.score).toBeGreaterThan(0);
      expect(battle.player2.state.score).toBe(0);
    });
  });

  describe('攻擊系統 (Attack System)', () => {
    beforeEach(() => {
      battle.start();
    });

    describe('calculateGarbage()', () => {
      test('消除 1 行不產生垃圾', () => {
        const garbage = battle.calculateGarbage(1, 1);
        expect(garbage).toBe(0);
      });

      test('消除 2 行產生 1 行垃圾', () => {
        const garbage = battle.calculateGarbage(2, 1);
        expect(garbage).toBe(1);
      });

      test('消除 3 行產生 2 行垃圾', () => {
        const garbage = battle.calculateGarbage(3, 1);
        expect(garbage).toBe(2);
      });

      test('消除 4 行產生 4 行垃圾 (Tetris)', () => {
        const garbage = battle.calculateGarbage(4, 1);
        expect(garbage).toBe(4);
      });

      test('2 連擊加成：消 2 行 + 2 連擊 = 2 行垃圾', () => {
        const garbage = battle.calculateGarbage(2, 2);
        expect(garbage).toBe(2); // 1 (基礎) + 1 (連擊)
      });

      test('3 連擊加成：消 3 行 + 3 連擊 = 4 行垃圾', () => {
        const garbage = battle.calculateGarbage(3, 3);
        expect(garbage).toBe(4); // 2 (基礎) + 2 (連擊)
      });

      test('4 連擊加成：消 4 行 + 4 連擊 = 7 行垃圾', () => {
        const garbage = battle.calculateGarbage(4, 4);
        expect(garbage).toBe(7); // 4 (基礎) + 3 (連擊上限)
      });

      test('高連擊上限：10 連擊仍為 +3 加成', () => {
        const garbage = battle.calculateGarbage(4, 10);
        expect(garbage).toBe(7); // 4 (基礎) + 3 (連擊上限)
      });
    });

    describe('sendGarbageToPlayer()', () => {
      test('應將垃圾加入玩家 1 的攻擊隊列', () => {
        battle.sendGarbageToPlayer(1, 3);

        expect(battle.attackQueue1).toHaveLength(1);
        expect(battle.attackQueue1[0]).toBe(3);
      });

      test('應將垃圾加入玩家 2 的攻擊隊列', () => {
        battle.sendGarbageToPlayer(2, 2);

        expect(battle.attackQueue2).toHaveLength(1);
        expect(battle.attackQueue2[0]).toBe(2);
      });

      test('應累積多次攻擊到隊列', () => {
        battle.sendGarbageToPlayer(1, 1);
        battle.sendGarbageToPlayer(1, 2);
        battle.sendGarbageToPlayer(1, 1);

        expect(battle.attackQueue1).toHaveLength(3);
        expect(battle.attackQueue1).toEqual([1, 2, 1]);
      });

      test('應拋出錯誤當玩家編號無效', () => {
        expect(() => battle.sendGarbageToPlayer(0, 2)).toThrow();
        expect(() => battle.sendGarbageToPlayer(3, 2)).toThrow();
      });
    });

    describe('processAttacks()', () => {
      test('玩家 1 消 2 行應攻擊玩家 2', () => {
        // 玩家 1 消 2 行
        for (let row = 18; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            battle.player1.state.grid.setCell(col, row, '#FF0000');
          }
        }
        battle.player1.clearLines();

        // 處理攻擊
        battle.processAttacks();

        // 玩家 2 應該收到 1 行垃圾
        expect(battle.attackQueue2).toHaveLength(1);
        expect(battle.attackQueue2[0]).toBe(1);
      });

      test('玩家 2 消 4 行應攻擊玩家 1', () => {
        // 玩家 2 消 4 行
        for (let row = 16; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            battle.player2.state.grid.setCell(col, row, '#FF0000');
          }
        }
        battle.player2.clearLines();

        // 處理攻擊
        battle.processAttacks();

        // 玩家 1 應該收到 4 行垃圾
        expect(battle.attackQueue1).toHaveLength(1);
        expect(battle.attackQueue1[0]).toBe(4);
      });

      test('應從隊列中加入垃圾行到玩家網格', () => {
        // 手動加入垃圾到隊列
        battle.attackQueue1.push(2);

        // 處理攻擊
        battle.processAttacks();

        // 玩家 1 底部應該有 2 行垃圾
        const bottomRow1 = battle.player1.state.grid.cells[19];
        const bottomRow2 = battle.player1.state.grid.cells[18];
        const garbage1 = bottomRow1.filter(cell => cell === '#808080').length;
        const garbage2 = bottomRow2.filter(cell => cell === '#808080').length;

        expect(garbage1).toBe(9);
        expect(garbage2).toBe(9);
        expect(battle.attackQueue1).toHaveLength(0); // 隊列已清空
      });

      test('消 1 行不應產生攻擊', () => {
        // 玩家 1 消 1 行
        for (let col = 0; col < 10; col++) {
          battle.player1.state.grid.setCell(col, 19, '#FF0000');
        }
        battle.player1.clearLines();

        // 處理攻擊
        battle.processAttacks();

        // 不應有攻擊
        expect(battle.attackQueue2).toHaveLength(0);
      });

      test('垃圾行無法加入時應判定玩家失敗', () => {
        // 填滿玩家 1 頂部
        for (let y = 0; y < 5; y++) {
          for (let x = 0; x < 10; x++) {
            battle.player1.state.grid.setCell(x, y, '#FF0000');
          }
        }

        // 嘗試加入大量垃圾
        battle.attackQueue1.push(10);
        battle.processAttacks();

        // 玩家 1 應該失敗，玩家 2 獲勝
        expect(battle.getWinner()).toBe(2);
      });
    });

    describe('攻擊整合測試', () => {
      test('完整攻擊流程：消行 → 計算 → 發送 → 加入', () => {
        // 玩家 1 消 3 行
        for (let row = 17; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            battle.player1.state.grid.setCell(col, row, '#FF0000');
          }
        }
        battle.player1.clearLines();

        // 第一次處理攻擊：檢測消行並加入隊列
        battle.processAttacks();

        // 第二次處理攻擊：將隊列中的垃圾加入玩家網格
        battle.processAttacks();

        // 玩家 2 底部應該有 2 行垃圾
        const bottomRow1 = battle.player2.state.grid.cells[19];
        const bottomRow2 = battle.player2.state.grid.cells[18];
        const garbage1 = bottomRow1.filter(cell => cell === '#808080').length;
        const garbage2 = bottomRow2.filter(cell => cell === '#808080').length;

        expect(garbage1).toBe(9);
        expect(garbage2).toBe(9);
      });

      test('雙方互相攻擊', () => {
        // 玩家 1 消 2 行
        for (let row = 18; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            battle.player1.state.grid.setCell(col, row, '#FF0000');
          }
        }
        battle.player1.clearLines();

        // 玩家 2 消 3 行
        for (let row = 17; row < 20; row++) {
          for (let col = 0; col < 10; col++) {
            battle.player2.state.grid.setCell(col, row, '#00FF00');
          }
        }
        battle.player2.clearLines();

        // 第一次處理攻擊：檢測消行並加入隊列
        battle.processAttacks();

        // 第二次處理攻擊：將隊列中的垃圾加入玩家網格
        battle.processAttacks();

        // 玩家 1 應收到 2 行，玩家 2 應收到 1 行
        const p1Bottom = battle.player1.state.grid.cells[19];
        const p2Bottom = battle.player2.state.grid.cells[19];
        const p1Garbage = p1Bottom.filter(cell => cell === '#808080').length;
        const p2Garbage = p2Bottom.filter(cell => cell === '#808080').length;

        expect(p1Garbage).toBe(9); // 玩家 1 收到垃圾
        expect(p2Garbage).toBe(9); // 玩家 2 收到垃圾
      });
    });
  });
});
