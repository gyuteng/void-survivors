// 투사체 엔티티 — 작은 흰색 원, 지정 방향으로 직선 이동

class Projectile {
  constructor(scene, x, y, dirX, dirY) {
    const r = GameConfig.ATTACK.PROJ_RADIUS;

    this._graphic = scene.add.circle(x, y, r, GameConfig.COLOR.PLAYER);

    // 단위 벡터로 방향 저장
    const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    this._vx = dirX / len;
    this._vy = dirY / len;

    this.active = true;
  }

  // 매 프레임 이동 및 화면 밖 체크
  update(delta) {
    if (!this.active) return;

    const dt    = delta / 1000;
    const speed = GameConfig.ATTACK.PROJ_SPEED;

    this._graphic.x += this._vx * speed * dt;
    this._graphic.y += this._vy * speed * dt;

    // 화면 밖으로 나가면 비활성화
    const { WIDTH, HEIGHT } = GameConfig;
    const { x, y } = this._graphic;
    if (x < 0 || x > WIDTH || y < 0 || y > HEIGHT) {
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
