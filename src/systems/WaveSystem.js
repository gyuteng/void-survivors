// 웨이브 시스템 — PREP → COMBAT → CLEAR → COMBAT 순환

class WaveSystem {
  constructor(scene) {
    this._scene      = scene;
    this._state      = 'PREP'; // 'PREP' | 'COMBAT' | 'CLEAR'
    this._timer      = GameConfig.WAVE.PREP_DURATION;
    this._waveNumber = 0;
    this._enemies    = [];
  }

  // 매 프레임 호출 — projectiles: Projectile 배열 (충돌 감지용)
  update(delta, playerX, playerY, projectiles) {
    if      (this._state === 'PREP')   this._updatePrep(delta);
    else if (this._state === 'COMBAT') this._updateCombat(delta, playerX, playerY, projectiles);
    else if (this._state === 'CLEAR')  this._updateClear(delta);
  }

  // --- 준비 페이즈 ---

  _updatePrep(delta) {
    this._timer -= delta;
    if (this._timer <= 0) this._startWave();
  }

  // --- 전투 페이즈 ---

  _startWave() {
    this._waveNumber++;
    const count = GameConfig.WAVE.BASE_COUNT +
                  (this._waveNumber - 1) * GameConfig.WAVE.COUNT_INCREMENT;
    this._spawnEnemies(count);
    this._state = 'COMBAT';
  }

  _spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
      const { x, y } = this._randomSpawnPos();
      this._enemies.push(new Enemy(this._scene, x, y));
    }
  }

  // 화면 4방향 밖 랜덤 위치
  _randomSpawnPos() {
    const m = GameConfig.WAVE.SPAWN_MARGIN;
    const W = GameConfig.WIDTH;
    const H = GameConfig.HEIGHT;
    const side = Phaser.Math.Between(0, 3);

    switch (side) {
      case 0: return { x: Phaser.Math.Between(0, W), y: -m };        // 위
      case 1: return { x: W + m, y: Phaser.Math.Between(0, H) };     // 오른쪽
      case 2: return { x: Phaser.Math.Between(0, W), y: H + m };     // 아래
      default: return { x: -m, y: Phaser.Math.Between(0, H) };       // 왼쪽
    }
  }

  _updateCombat(delta, playerX, playerY, projectiles) {
    for (const e of this._enemies) e.update(delta, playerX, playerY);

    this._checkHits(projectiles);

    // 사망한 적 제거
    this._enemies = this._enemies.filter(e => e.active);

    if (this._enemies.length === 0) {
      this._state = 'CLEAR';
      this._timer = GameConfig.WAVE.CLEAR_DELAY;
    }
  }

  // 투사체 ↔ 적 원형 충돌 감지
  _checkHits(projectiles) {
    const r = GameConfig.WAVE.ENEMY_RADIUS + GameConfig.ATTACK.PROJ_RADIUS;
    const rSq = r * r;

    for (const p of projectiles) {
      if (!p.active) continue;
      for (const e of this._enemies) {
        if (!e.active) continue;
        const dx = p.x - e.x;
        const dy = p.y - e.y;
        if (dx * dx + dy * dy < rSq) {
          p.destroy();       // 투사체 소멸
          e.takeDamage(1);   // 적 피격
          break;             // 투사체 하나는 적 하나만 타격
        }
      }
    }
  }

  // --- 클리어 대기 ---

  _updateClear(delta) {
    this._timer -= delta;
    if (this._timer <= 0) this._startWave();
  }

  get enemies()     { return this._enemies;    }
  get waveNumber()  { return this._waveNumber; }
  get state()       { return this._state;      }
  get timerMs()     { return this._timer;      }
}
