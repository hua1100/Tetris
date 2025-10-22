/**
 * Position - 不可變的二維座標值對象
 *
 * 設計原則：
 * - 值對象（Value Object）：不可變，避免副作用
 * - 方法返回新實例而非修改自身
 * - 支援方法鏈式調用
 */

export class Position {
  /**
   * 建立新的 Position 實例
   * @param {number} x - X 座標
   * @param {number} y - Y 座標
   */
  constructor(x, y) {
    this._x = x;
    this._y = y;
    Object.freeze(this); // 不可變
  }

  /**
   * 取得 X 座標
   * @returns {number}
   */
  get x() {
    return this._x;
  }

  /**
   * 取得 Y 座標
   * @returns {number}
   */
  get y() {
    return this._y;
  }

  /**
   * 建立新位置（移動）
   * @param {number} dx - X 方向位移
   * @param {number} dy - Y 方向位移
   * @returns {Position} 新的 Position 實例
   */
  move(dx, dy) {
    return new Position(this._x + dx, this._y + dy);
  }

  /**
   * 向左移動
   * @param {number} distance - 移動距離（預設 1）
   * @returns {Position} 新的 Position 實例
   */
  left(distance = 1) {
    return new Position(this._x - distance, this._y);
  }

  /**
   * 向右移動
   * @param {number} distance - 移動距離（預設 1）
   * @returns {Position} 新的 Position 實例
   */
  right(distance = 1) {
    return new Position(this._x + distance, this._y);
  }

  /**
   * 向上移動
   * @param {number} distance - 移動距離（預設 1）
   * @returns {Position} 新的 Position 實例
   */
  up(distance = 1) {
    return new Position(this._x, this._y - distance);
  }

  /**
   * 向下移動
   * @param {number} distance - 移動距離（預設 1）
   * @returns {Position} 新的 Position 實例
   */
  down(distance = 1) {
    return new Position(this._x, this._y + distance);
  }

  /**
   * 相等性比較
   * @param {Position} other - 另一個 Position 實例
   * @returns {boolean} 座標是否相等
   */
  equals(other) {
    return this._x === other.x && this._y === other.y;
  }

  /**
   * 克隆位置
   * @returns {Position} 新的 Position 實例
   */
  clone() {
    return new Position(this._x, this._y);
  }

  /**
   * 字串表示（除錯用）
   * @returns {string}
   */
  toString() {
    return `Position(${this._x}, ${this._y})`;
  }
}
