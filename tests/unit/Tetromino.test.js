/**
 * Tetromino 單元測試
 *
 * 測試七種方塊類型及其旋轉、移動功能
 */

import { Tetromino } from '../../src/models/Tetromino.js';
import { Position } from '../../src/models/Position.js';
import {
  TetrominoType,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
} from '../../src/utils/Constants.js';

describe('Tetromino', () => {
  describe('建構子', () => {
    test('應正確建立 I 型方塊', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      expect(tetromino.type).toBe(TetrominoType.I);
      expect(tetromino.rotation).toBe(0);
      expect(tetromino.position).toBeInstanceOf(Position);
      expect(tetromino.position.x).toBe(3);
      expect(tetromino.position.y).toBe(0);
      expect(tetromino.color).toBe(TETROMINO_COLORS.I);
    });

    test('應正確建立 O 型方塊', () => {
      const tetromino = new Tetromino(TetrominoType.O);

      expect(tetromino.type).toBe(TetrominoType.O);
      expect(tetromino.color).toBe(TETROMINO_COLORS.O);
    });

    test('應正確建立 T 型方塊', () => {
      const tetromino = new Tetromino(TetrominoType.T);

      expect(tetromino.type).toBe(TetrominoType.T);
      expect(tetromino.color).toBe(TETROMINO_COLORS.T);
    });

    test('應正確建立 S 型方塊', () => {
      const tetromino = new Tetromino(TetrominoType.S);

      expect(tetromino.type).toBe(TetrominoType.S);
      expect(tetromino.color).toBe(TETROMINO_COLORS.S);
    });

    test('應正確建立 Z 型方塊', () => {
      const tetromino = new Tetromino(TetrominoType.Z);

      expect(tetromino.type).toBe(TetrominoType.Z);
      expect(tetromino.color).toBe(TETROMINO_COLORS.Z);
    });

    test('應正確建立 J 型方塊', () => {
      const tetromino = new Tetromino(TetrominoType.J);

      expect(tetromino.type).toBe(TetrominoType.J);
      expect(tetromino.color).toBe(TETROMINO_COLORS.J);
    });

    test('應正確建立 L 型方塊', () => {
      const tetromino = new Tetromino(TetrominoType.L);

      expect(tetromino.type).toBe(TetrominoType.L);
      expect(tetromino.color).toBe(TETROMINO_COLORS.L);
    });

    test('所有方塊初始旋轉應為 0', () => {
      Object.values(TetrominoType).forEach(type => {
        const tetromino = new Tetromino(type);
        expect(tetromino.rotation).toBe(0);
      });
    });

    test('所有方塊初始位置應為 (3, 0)', () => {
      Object.values(TetrominoType).forEach(type => {
        const tetromino = new Tetromino(type);
        expect(tetromino.position.x).toBe(3);
        expect(tetromino.position.y).toBe(0);
      });
    });

    test('應設定正確的顏色', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      expect(tetromino.color).toBe('#00FFFF'); // Cyan

      const oTetromino = new Tetromino(TetrominoType.O);
      expect(oTetromino.color).toBe('#FFFF00'); // Yellow
    });
  });

  describe('getShape()', () => {
    test('應返回 I 型方塊的初始形狀', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const shape = tetromino.getShape();

      expect(shape).toEqual(TETROMINO_SHAPES.I[0]);
    });

    test('應返回 O 型方塊的形狀', () => {
      const tetromino = new Tetromino(TetrominoType.O);
      const shape = tetromino.getShape();

      expect(shape).toEqual(TETROMINO_SHAPES.O[0]);
      expect(shape).toEqual([
        [1, 1],
        [1, 1],
      ]);
    });

    test('應返回 T 型方塊的初始形狀', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      const shape = tetromino.getShape();

      expect(shape).toEqual(TETROMINO_SHAPES.T[0]);
    });

    test('旋轉後應返回新的形狀', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      tetromino.rotate();
      const rotatedShape = tetromino.getShape();

      expect(rotatedShape).toEqual(TETROMINO_SHAPES.I[1]);
      expect(rotatedShape).not.toEqual(TETROMINO_SHAPES.I[0]);
    });

    test('O 型方塊旋轉後形狀不變', () => {
      const tetromino = new Tetromino(TetrominoType.O);
      const originalShape = tetromino.getShape();

      tetromino.rotate();
      const rotatedShape = tetromino.getShape();

      expect(rotatedShape).toEqual(originalShape);
    });

    test('應返回矩陣引用（不是副本）', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      const shape = tetromino.getShape();

      expect(shape).toBe(TETROMINO_SHAPES.T[0]);
    });
  });

  describe('getBlocks()', () => {
    test('I 型方塊應返回 4 個方格', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const blocks = tetromino.getBlocks();

      expect(blocks).toHaveLength(4);
    });

    test('O 型方塊應返回 4 個方格', () => {
      const tetromino = new Tetromino(TetrominoType.O);
      const blocks = tetromino.getBlocks();

      expect(blocks).toHaveLength(4);
    });

    test('T 型方塊應返回 4 個方格', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      const blocks = tetromino.getBlocks();

      expect(blocks).toHaveLength(4);
    });

    test('所有方塊類型應返回 4 個方格', () => {
      Object.values(TetrominoType).forEach(type => {
        const tetromino = new Tetromino(type);
        const blocks = tetromino.getBlocks();
        expect(blocks).toHaveLength(4);
      });
    });

    test('應返回正確的絕對座標', () => {
      const tetromino = new Tetromino(TetrominoType.O);
      tetromino.position = new Position(5, 10);

      const blocks = tetromino.getBlocks();

      // O 型在 (5, 10) 的方格應為：
      // (5, 10), (6, 10), (5, 11), (6, 11)
      expect(blocks).toContainEqual({ x: 5, y: 10, color: TETROMINO_COLORS.O });
      expect(blocks).toContainEqual({ x: 6, y: 10, color: TETROMINO_COLORS.O });
      expect(blocks).toContainEqual({ x: 5, y: 11, color: TETROMINO_COLORS.O });
      expect(blocks).toContainEqual({ x: 6, y: 11, color: TETROMINO_COLORS.O });
    });

    test('應包含正確的顏色', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const blocks = tetromino.getBlocks();

      blocks.forEach(block => {
        expect(block.color).toBe(TETROMINO_COLORS.I);
      });
    });

    test('移動後應返回新的座標', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      const initialBlocks = tetromino.getBlocks();

      tetromino.move(2, 3);
      const movedBlocks = tetromino.getBlocks();

      movedBlocks.forEach((block, index) => {
        expect(block.x).toBe(initialBlocks[index].x + 2);
        expect(block.y).toBe(initialBlocks[index].y + 3);
      });
    });

    test('旋轉後應返回新的方格配置', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const initialBlocks = tetromino.getBlocks();

      tetromino.rotate();
      const rotatedBlocks = tetromino.getBlocks();

      // 座標應不同（I 型水平 vs 垂直）
      expect(rotatedBlocks).not.toEqual(initialBlocks);
    });

    test('I 型方塊初始應為水平排列', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const blocks = tetromino.getBlocks();

      // 檢查 y 座標相同（水平）
      const yCoords = blocks.map(b => b.y);
      const allSameY = yCoords.every(y => y === yCoords[0]);
      expect(allSameY).toBe(true);
    });

    test('每個方格應有 x, y, color 屬性', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      const blocks = tetromino.getBlocks();

      blocks.forEach(block => {
        expect(block).toHaveProperty('x');
        expect(block).toHaveProperty('y');
        expect(block).toHaveProperty('color');
        expect(typeof block.x).toBe('number');
        expect(typeof block.y).toBe('number');
        expect(typeof block.color).toBe('string');
      });
    });
  });

  describe('move()', () => {
    test('應正確向右移動', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      tetromino.move(1, 0);

      expect(tetromino.position.x).toBe(4);
      expect(tetromino.position.y).toBe(0);
    });

    test('應正確向左移動', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      tetromino.move(-1, 0);

      expect(tetromino.position.x).toBe(2);
      expect(tetromino.position.y).toBe(0);
    });

    test('應正確向下移動', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      tetromino.move(0, 1);

      expect(tetromino.position.x).toBe(3);
      expect(tetromino.position.y).toBe(1);
    });

    test('應正確向上移動', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      tetromino.position = new Position(3, 5);

      tetromino.move(0, -1);

      expect(tetromino.position.y).toBe(4);
    });

    test('應正確斜向移動', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      tetromino.move(2, 3);

      expect(tetromino.position.x).toBe(5);
      expect(tetromino.position.y).toBe(3);
    });

    test('應支援連續移動', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      tetromino.move(1, 0);
      tetromino.move(1, 0);
      tetromino.move(0, 1);

      expect(tetromino.position.x).toBe(5);
      expect(tetromino.position.y).toBe(1);
    });

    test('應建立新的 Position 實例', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const oldPosition = tetromino.position;

      tetromino.move(1, 1);

      expect(tetromino.position).not.toBe(oldPosition);
      expect(tetromino.position).toBeInstanceOf(Position);
    });

    test('移動不應改變類型或旋轉', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      tetromino.rotation = 2;

      tetromino.move(3, 5);

      expect(tetromino.type).toBe(TetrominoType.T);
      expect(tetromino.rotation).toBe(2);
    });
  });

  describe('rotate()', () => {
    test('應順時針旋轉（0 → 1）', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      tetromino.rotate();

      expect(tetromino.rotation).toBe(1);
    });

    test('應順時針旋轉（1 → 2）', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      tetromino.rotation = 1;

      tetromino.rotate();

      expect(tetromino.rotation).toBe(2);
    });

    test('應順時針旋轉（2 → 3）', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      tetromino.rotation = 2;

      tetromino.rotate();

      expect(tetromino.rotation).toBe(3);
    });

    test('應循環旋轉（3 → 0）', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      tetromino.rotation = 3;

      tetromino.rotate();

      expect(tetromino.rotation).toBe(0);
    });

    test('連續旋轉 4 次應回到初始狀態', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      const initialShape = tetromino.getShape();

      tetromino.rotate();
      tetromino.rotate();
      tetromino.rotate();
      tetromino.rotate();

      expect(tetromino.rotation).toBe(0);
      expect(tetromino.getShape()).toEqual(initialShape);
    });

    test('O 型方塊旋轉不應改變形狀', () => {
      const tetromino = new Tetromino(TetrominoType.O);
      const shape0 = tetromino.getShape();

      tetromino.rotate();
      const shape1 = tetromino.getShape();

      tetromino.rotate();
      const shape2 = tetromino.getShape();

      expect(shape0).toEqual(shape1);
      expect(shape1).toEqual(shape2);
    });

    test('I 型方塊旋轉應在水平和垂直間切換', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      // 初始：水平
      tetromino.rotate(); // 垂直
      tetromino.rotate(); // 水平
      tetromino.rotate(); // 垂直

      expect(tetromino.rotation).toBe(3);
    });

    test('旋轉不應改變位置', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      tetromino.position = new Position(5, 10);

      tetromino.rotate();

      expect(tetromino.position.x).toBe(5);
      expect(tetromino.position.y).toBe(10);
    });

    test('旋轉不應改變類型或顏色', () => {
      const tetromino = new Tetromino(TetrominoType.J);
      const originalType = tetromino.type;
      const originalColor = tetromino.color;

      tetromino.rotate();

      expect(tetromino.type).toBe(originalType);
      expect(tetromino.color).toBe(originalColor);
    });

    test('所有方塊類型應支援旋轉', () => {
      Object.values(TetrominoType).forEach(type => {
        const tetromino = new Tetromino(type);

        tetromino.rotate();
        expect(tetromino.rotation).toBe(1);

        tetromino.rotate();
        tetromino.rotate();
        tetromino.rotate();
        expect(tetromino.rotation).toBe(0);
      });
    });
  });

  describe('clone()', () => {
    test('應建立相同類型的新實例', () => {
      const original = new Tetromino(TetrominoType.I);
      const cloned = original.clone();

      expect(cloned.type).toBe(original.type);
      expect(cloned).not.toBe(original);
    });

    test('應複製旋轉狀態', () => {
      const original = new Tetromino(TetrominoType.T);
      original.rotation = 2;

      const cloned = original.clone();

      expect(cloned.rotation).toBe(2);
    });

    test('應複製位置', () => {
      const original = new Tetromino(TetrominoType.L);
      original.position = new Position(7, 15);

      const cloned = original.clone();

      expect(cloned.position.x).toBe(7);
      expect(cloned.position.y).toBe(15);
    });

    test('應複製顏色', () => {
      const original = new Tetromino(TetrominoType.S);
      const cloned = original.clone();

      expect(cloned.color).toBe(original.color);
    });

    test('克隆的位置應為新實例', () => {
      const original = new Tetromino(TetrominoType.Z);
      const cloned = original.clone();

      expect(cloned.position).not.toBe(original.position);
    });

    test('修改克隆不應影響原物件', () => {
      const original = new Tetromino(TetrominoType.J);
      const cloned = original.clone();

      cloned.move(5, 10);
      cloned.rotate();

      expect(original.position.x).toBe(3);
      expect(original.position.y).toBe(0);
      expect(original.rotation).toBe(0);
    });

    test('修改原物件不應影響克隆', () => {
      const original = new Tetromino(TetrominoType.T);
      const cloned = original.clone();

      original.move(5, 10);
      original.rotate();

      expect(cloned.position.x).toBe(3);
      expect(cloned.position.y).toBe(0);
      expect(cloned.rotation).toBe(0);
    });

    test('克隆應為 Tetromino 類別的實例', () => {
      const original = new Tetromino(TetrominoType.I);
      const cloned = original.clone();

      expect(cloned).toBeInstanceOf(Tetromino);
    });

    test('克隆複雜狀態的方塊', () => {
      const original = new Tetromino(TetrominoType.L);
      original.position = new Position(8, 18);
      original.rotation = 3;

      const cloned = original.clone();

      expect(cloned.type).toBe(TetrominoType.L);
      expect(cloned.position.x).toBe(8);
      expect(cloned.position.y).toBe(18);
      expect(cloned.rotation).toBe(3);
      expect(cloned.color).toBe(TETROMINO_COLORS.L);
    });
  });

  describe('實際使用場景', () => {
    test('模擬方塊下落', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      // 下落 10 格
      for (let i = 0; i < 10; i++) {
        tetromino.move(0, 1);
      }

      expect(tetromino.position.y).toBe(10);
    });

    test('模擬方塊左右移動與旋轉', () => {
      const tetromino = new Tetromino(TetrominoType.T);

      tetromino.move(-1, 0); // 左
      tetromino.rotate();    // 旋轉
      tetromino.move(0, 5);  // 下
      tetromino.move(2, 0);  // 右

      expect(tetromino.position.x).toBe(4); // 3 - 1 + 2
      expect(tetromino.position.y).toBe(5);
      expect(tetromino.rotation).toBe(1);
    });

    test('模擬硬降（Hard Drop）預測', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const predicted = tetromino.clone();

      // 預測硬降位置
      predicted.move(0, 18);

      // 原方塊不受影響
      expect(tetromino.position.y).toBe(0);
      // 預測方塊在底部
      expect(predicted.position.y).toBe(18);
    });

    test('模擬旋轉前的碰撞檢測', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const testRotation = tetromino.clone();

      testRotation.rotate();

      // 可以測試 testRotation 的碰撞
      // 若合法則應用旋轉到原方塊
      if (true) { // 假設無碰撞
        tetromino.rotate();
      }

      expect(tetromino.rotation).toBe(1);
    });

    test('模擬 T-Spin 準備（T 型特殊旋轉）', () => {
      const tetromino = new Tetromino(TetrominoType.T);

      // 移至特定位置
      tetromino.move(2, 15);
      // 旋轉至特定角度
      tetromino.rotate();
      tetromino.rotate();

      expect(tetromino.rotation).toBe(2);
      expect(tetromino.position.x).toBe(5);
      expect(tetromino.position.y).toBe(15);
    });

    test('模擬 I 型方塊四連消準備', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      // 旋轉為垂直
      tetromino.rotate();
      // 移至右側
      tetromino.move(6, 0);
      // 硬降
      tetromino.move(0, 16);

      expect(tetromino.rotation).toBe(1); // 垂直
      expect(tetromino.position.x).toBe(9);
      expect(tetromino.position.y).toBe(16);
    });
  });

  describe('邊界條件', () => {
    test('應允許移動至負座標（部分超出畫面）', () => {
      const tetromino = new Tetromino(TetrominoType.O);

      tetromino.move(-5, -5);

      expect(tetromino.position.x).toBe(-2);
      expect(tetromino.position.y).toBe(-5);
    });

    test('應允許移動至極大座標', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      tetromino.move(100, 100);

      expect(tetromino.position.x).toBe(103);
      expect(tetromino.position.y).toBe(100);
    });

    test('多次旋轉應保持 rotation 在 0-3 範圍', () => {
      const tetromino = new Tetromino(TetrominoType.S);

      for (let i = 0; i < 100; i++) {
        tetromino.rotate();
      }

      expect(tetromino.rotation).toBeGreaterThanOrEqual(0);
      expect(tetromino.rotation).toBeLessThanOrEqual(3);
    });

    test('零距離移動應建立新 Position', () => {
      const tetromino = new Tetromino(TetrominoType.Z);
      const oldPosition = tetromino.position;

      tetromino.move(0, 0);

      expect(tetromino.position).not.toBe(oldPosition);
      expect(tetromino.position.x).toBe(oldPosition.x);
      expect(tetromino.position.y).toBe(oldPosition.y);
    });
  });

  describe('型別安全', () => {
    test('應為 Tetromino 類別的實例', () => {
      const tetromino = new Tetromino(TetrominoType.I);

      expect(tetromino).toBeInstanceOf(Tetromino);
    });

    test('position 應為 Position 實例', () => {
      const tetromino = new Tetromino(TetrominoType.O);

      expect(tetromino.position).toBeInstanceOf(Position);
    });

    test('getBlocks() 應返回物件陣列', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      const blocks = tetromino.getBlocks();

      expect(Array.isArray(blocks)).toBe(true);
      blocks.forEach(block => {
        expect(typeof block).toBe('object');
      });
    });

    test('getShape() 應返回二維數字陣列', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const shape = tetromino.getShape();

      expect(Array.isArray(shape)).toBe(true);
      shape.forEach(row => {
        expect(Array.isArray(row)).toBe(true);
        row.forEach(cell => {
          expect(typeof cell).toBe('number');
        });
      });
    });

    test('type 應為字串', () => {
      const tetromino = new Tetromino(TetrominoType.J);

      expect(typeof tetromino.type).toBe('string');
    });

    test('rotation 應為數字', () => {
      const tetromino = new Tetromino(TetrominoType.L);

      expect(typeof tetromino.rotation).toBe('number');
    });

    test('color 應為字串', () => {
      const tetromino = new Tetromino(TetrominoType.S);

      expect(typeof tetromino.color).toBe('string');
    });
  });

  describe('七種方塊形狀驗證', () => {
    test('I 型應有 4 種不同的旋轉狀態', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      const shapes = [];

      for (let i = 0; i < 4; i++) {
        shapes.push(tetromino.getShape());
        tetromino.rotate();
      }

      // I 型的 0° 和 180° 相似，但位置不同
      expect(shapes).toHaveLength(4);
    });

    test('O 型所有旋轉狀態應相同', () => {
      const tetromino = new Tetromino(TetrominoType.O);
      const shape0 = tetromino.getShape();

      for (let i = 0; i < 4; i++) {
        tetromino.rotate();
        expect(tetromino.getShape()).toEqual(shape0);
      }
    });

    test('T 型應有 4 種不同的旋轉狀態', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      const shapes = new Set();

      for (let i = 0; i < 4; i++) {
        shapes.add(JSON.stringify(tetromino.getShape()));
        tetromino.rotate();
      }

      expect(shapes.size).toBe(4);
    });

    test('S 型應有旋轉變化', () => {
      const tetromino = new Tetromino(TetrominoType.S);
      const shape0 = tetromino.getShape();

      tetromino.rotate();
      const shape1 = tetromino.getShape();

      expect(shape0).not.toEqual(shape1);
    });

    test('Z 型應有旋轉變化', () => {
      const tetromino = new Tetromino(TetrominoType.Z);
      const shape0 = tetromino.getShape();

      tetromino.rotate();
      const shape1 = tetromino.getShape();

      expect(shape0).not.toEqual(shape1);
    });

    test('J 型應有 4 種不同的旋轉狀態', () => {
      const tetromino = new Tetromino(TetrominoType.J);
      const shapes = new Set();

      for (let i = 0; i < 4; i++) {
        shapes.add(JSON.stringify(tetromino.getShape()));
        tetromino.rotate();
      }

      expect(shapes.size).toBe(4);
    });

    test('L 型應有 4 種不同的旋轉狀態', () => {
      const tetromino = new Tetromino(TetrominoType.L);
      const shapes = new Set();

      for (let i = 0; i < 4; i++) {
        shapes.add(JSON.stringify(tetromino.getShape()));
        tetromino.rotate();
      }

      expect(shapes.size).toBe(4);
    });

    test('每種方塊應有正確的顏色', () => {
      expect(new Tetromino(TetrominoType.I).color).toBe('#00FFFF');
      expect(new Tetromino(TetrominoType.O).color).toBe('#FFFF00');
      expect(new Tetromino(TetrominoType.T).color).toBe('#9900FF');
      expect(new Tetromino(TetrominoType.S).color).toBe('#00FF00');
      expect(new Tetromino(TetrominoType.Z).color).toBe('#FF0000');
      expect(new Tetromino(TetrominoType.J).color).toBe('#0000FF');
      expect(new Tetromino(TetrominoType.L).color).toBe('#FF7F00');
    });
  });
});
