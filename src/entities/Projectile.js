// 투사체 엔티티 — 작은 흰색 원, 지정 방향으로 직선 이동

class Projectile {
  constructor(scene, x, y, dirX, dirY) {
    const r = GameConfig.ATTACK.PROJ_RADIUS;

    this._graphic = scene.add.circle(x, y, r, GameConfig.COLOR.PLAYER);

    // 단위 벡터로 방향 저장
    const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    this._vx = dirX / len;
    this._vy = dirY / len;

    // 발사 지점 저장 — 사거리 판정용 (맵 크기 의존 제거)
    this._originX = x;
    this._originY = y;

    this.active = true;
  }

  // 매 프레임 이동 및 사거리 초과 체크
  update(delta) {
    if (!this.active) return;

    const dt    = delta / 1000;
    const speed = GameConfig.ATTACK.PROJ_SPEED;

    this._graphic.x += this._vx * speed * dt;
    this._graphic.y += this._vy * speed * dt;

    // 발사 지점 기준 이동 거리가 PROJ_RANGE 초과 시 소멸
    const dx = this._graphic.x - this._originX;
    const dy = this._graphic.y - this._originY;
    if (dx * dx + dy * dy > GameConfig.ATTACK.PROJ_RANGE ** 2) {
      this.destroy();
    }
  }

  destroy() {
    this.active = false;
    this._graphic.destroy();
  }

  get x() { return this._graphic.x; }
  get y() { return this._graphic.y; }
}
