/**
 * Position 單元測試
 *
 * 測試不可變值對象（Value Object）的所有功能
 */

import { Position } from '../../src/models/Position.js';

describe('Position', () => {
  describe('建構子', () => {
    test('應正確建立 Position 實例', () => {
      const pos = new Position(5, 10);

      expect(pos.x).toBe(5);
      expect(pos.y).toBe(10);
    });

    test('應接受負數座標', () => {
      const pos = new Position(-3, -7);

      expect(pos.x).toBe(-3);
      expect(pos.y).toBe(-7);
    });

    test('應接受零座標', () => {
      const pos = new Position(0, 0);

      expect(pos.x).toBe(0);
      expect(pos.y).toBe(0);
    });

    test('應接受大數值座標', () => {
      const pos = new Position(1000, 2000);

      expect(pos.x).toBe(1000);
      expect(pos.y).toBe(2000);
    });
  });

  describe('不可變性 (Immutability)', () => {
    test('應無法修改 x 座標', () => {
      const pos = new Position(5, 10);

      expect(() => {
        pos.x = 20;
      }).toThrow();
    });

    test('應無法修改 y 座標', () => {
      const pos = new Position(5, 10);

      expect(() => {
        pos.y = 20;
      }).toThrow();
    });

    test('應無法新增屬性', () => {
      const pos = new Position(5, 10);

      expect(() => {
        pos.z = 30;
      }).toThrow();
    });

    test('應無法直接修改 _x 屬性', () => {
      const pos = new Position(5, 10);

      expect(() => {
        pos._x = 20;
      }).toThrow();
    });

    test('應無法直接修改 _y 屬性', () => {
      const pos = new Position(5, 10);

      expect(() => {
        pos._y = 20;
      }).toThrow();
    });
  });

  describe('move() 方法', () => {
    test('應回傳新的 Position 實例', () => {
      const original = new Position(5, 10);
      const moved = original.move(2, 3);

      expect(moved).not.toBe(original);
      expect(moved).toBeInstanceOf(Position);
    });

    test('應正確計算新座標（正數位移）', () => {
      const pos = new Position(5, 10);
      const newPos = pos.move(3, 7);

      expect(newPos.x).toBe(8);
      expect(newPos.y).toBe(17);
    });

    test('應正確計算新座標（負數位移）', () => {
      const pos = new Position(5, 10);
      const newPos = pos.move(-2, -4);

      expect(newPos.x).toBe(3);
      expect(newPos.y).toBe(6);
    });

    test('應正確計算新座標（混合正負位移）', () => {
      const pos = new Position(5, 10);
      const newPos = pos.move(-3, 5);

      expect(newPos.x).toBe(2);
      expect(newPos.y).toBe(15);
    });

    test('應正確計算新座標（零位移）', () => {
      const pos = new Position(5, 10);
      const newPos = pos.move(0, 0);

      expect(newPos.x).toBe(5);
      expect(newPos.y).toBe(10);
      expect(newPos).not.toBe(pos); // 仍是新實例
    });

    test('不應修改原始 Position', () => {
      const pos = new Position(5, 10);
      pos.move(2, 3);

      expect(pos.x).toBe(5);
      expect(pos.y).toBe(10);
    });
  });

  describe('left() 方法', () => {
    test('應向左移動 1 格（預設）', () => {
      const pos = new Position(5, 10);
      const newPos = pos.left();

      expect(newPos.x).toBe(4);
      expect(newPos.y).toBe(10);
    });

    test('應向左移動指定距離', () => {
      const pos = new Position(5, 10);
      const newPos = pos.left(3);

      expect(newPos.x).toBe(2);
      expect(newPos.y).toBe(10);
    });

    test('應回傳新實例', () => {
      const pos = new Position(5, 10);
      const newPos = pos.left();

      expect(newPos).not.toBe(pos);
    });

    test('不應修改原始 Position', () => {
      const pos = new Position(5, 10);
      pos.left(2);

      expect(pos.x).toBe(5);
    });
  });

  describe('right() 方法', () => {
    test('應向右移動 1 格（預設）', () => {
      const pos = new Position(5, 10);
      const newPos = pos.right();

      expect(newPos.x).toBe(6);
      expect(newPos.y).toBe(10);
    });

    test('應向右移動指定距離', () => {
      const pos = new Position(5, 10);
      const newPos = pos.right(4);

      expect(newPos.x).toBe(9);
      expect(newPos.y).toBe(10);
    });

    test('應回傳新實例', () => {
      const pos = new Position(5, 10);
      const newPos = pos.right();

      expect(newPos).not.toBe(pos);
    });
  });

  describe('up() 方法', () => {
    test('應向上移動 1 格（預設）', () => {
      const pos = new Position(5, 10);
      const newPos = pos.up();

      expect(newPos.x).toBe(5);
      expect(newPos.y).toBe(9);
    });

    test('應向上移動指定距離', () => {
      const pos = new Position(5, 10);
      const newPos = pos.up(5);

      expect(newPos.x).toBe(5);
      expect(newPos.y).toBe(5);
    });

    test('應回傳新實例', () => {
      const pos = new Position(5, 10);
      const newPos = pos.up();

      expect(newPos).not.toBe(pos);
    });
  });

  describe('down() 方法', () => {
    test('應向下移動 1 格（預設）', () => {
      const pos = new Position(5, 10);
      const newPos = pos.down();

      expect(newPos.x).toBe(5);
      expect(newPos.y).toBe(11);
    });

    test('應向下移動指定距離', () => {
      const pos = new Position(5, 10);
      const newPos = pos.down(6);

      expect(newPos.x).toBe(5);
      expect(newPos.y).toBe(16);
    });

    test('應回傳新實例', () => {
      const pos = new Position(5, 10);
      const newPos = pos.down();

      expect(newPos).not.toBe(pos);
    });
  });

  describe('equals() 方法', () => {
    test('相同座標應返回 true', () => {
      const pos1 = new Position(5, 10);
      const pos2 = new Position(5, 10);

      expect(pos1.equals(pos2)).toBe(true);
    });

    test('不同 x 座標應返回 false', () => {
      const pos1 = new Position(5, 10);
      const pos2 = new Position(6, 10);

      expect(pos1.equals(pos2)).toBe(false);
    });

    test('不同 y 座標應返回 false', () => {
      const pos1 = new Position(5, 10);
      const pos2 = new Position(5, 11);

      expect(pos1.equals(pos2)).toBe(false);
    });

    test('兩者皆不同應返回 false', () => {
      const pos1 = new Position(5, 10);
      const pos2 = new Position(6, 11);

      expect(pos1.equals(pos2)).toBe(false);
    });

    test('與自己比較應返回 true', () => {
      const pos = new Position(5, 10);

      expect(pos.equals(pos)).toBe(true);
    });

    test('負數座標相等比較', () => {
      const pos1 = new Position(-3, -7);
      const pos2 = new Position(-3, -7);

      expect(pos1.equals(pos2)).toBe(true);
    });

    test('零座標相等比較', () => {
      const pos1 = new Position(0, 0);
      const pos2 = new Position(0, 0);

      expect(pos1.equals(pos2)).toBe(true);
    });
  });

  describe('clone() 方法', () => {
    test('應建立相同座標的新實例', () => {
      const original = new Position(5, 10);
      const cloned = original.clone();

      expect(cloned.x).toBe(5);
      expect(cloned.y).toBe(10);
    });

    test('應回傳新實例（非同一物件）', () => {
      const original = new Position(5, 10);
      const cloned = original.clone();

      expect(cloned).not.toBe(original);
    });

    test('克隆應與原物件相等', () => {
      const original = new Position(5, 10);
      const cloned = original.clone();

      expect(original.equals(cloned)).toBe(true);
    });

    test('克隆負數座標', () => {
      const original = new Position(-5, -10);
      const cloned = original.clone();

      expect(cloned.x).toBe(-5);
      expect(cloned.y).toBe(-10);
    });
  });

  describe('toString() 方法', () => {
    test('應回傳正確的字串表示', () => {
      const pos = new Position(5, 10);

      expect(pos.toString()).toBe('Position(5, 10)');
    });

    test('應正確表示負數座標', () => {
      const pos = new Position(-3, -7);

      expect(pos.toString()).toBe('Position(-3, -7)');
    });

    test('應正確表示零座標', () => {
      const pos = new Position(0, 0);

      expect(pos.toString()).toBe('Position(0, 0)');
    });

    test('應正確表示混合正負座標', () => {
      const pos = new Position(-5, 10);

      expect(pos.toString()).toBe('Position(-5, 10)');
    });
  });

  describe('方法鏈式調用', () => {
    test('應支援多次移動操作', () => {
      const pos = new Position(5, 10);
      const newPos = pos.right(2).down(3).left(1);

      expect(newPos.x).toBe(6);
      expect(newPos.y).toBe(13);
    });

    test('複雜的鏈式操作', () => {
      const pos = new Position(0, 0);
      const newPos = pos
        .right(5)
        .down(10)
        .left(2)
        .up(3);

      expect(newPos.x).toBe(3);
      expect(newPos.y).toBe(7);
    });

    test('鏈式操作不應影響原始實例', () => {
      const pos = new Position(5, 10);
      pos.right(2).down(3).left(1);

      expect(pos.x).toBe(5);
      expect(pos.y).toBe(10);
    });
  });

  describe('邊界條件', () => {
    test('應處理極大正數座標', () => {
      const pos = new Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

      expect(pos.x).toBe(Number.MAX_SAFE_INTEGER);
      expect(pos.y).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('應處理極小負數座標', () => {
      const pos = new Position(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

      expect(pos.x).toBe(Number.MIN_SAFE_INTEGER);
      expect(pos.y).toBe(Number.MIN_SAFE_INTEGER);
    });

    test('應處理浮點數座標（允許但不推薦）', () => {
      const pos = new Position(5.5, 10.7);

      expect(pos.x).toBe(5.5);
      expect(pos.y).toBe(10.7);
    });

    test('移動後超出遊戲邊界（允許）', () => {
      const pos = new Position(5, 10);
      const outOfBounds = pos.move(100, 100);

      expect(outOfBounds.x).toBe(105);
      expect(outOfBounds.y).toBe(110);
    });

    test('移動至負數座標（允許）', () => {
      const pos = new Position(5, 10);
      const negative = pos.move(-10, -15);

      expect(negative.x).toBe(-5);
      expect(negative.y).toBe(-5);
    });
  });

  describe('實際使用場景', () => {
    test('模擬方塊向下移動', () => {
      let position = new Position(3, 0);

      for (let i = 0; i < 5; i++) {
        position = position.down();
      }

      expect(position.x).toBe(3);
      expect(position.y).toBe(5);
    });

    test('模擬方塊左右移動', () => {
      let position = new Position(5, 10);

      position = position.left(2).right(1);

      expect(position.x).toBe(4);
      expect(position.y).toBe(10);
    });

    test('模擬方塊移動後檢查位置', () => {
      const start = new Position(3, 0);
      const moved = start.right(2).down(5);
      const expected = new Position(5, 5);

      expect(moved.equals(expected)).toBe(true);
    });

    test('模擬硬降（Hard Drop）', () => {
      const start = new Position(5, 0);
      const dropped = start.down(18); // 降至最底部

      expect(dropped.x).toBe(5);
      expect(dropped.y).toBe(18);
    });
  });

  describe('型別安全', () => {
    test('應為 Position 類別的實例', () => {
      const pos = new Position(5, 10);

      expect(pos).toBeInstanceOf(Position);
    });

    test('移動方法應返回 Position 實例', () => {
      const pos = new Position(5, 10);

      expect(pos.move(1, 1)).toBeInstanceOf(Position);
      expect(pos.left()).toBeInstanceOf(Position);
      expect(pos.right()).toBeInstanceOf(Position);
      expect(pos.up()).toBeInstanceOf(Position);
      expect(pos.down()).toBeInstanceOf(Position);
      expect(pos.clone()).toBeInstanceOf(Position);
    });
  });
});
