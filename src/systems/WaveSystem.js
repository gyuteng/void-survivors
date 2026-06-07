// 웨이브 시스템 — PREP → COMBAT → CLEAR → LEVELUP 순환, DDA 포함

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

    // DDA 상태
    this._modifier      = GameConfig.DDA.MODIFIER_INIT;
    this._combatTimer   = 0;
    // 플레이어 HP 비율 — player:hp_ratio 이벤트로 갱신 (HP 시스템 추가 시 자동 연동)
    this._playerHpRatio = 1.0;
    // 스케일 계산 기준값 보존 (GameConfig 원본값이 덮어씌워지므로)
    this._baseEnemyHp    = GameConfig.WAVE.ENEMY_HP;
    this._baseEnemySpeed = GameConfig.WAVE.ENEMY_SPEED;
    this._baseBossHp     = GameConfig.BOSS.HP;
    this._baseBossSpeed  = GameConfig.BOSS.SPEED;

    this._scene.events.on('levelup:done',     this._startWave,                          this);
    this._scene.events.on('player:hp_ratio',  (r) => { this._playerHpRatio = r; },      this);
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
    this._combatTimer   = 0;
    this._playerHpRatio = 1.0; // 웨이브 시작 시 HP 비율 초기화

    // DDA 스케일 적용 — Enemy/Boss 생성자가 GameConfig를 직접 읽으므로 스폰 전 반영
    const dda = GameConfig.DDA;
    const w   = this._waveNumber;
    GameConfig.WAVE.ENEMY_HP    = Math.max(1,  Math.round(this._baseEnemyHp    * Math.pow(dda.HP_GROWTH,    w - 1) * this._modifier));
    GameConfig.WAVE.ENEMY_SPEED = Math.max(10, Math.round(this._baseEnemySpeed * Math.pow(dda.SPEED_GROWTH, w - 1) * this._modifier));
    GameConfig.BOSS.HP          = Math.max(1,  Math.round(this._baseBossHp     * Math.pow(dda.HP_GROWTH,    w - 1) * this._modifier));
    GameConfig.BOSS.SPEED       = Math.max(10, Math.round(this._baseBossSpeed  * Math.pow(dda.SPEED_GROWTH, w - 1) * this._modifier));

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
    const VW  = GameConfig.WIDTH;
    const VH  = GameConfig.HEIGHT;
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
    this._combatTimer += delta; // 클리어 시간 측정

    for (const e of this._enemies) e.update(delta, playerX, playerY);

    this._checkHits(projectiles);

    // 사망한 적 제거
    this._enemies = this._enemies.filter(e => e.active);

    if (this._enemies.length === 0) {
      this._adjustDifficulty();
      this._state = 'CLEAR';
      this._timer = GameConfig.WAVE.CLEAR_DELAY;
    }
  }

  // DDA — 웨이브 클리어 성과 기반 DIFFICULTY_MODIFIER 조정
  _adjustDifficulty() {
    const dda  = GameConfig.DDA;
    const hp   = this._playerHpRatio;
    const fast = this._combatTimer <= dda.CLEAR_TIME_REF;
    let next   = this._modifier;
    let label  = '적당함';

    if (hp >= dda.HP_EASY && fast) {
      next  = this._modifier * dda.SCALE_EASY;
      label = '너무 쉬움';
    } else if (hp <= dda.HP_HARD) {
      next  = this._modifier * dda.SCALE_HARD;
      label = '너무 어려움';
    }

    this._modifier = Phaser.Math.Clamp(next, dda.MODIFIER_MIN, dda.MODIFIER_MAX);

    const sec = (this._combatTimer / 1000).toFixed(1);
    const ref = (dda.CLEAR_TIME_REF / 1000).toFixed(0);
    console.log(`[DDA] 웨이브 ${this._waveNumber} | ${sec}s (기준 ${ref}s) | HP ${(hp * 100).toFixed(0)}% | ${label} | modifier: ${this._modifier.toFixed(2)}`);
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
      this._state = 'LEVELUP';
      this._scene.events.emit('wave:clear', { wave: this._waveNumber });
    }
  }

  get enemies()    { return this._enemies;    }
  get waveNumber() { return this._waveNumber; }
  get state()      { return this._state;      }
  get timerMs()    { return this._timer;      }
  get modifier()   { return this._modifier;   }
}
