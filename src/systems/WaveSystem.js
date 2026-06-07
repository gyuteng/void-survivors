// 웨이브 시스템 — PREP → COMBAT → CLEAR → COMBAT 순환

class WaveSystem {
  constructor(scene) {
    this._scene      = scene;
    this._state      = 'PREP'; // 'PREP' | 'COMBAT' | 'CLEAR' | 'LEVELUP'
    this._timer      = GameConfig.WAVE.PREP_DURATION;
    this._waveNumber = 0;
    this._enemies    = [];
    // 마지막으로 알려진 플레이어 위치 (카메라 기준 스폰용)
    this._lastCamX   = GameConfig.PLAYER.START_X;
    this._lastCamY   = GameConfig.PLAYER.START_Y;

    // 레벨업 선택 완료 시 다음 웨이브 시작
    this._scene.events.on('levelup:done', this._startWave, this);
  }

  // 매 프레임 호출 — projectiles: Projectile 배열 (충돌 감지용)
  update(delta, playerX, playerY, projectiles) {
    // 스폰 위치 계산용 플레이어 좌표 갱신
    this._lastCamX = playerX;
    this._lastCamY = playerY;

    if      (this._state === 'PREP')    this._updatePrep(delta);
    else if (this._state === 'COMBAT')  this._updateCombat(delta, playerX, playerY, projectiles);
    else if (this._state === 'CLEAR')   this._updateClear(delta);
    // LEVELUP 상태는 levelup:done 이벤트를 기다림 (타이머 없음)
  }

  // --- 준비 페이즈 ---

  _updatePrep(delta) {
    this._timer -= delta;
    if (this._timer <= 0) this._startWave();
  }

  // --- 전투 페이즈 ---

  _startWave() {
    this._waveNumber++;

    // 웨이브 주기마다 보스 스폰 (일반 적 없음)
    if (this._waveNumber % GameConfig.BOSS.WAVE_CYCLE === 0) {
      this._spawnBoss();
    } else {
      const count = GameConfig.WAVE.BASE_COUNT +
                    (this._waveNumber - 1) * GameConfig.WAVE.COUNT_INCREMENT;
      this._spawnEnemies(count);
    }
    this._state = 'COMBAT';
  }

  _spawnBoss() {
    const { x, y } = this._randomSpawnPos();
    this._enemies.push(new Boss(this._scene, x, y));
  }

  _spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
      const { x, y } = this._randomSpawnPos();
      this._enemies.push(new Enemy(this._scene, x, y));
    }
  }

  // 카메라(플레이어) 기준 뷰포트 밖 4방향 랜덤 위치
  _randomSpawnPos() {
    const m   = GameConfig.WAVE.SPAWN_MARGIN;
    const VW  = GameConfig.WIDTH;   // 뷰포트 너비
    const VH  = GameConfig.HEIGHT;  // 뷰포트 높이
    const MW  = GameConfig.MAP.WIDTH;
    const MH  = GameConfig.MAP.HEIGHT;
    const cx  = this._lastCamX;
    const cy  = this._lastCamY;
    const clX = (x) => Phaser.Math.Clamp(x, 0, MW);
    const clY = (y) => Phaser.Math.Clamp(y, 0, MH);
    const side = Phaser.Math.Between(0, 3);

    switch (side) {
      case 0: return { x: clX(Phaser.Math.Between(cx - VW/2, cx + VW/2)), y: clY(cy - VH/2 - m) }; // 위
      case 1: return { x: clX(cx + VW/2 + m), y: clY(Phaser.Math.Between(cy - VH/2, cy + VH/2)) }; // 오른쪽
      case 2: return { x: clX(Phaser.Math.Between(cx - VW/2, cx + VW/2)), y: clY(cy + VH/2 + m) }; // 아래
      default: return { x: clX(cx - VW/2 - m), y: clY(Phaser.Math.Between(cy - VH/2, cy + VH/2)) }; // 왼쪽
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

  // 투사체 ↔ 적/보스 원형 충돌 감지 — 보스는 반지름이 다름
  _checkHits(projectiles) {
    const projR = GameConfig.ATTACK.PROJ_RADIUS;

    for (const p of projectiles) {
      if (!p.active) continue;
      for (const e of this._enemies) {
        if (!e.active) continue;
        // Boss 인스턴스 여부로 충돌 반지름 분기
        const entityR = (e instanceof Boss)
          ? GameConfig.BOSS.RADIUS
          : GameConfig.WAVE.ENEMY_RADIUS;
        const rSq = (entityR + projR) * (entityR + projR);
        const dx  = p.x - e.x;
        const dy  = p.y - e.y;
        if (dx * dx + dy * dy < rSq) {
          p.destroy();
          e.takeDamage(1);
          break;
        }
      }
    }
  }

  // --- 클리어 대기 → 레벨업 선택 화면으로 전환 ---

  _updateClear(delta) {
    this._timer -= delta;
    if (this._timer <= 0) {
      // 짧은 딜레이 후 레벨업 선택 대기 상태로 전환
      this._state = 'LEVELUP';
      this._scene.events.emit('wave:clear', { wave: this._waveNumber });
    }
  }

  get enemies()     { return this._enemies;    }
  get waveNumber()  { return this._waveNumber; }
  get state()       { return this._state;      }
  get timerMs()     { return this._timer;      }
}
