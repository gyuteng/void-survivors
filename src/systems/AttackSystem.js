// 자동 공격 시스템 — 가장 가까운 적을 향해 일정 간격으로 투사체 발사

class AttackSystem {
  constructor(scene) {
    this._scene       = scene;
    this._projectiles = [];
    this._elapsed     = 0; // 마지막 발사 후 경과 시간(ms)
  }

  // 매 프레임 호출 — enemies: [{x, y, ...}] 배열
  update(delta, playerX, playerY, enemies) {
    this._elapsed += delta;

    // 발사 간격 도달 + 적 존재 시 발사
    if (this._elapsed >= GameConfig.ATTACK.FIRE_RATE) {
      const target = this._findNearest(playerX, playerY, enemies);
      if (target) {
        this._fire(playerX, playerY, target);
        this._elapsed = 0;
      }
    }

    // 투사체 업데이트 및 비활성화된 것 제거
    for (const p of this._projectiles) p.update(delta);
    this._projectiles = this._projectiles.filter(p => p.active);
  }

  // 플레이어에서 가장 가까운 적 반환 (없으면 null)
  _findNearest(px, py, enemies) {
    if (!enemies || enemies.length === 0) return null;

    let nearest = null;
    let minDist = Infinity;

    for (const e of enemies) {
      const dx   = e.x - px;
      const dy   = e.y - py;
      const dist = dx * dx + dy * dy; // 제곱 거리 비교 (sqrt 생략)
      if (dist < minDist) {
        minDist = dist;
        nearest = e;
      }
    }
    return nearest;
  }

  // 타깃 방향으로 투사체 생성
  _fire(px, py, target) {
    const dx = target.x - px;
    const dy = target.y - py;
    this._projectiles.push(new Projectile(this._scene, px, py, dx, dy));
  }

  get projectiles() { return this._projectiles; }
}
