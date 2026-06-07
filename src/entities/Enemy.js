// 적 엔티티 — 빨간 삼각형, 플레이어 방향으로 자동 이동

class Enemy {
  constructor(scene, x, y) {
    this.x      = x;
    this.y      = y;
    this.hp     = GameConfig.WAVE.ENEMY_HP;
    this.active = true;

    // 삼각형을 원점 기준으로 그린 뒤 setPosition으로 이동
    this._graphic = scene.add.graphics();
    this._redraw();
    this._graphic.setPosition(x, y);
  }

  // 매 프레임 — 플레이어 방향으로 이동
  update(delta, playerX, playerY) {
    if (!this.active) return;

    const dt    = delta / 1000;
    const speed = GameConfig.WAVE.ENEMY_SPEED;
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

  // 원점(0,0) 기준 정삼각형
  _redraw() {
    this._graphic.clear();
    this._graphic.fillStyle(GameConfig.COLOR.ENEMY, 1);
    this._graphic.fillTriangle(0, -20, -17, 10, 17, 10);
  }
}
