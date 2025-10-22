/**
 * Grid 單元測試
 *
 * 測試 10x20 遊戲板的所有功能
 */

import { Grid } from '../../src/models/Grid.js';
import { Tetromino } from '../../src/models/Tetromino.js';
import { TetrominoType } from '../../src/utils/Constants.js';

describe('Grid', () => {
  describe('建構子', () => {
    test('應使用預設尺寸建立 Grid (10x20)', () => {
      const grid = new Grid();

      expect(grid.width).toBe(10);
      expect(grid.height).toBe(20);
      expect(grid.cells).toHaveLength(20);
      expect(grid.cells[0]).toHaveLength(10);
    });

    test('應能自訂寬度和高度', () => {
      const grid = new Grid(15, 25);

      expect(grid.width).toBe(15);
      expect(grid.height).toBe(25);
      expect(grid.cells).toHaveLength(25);
      expect(grid.cells[0]).toHaveLength(15);
    });

    test('應建立空白網格（所有格子為 null）', () => {
      const grid = new Grid();

      for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
          expect(grid.cells[row][col]).toBeNull();
        }
      }
    });

    test('應建立小尺寸網格', () => {
      const grid = new Grid(5, 5);

      expect(grid.width).toBe(5);
      expect(grid.height).toBe(5);
      expect(grid.cells).toHaveLength(5);
    });
  });

  describe('createEmptyGrid()', () => {
    test('應建立正確尺寸的空白網格', () => {
      const grid = new Grid(8, 12);
      const emptyGrid = grid.createEmptyGrid();

      expect(emptyGrid).toHaveLength(12);
      expect(emptyGrid[0]).toHaveLength(8);
    });

    test('應建立所有格子為 null 的網格', () => {
      const grid = new Grid();
      const emptyGrid = grid.createEmptyGrid();

      emptyGrid.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeNull();
        });
      });
    });

    test('應建立新陣列（非引用）', () => {
      const grid = new Grid();
      const emptyGrid1 = grid.createEmptyGrid();
      const emptyGrid2 = grid.createEmptyGrid();

      expect(emptyGrid1).not.toBe(emptyGrid2);
    });
  });

  describe('isInBounds()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid(10, 20);
    });

    test('邊界內的座標應返回 true', () => {
      expect(grid.isInBounds(0, 0)).toBe(true);
      expect(grid.isInBounds(5, 10)).toBe(true);
      expect(grid.isInBounds(9, 19)).toBe(true);
    });

    test('邊界外的座標應返回 false（負數）', () => {
      expect(grid.isInBounds(-1, 0)).toBe(false);
      expect(grid.isInBounds(0, -1)).toBe(false);
      expect(grid.isInBounds(-1, -1)).toBe(false);
    });

    test('邊界外的座標應返回 false（超出範圍）', () => {
      expect(grid.isInBounds(10, 0)).toBe(false);
      expect(grid.isInBounds(0, 20)).toBe(false);
      expect(grid.isInBounds(10, 20)).toBe(false);
    });

    test('左上角 (0, 0) 應在邊界內', () => {
      expect(grid.isInBounds(0, 0)).toBe(true);
    });

    test('右下角 (9, 19) 應在邊界內', () => {
      expect(grid.isInBounds(9, 19)).toBe(true);
    });

    test('右下角+1 (10, 20) 應在邊界外', () => {
      expect(grid.isInBounds(10, 20)).toBe(false);
    });
  });

  describe('isOccupied()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('空白格子應返回 false', () => {
      expect(grid.isOccupied(5, 10)).toBe(false);
    });

    test('已佔用格子應返回 true', () => {
      grid.setCell(5, 10, '#FF0000');

      expect(grid.isOccupied(5, 10)).toBe(true);
    });

    test('邊界外應視為已佔用（返回 true）', () => {
      expect(grid.isOccupied(-1, 0)).toBe(true);
      expect(grid.isOccupied(0, -1)).toBe(true);
      expect(grid.isOccupied(10, 0)).toBe(true);
      expect(grid.isOccupied(0, 20)).toBe(true);
    });

    test('多個格子的佔用狀態', () => {
      grid.setCell(0, 0, '#00FF00');
      grid.setCell(5, 10, '#0000FF');

      expect(grid.isOccupied(0, 0)).toBe(true);
      expect(grid.isOccupied(5, 10)).toBe(true);
      expect(grid.isOccupied(1, 1)).toBe(false);
    });
  });

  describe('getCell()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('應返回空格子的 null', () => {
      expect(grid.getCell(5, 10)).toBeNull();
    });

    test('應返回已設定的顏色', () => {
      grid.setCell(5, 10, '#FF0000');

      expect(grid.getCell(5, 10)).toBe('#FF0000');
    });

    test('邊界外應返回 null', () => {
      expect(grid.getCell(-1, 0)).toBeNull();
      expect(grid.getCell(0, -1)).toBeNull();
      expect(grid.getCell(10, 0)).toBeNull();
      expect(grid.getCell(0, 20)).toBeNull();
    });

    test('應正確返回不同格子的值', () => {
      grid.setCell(0, 0, '#FF0000');
      grid.setCell(5, 10, '#00FF00');
      grid.setCell(9, 19, '#0000FF');

      expect(grid.getCell(0, 0)).toBe('#FF0000');
      expect(grid.getCell(5, 10)).toBe('#00FF00');
      expect(grid.getCell(9, 19)).toBe('#0000FF');
    });
  });

  describe('setCell()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('應正確設定格子顏色', () => {
      grid.setCell(5, 10, '#FF0000');

      expect(grid.cells[10][5]).toBe('#FF0000');
    });

    test('應允許覆蓋已設定的格子', () => {
      grid.setCell(5, 10, '#FF0000');
      grid.setCell(5, 10, '#00FF00');

      expect(grid.cells[10][5]).toBe('#00FF00');
    });

    test('應忽略邊界外的設定', () => {
      grid.setCell(-1, 0, '#FF0000');
      grid.setCell(0, -1, '#FF0000');
      grid.setCell(10, 0, '#FF0000');
      grid.setCell(0, 20, '#FF0000');

      // 不應拋出錯誤，且網格應保持空白
      expect(grid.cells[0][0]).toBeNull();
    });

    test('應設定多個格子', () => {
      grid.setCell(0, 0, '#FF0000');
      grid.setCell(5, 10, '#00FF00');
      grid.setCell(9, 19, '#0000FF');

      expect(grid.cells[0][0]).toBe('#FF0000');
      expect(grid.cells[10][5]).toBe('#00FF00');
      expect(grid.cells[19][9]).toBe('#0000FF');
    });

    test('應允許設定為 null（清除格子）', () => {
      grid.setCell(5, 10, '#FF0000');
      grid.setCell(5, 10, null);

      expect(grid.cells[10][5]).toBeNull();
    });
  });

  describe('lockTetromino()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('應將 O 型方塊固定到網格', () => {
      const tetromino = new Tetromino(TetrominoType.O);
      tetromino.position = { x: 0, y: 0 };

      grid.lockTetromino(tetromino);

      const blocks = tetromino.getBlocks();
      blocks.forEach(block => {
        expect(grid.getCell(block.x, block.y)).toBe(block.color);
      });
    });

    test('應將 I 型方塊固定到網格', () => {
      const tetromino = new Tetromino(TetrominoType.I);
      tetromino.position = { x: 0, y: 0 };

      grid.lockTetromino(tetromino);

      const blocks = tetromino.getBlocks();
      expect(blocks.length).toBe(4);
      blocks.forEach(block => {
        expect(grid.getCell(block.x, block.y)).toBe(block.color);
      });
    });

    test('應固定旋轉後的方塊', () => {
      const tetromino = new Tetromino(TetrominoType.T);
      tetromino.position = { x: 5, y: 10 };
      tetromino.rotate();

      grid.lockTetromino(tetromino);

      const blocks = tetromino.getBlocks();
      blocks.forEach(block => {
        expect(grid.getCell(block.x, block.y)).toBe(block.color);
      });
    });

    test('應固定在不同位置的方塊', () => {
      const tetromino = new Tetromino(TetrominoType.L);
      tetromino.position = { x: 7, y: 15 };

      grid.lockTetromino(tetromino);

      const blocks = tetromino.getBlocks();
      blocks.forEach(block => {
        expect(grid.getCell(block.x, block.y)).toBe(block.color);
      });
    });
  });

  describe('isRowComplete()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('空行應返回 false', () => {
      expect(grid.isRowComplete(0)).toBe(false);
      expect(grid.isRowComplete(19)).toBe(false);
    });

    test('完整填滿的行應返回 true', () => {
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 5, '#FF0000');
      }

      expect(grid.isRowComplete(5)).toBe(true);
    });

    test('部分填滿的行應返回 false', () => {
      for (let col = 0; col < 9; col++) {
        grid.setCell(col, 5, '#FF0000');
      }

      expect(grid.isRowComplete(5)).toBe(false);
    });

    test('邊界外的行號應返回 false', () => {
      expect(grid.isRowComplete(-1)).toBe(false);
      expect(grid.isRowComplete(20)).toBe(false);
      expect(grid.isRowComplete(100)).toBe(false);
    });

    test('多行填滿狀態', () => {
      // 填滿第 18 和 19 行
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 18, '#00FF00');
        grid.setCell(col, 19, '#0000FF');
      }

      expect(grid.isRowComplete(18)).toBe(true);
      expect(grid.isRowComplete(19)).toBe(true);
      expect(grid.isRowComplete(17)).toBe(false);
    });
  });

  describe('getCompleteRows()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('無完整行時應返回空陣列', () => {
      expect(grid.getCompleteRows()).toEqual([]);
    });

    test('應返回單一完整行', () => {
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 5, '#FF0000');
      }

      expect(grid.getCompleteRows()).toEqual([5]);
    });

    test('應返回多個完整行', () => {
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 5, '#FF0000');
        grid.setCell(col, 10, '#00FF00');
        grid.setCell(col, 15, '#0000FF');
      }

      expect(grid.getCompleteRows()).toEqual([5, 10, 15]);
    });

    test('應返回連續的完整行', () => {
      for (let row = 17; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          grid.setCell(col, row, '#FF0000');
        }
      }

      expect(grid.getCompleteRows()).toEqual([17, 18, 19]);
    });

    test('部分填滿不應包含在結果中', () => {
      // 第 5 行完整
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 5, '#FF0000');
      }

      // 第 6 行缺一格
      for (let col = 0; col < 9; col++) {
        grid.setCell(col, 6, '#00FF00');
      }

      expect(grid.getCompleteRows()).toEqual([5]);
    });

    test('應按順序返回行號', () => {
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 0, '#FF0000');
        grid.setCell(col, 10, '#00FF00');
        grid.setCell(col, 19, '#0000FF');
      }

      expect(grid.getCompleteRows()).toEqual([0, 10, 19]);
    });
  });

  describe('removeRow()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('應移除指定的行', () => {
      // 填滿第 19 行
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 19, '#FF0000');
      }

      grid.removeRow(19);

      // 第 19 行應為空
      expect(grid.isRowComplete(19)).toBe(false);
    });

    test('應在頂部新增空行', () => {
      // 填滿第 19 行
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 19, '#FF0000');
      }

      grid.removeRow(19);

      // 第 0 行應為空
      for (let col = 0; col < 10; col++) {
        expect(grid.getCell(col, 0)).toBeNull();
      }
    });

    test('應保持網格總行數不變', () => {
      grid.removeRow(10);

      expect(grid.cells).toHaveLength(20);
    });

    test('應下移上方所有行', () => {
      // 在第 18 行設定標記
      grid.setCell(5, 18, '#00FF00');

      // 移除第 19 行
      grid.removeRow(19);

      // 移除行後所有行下移，原第 18 行變成第 19 行
      expect(grid.getCell(5, 19)).toBe('#00FF00');
      // 頂部應為空行
      expect(grid.getCell(5, 0)).toBeNull();
    });

    test('移除中間行應下移上方所有行', () => {
      // 第 4 行設定標記（將被下移）
      grid.setCell(3, 4, '#FF0000');
      // 第 5 行設定標記（將被移除）
      grid.setCell(3, 5, '#FFFF00');
      // 第 10 行設定標記
      grid.setCell(7, 10, '#00FF00');

      // 移除第 5 行
      grid.removeRow(5);

      // 移除後所有行下移：
      // - 原第 4 行（'#FF0000'）變成第 5 行
      expect(grid.getCell(3, 5)).toBe('#FF0000');
      // - 原第 5 行（'#FFFF00'）被移除，不存在於任何位置
      // - 原第 6 行（空）保持在第 6 行（splice 後是 5，unshift 後是 6）
      expect(grid.getCell(3, 6)).toBeNull();
      // - 原第 10 行保持在第 10 行
      expect(grid.getCell(7, 10)).toBe('#00FF00');
      // 頂部應為空行
      expect(grid.getCell(3, 0)).toBeNull();
    });

    test('應忽略邊界外的行號', () => {
      const originalCells = grid.cells.map(row => [...row]);

      grid.removeRow(-1);
      grid.removeRow(20);

      expect(grid.cells).toEqual(originalCells);
    });
  });

  describe('removeRows()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('應移除多個行', () => {
      // 填滿第 18 和 19 行
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 18, '#00FF00');
        grid.setCell(col, 19, '#0000FF');
      }

      grid.removeRows([18, 19]);

      // 移除後，原第 18 行內容下移到第 19 行
      expect(grid.getCell(0, 19)).toBe('#00FF00');
      // 頂部兩行應為空
      expect(grid.isRowComplete(0)).toBe(false);
      expect(grid.isRowComplete(1)).toBe(false);
    });

    test('應按從下往上的順序移除（避免索引問題）', () => {
      // 設定標記
      grid.setCell(5, 10, '#FF0000');
      grid.setCell(5, 15, '#00FF00');
      grid.setCell(5, 19, '#0000FF');

      // 填滿並移除第 12, 14 行
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 12, '#FFFF00');
        grid.setCell(col, 14, '#FF00FF');
      }

      grid.removeRows([12, 14]);

      // 驗證標記位置下移
      expect(grid.getCell(5, 12)).toBe('#FF0000'); // 原 10 → 12
      expect(grid.getCell(5, 15)).toBe('#00FF00'); // 原 15 → 15 (移除 12, 14 後)
    });

    test('應移除不連續的行', () => {
      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 5, '#FF0000');
        grid.setCell(col, 10, '#00FF00');
        grid.setCell(col, 15, '#0000FF');
      }

      grid.removeRows([5, 10, 15]);

      expect(grid.isRowComplete(5)).toBe(false);
      expect(grid.isRowComplete(10)).toBe(false);
      expect(grid.isRowComplete(15)).toBe(false);
    });

    test('應處理空陣列', () => {
      const originalCells = grid.cells.map(row => [...row]);

      grid.removeRows([]);

      expect(grid.cells).toEqual(originalCells);
    });

    test('應保持網格總行數不變', () => {
      grid.removeRows([5, 10, 15, 19]);

      expect(grid.cells).toHaveLength(20);
    });
  });

  describe('clear()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('應清空整個網格', () => {
      // 填入一些資料
      grid.setCell(0, 0, '#FF0000');
      grid.setCell(5, 10, '#00FF00');
      grid.setCell(9, 19, '#0000FF');

      grid.clear();

      // 驗證所有格子為 null
      for (let row = 0; row < grid.height; row++) {
        for (let col = 0; col < grid.width; col++) {
          expect(grid.getCell(col, row)).toBeNull();
        }
      }
    });

    test('應保持網格尺寸不變', () => {
      grid.clear();

      expect(grid.width).toBe(10);
      expect(grid.height).toBe(20);
      expect(grid.cells).toHaveLength(20);
      expect(grid.cells[0]).toHaveLength(10);
    });

    test('清空後應可重新使用', () => {
      grid.setCell(5, 10, '#FF0000');
      grid.clear();
      grid.setCell(3, 7, '#00FF00');

      expect(grid.getCell(3, 7)).toBe('#00FF00');
      expect(grid.getCell(5, 10)).toBeNull();
    });
  });

  describe('clone()', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('應建立相同尺寸的網格', () => {
      const cloned = grid.clone();

      expect(cloned.width).toBe(grid.width);
      expect(cloned.height).toBe(grid.height);
    });

    test('應複製所有格子內容', () => {
      grid.setCell(0, 0, '#FF0000');
      grid.setCell(5, 10, '#00FF00');
      grid.setCell(9, 19, '#0000FF');

      const cloned = grid.clone();

      expect(cloned.getCell(0, 0)).toBe('#FF0000');
      expect(cloned.getCell(5, 10)).toBe('#00FF00');
      expect(cloned.getCell(9, 19)).toBe('#0000FF');
    });

    test('應返回新實例（非同一物件）', () => {
      const cloned = grid.clone();

      expect(cloned).not.toBe(grid);
      expect(cloned.cells).not.toBe(grid.cells);
    });

    test('修改克隆不應影響原網格', () => {
      const cloned = grid.clone();
      cloned.setCell(5, 10, '#FF0000');

      expect(grid.getCell(5, 10)).toBeNull();
      expect(cloned.getCell(5, 10)).toBe('#FF0000');
    });

    test('修改原網格不應影響克隆', () => {
      const cloned = grid.clone();
      grid.setCell(5, 10, '#FF0000');

      expect(grid.getCell(5, 10)).toBe('#FF0000');
      expect(cloned.getCell(5, 10)).toBeNull();
    });

    test('克隆應為 Grid 類別的實例', () => {
      const cloned = grid.clone();

      expect(cloned).toBeInstanceOf(Grid);
    });

    test('克隆的行應為獨立陣列', () => {
      const cloned = grid.clone();

      grid.cells[0][0] = '#FF0000';

      expect(cloned.cells[0][0]).toBeNull();
    });
  });

  describe('實際使用場景', () => {
    let grid;

    beforeEach(() => {
      grid = new Grid();
    });

    test('模擬四連消（Tetris）', () => {
      // 底部填滿 4 行，每行留一個空位
      for (let row = 16; row < 20; row++) {
        for (let col = 0; col < 9; col++) {
          grid.setCell(col, row, '#CCCCCC');
        }
      }

      // 放入 I 型方塊填滿空位
      for (let row = 16; row < 20; row++) {
        grid.setCell(9, row, '#00FFFF');
      }

      const completeRows = grid.getCompleteRows();
      expect(completeRows).toEqual([16, 17, 18, 19]);

      grid.removeRows(completeRows);

      // 移除 4 行後，頂部 4 行應為空
      for (let row = 0; row < 4; row++) {
        expect(grid.isRowComplete(row)).toBe(false);
        // 驗證為空行
        for (let col = 0; col < 10; col++) {
          expect(grid.getCell(col, row)).toBeNull();
        }
      }
    });

    test('模擬方塊堆疊至頂部（遊戲結束條件）', () => {
      // 堆滿整個網格
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          grid.setCell(col, row, '#FF0000');
        }
      }

      // 檢查頂部是否被佔用（遊戲結束）
      const topRowOccupied = grid.isOccupied(5, 0);
      expect(topRowOccupied).toBe(true);
    });

    test('模擬連續消行與分數計算', () => {
      // 填滿底部 2 行
      for (let row = 18; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          grid.setCell(col, row, '#FF0000');
        }
      }

      const completeRows = grid.getCompleteRows();
      expect(completeRows).toHaveLength(2);

      // 移除並計分（模擬）
      const score = completeRows.length === 2 ? 300 : 0;
      expect(score).toBe(300);

      grid.removeRows(completeRows);
    });

    test('模擬碰撞偵測', () => {
      // 設定障礙物
      grid.setCell(5, 18, '#FF0000');
      grid.setCell(5, 19, '#FF0000');

      // 檢查方塊是否能放置在 (5, 17)
      const canPlace = !grid.isOccupied(5, 17);
      expect(canPlace).toBe(true);

      // 檢查方塊是否能放置在 (5, 18)
      const cannotPlace = grid.isOccupied(5, 18);
      expect(cannotPlace).toBe(true);
    });

    test('模擬旋轉時的邊界檢查', () => {
      // 檢查右邊界
      expect(grid.isInBounds(10, 10)).toBe(false);
      expect(grid.isInBounds(9, 10)).toBe(true);

      // 檢查左邊界
      expect(grid.isInBounds(-1, 10)).toBe(false);
      expect(grid.isInBounds(0, 10)).toBe(true);

      // 檢查底部邊界
      expect(grid.isInBounds(5, 20)).toBe(false);
      expect(grid.isInBounds(5, 19)).toBe(true);
    });
  });

  describe('邊界條件', () => {
    test('應處理 1x1 最小網格', () => {
      const grid = new Grid(1, 1);

      expect(grid.width).toBe(1);
      expect(grid.height).toBe(1);
      expect(grid.cells).toHaveLength(1);
      expect(grid.cells[0]).toHaveLength(1);
    });

    test('應處理極大網格', () => {
      const grid = new Grid(100, 100);

      expect(grid.width).toBe(100);
      expect(grid.height).toBe(100);
      expect(grid.cells).toHaveLength(100);
    });

    test('空網格無完整行', () => {
      const grid = new Grid();

      expect(grid.getCompleteRows()).toEqual([]);
    });

    test('全滿網格有 20 個完整行', () => {
      const grid = new Grid();

      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          grid.setCell(col, row, '#FF0000');
        }
      }

      expect(grid.getCompleteRows()).toHaveLength(20);
    });
  });

  describe('型別安全', () => {
    test('應為 Grid 類別的實例', () => {
      const grid = new Grid();

      expect(grid).toBeInstanceOf(Grid);
    });

    test('cells 應為二維陣列', () => {
      const grid = new Grid();

      expect(Array.isArray(grid.cells)).toBe(true);
      expect(Array.isArray(grid.cells[0])).toBe(true);
    });

    test('clone() 應返回 Grid 實例', () => {
      const grid = new Grid();
      const cloned = grid.clone();

      expect(cloned).toBeInstanceOf(Grid);
    });

    test('getCompleteRows() 應返回數字陣列', () => {
      const grid = new Grid();

      for (let col = 0; col < 10; col++) {
        grid.setCell(col, 5, '#FF0000');
      }

      const completeRows = grid.getCompleteRows();

      expect(Array.isArray(completeRows)).toBe(true);
      completeRows.forEach(row => {
        expect(typeof row).toBe('number');
      });
    });
  });
});
