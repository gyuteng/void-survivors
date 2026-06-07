// 보스 엔티티 — 큰 빨간 사각형, 플레이어 방향 이동, 높은 체력

class Boss {
  constructor(scene, x, y) {
    this.x      = x;
    this.y      = y;
    this.hp     = GameConfig.BOSS.HP;
    this.active = true;

    // 사각형을 원점 기준으로 그린 뒤 setPosition으로 이동
    this._graphic = scene.add.graphics();
    this._redraw();
    this._graphic.setPosition(x, y);
  }

  // 매 프레임 — 플레이어 방향으로 이동
  update(delta, playerX, playerY) {
    if (!this.active) return;

    const dt    = delta / 1000;
    const speed = GameConfig.BOSS.SPEED;
    const dx    = playerX - this.x;
    const dy    = playerY - this.y;
    const len   = Math.sqrt(dx * dx + dy * dy) || 1;

    this.x += (dx / len) * speed * dt;
    this.y += (dy / len) * speed * dt;

    this._graphic.setPosition(this.x, this.y);
  }

  // 피격 처리
  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) this.destroy();
  }

  destroy() {
    this.active = false;
    this._graphic.destroy();
  }

  // 원점(0,0) 기준 정사각형
  _redraw() {
    const s = GameConfig.BOSS.SIZE;
    this._graphic.clear();
    this._graphic.fillStyle(GameConfig.COLOR.BOSS, 1);
    this._graphic.fillRect(-s, -s, s * 2, s * 2);
  }
}
