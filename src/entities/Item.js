// 아이템 엔티티 — 계열별 색상 마름모 도형

class Item {
  constructor(scene, x, y, type) {
    this.x      = x;
    this.y      = y;
    this.type   = type;
    this.active = true;

    const r     = GameConfig.ITEM.RADIUS;
    const color = GameConfig.ITEM.COLOR[type];

    // 마름모(다이아몬드) 도형으로 계열 시각 구분
    this._graphic = scene.add.graphics();
    this._graphic.fillStyle(color, 1);
    this._graphic.fillPoints([
      { x:  0, y: -r },
      { x:  r, y:  0 },
      { x:  0, y:  r },
      { x: -r, y:  0 },
    ], true);
    this._graphic.setPosition(x, y);
  }

  destroy() {
    this.active = false;
    this._graphic.destroy();
  }
}
