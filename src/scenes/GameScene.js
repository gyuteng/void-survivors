// 게임 씬 — 배경·격자·플레이어 이동·자동 공격·웨이브·아이템·레벨업

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this._drawBackground();
    this._drawGrid();
    this._player       = new Player(this);
    this._attackSystem = new AttackSystem(this);
    this._waveSystem   = new WaveSystem(this);
    this._itemSystem   = new ItemSystem(this);
    this._levelSystem  = new LevelSystem(this, this._itemSystem);
    // 게임 시작 = 준비 페이즈 → 아이템 즉시 스폰
    this._itemSystem.spawnItems();

    // 카메라 — 전체 맵 범위 설정 후 플레이어 팔로우
    const { WIDTH: mw, HEIGHT: mh } = GameConfig.MAP;
    this.cameras.main.setBounds(0, 0, mw, mh);
    this.cameras.main.startFollow(this._player.graphic, true);
  }

  update(_time, delta) {
    // 레벨업 선택지 표시 중엔 게임 일시정지
    if (this._levelSystem.active) return;

    this._player.update(delta);

    const enemies = this._waveSystem.enemies;

    this._waveSystem.update(delta, this._player.x, this._player.y,
                            this._attackSystem.projectiles);
    this._attackSystem.update(delta, this._player.x, this._player.y, enemies);
    this._itemSystem.update(this._player.x, this._player.y);
  }

  // 단색 배경 렌더링 (전체 맵 크기)
  _drawBackground() {
    this.add.rectangle(
      0, 0,
      GameConfig.MAP.WIDTH,
      GameConfig.MAP.HEIGHT,
      GameConfig.COLOR.BACKGROUND
    ).setOrigin(0, 0);
  }

  // 격자선 렌더링 (전체 맵 기준)
  _drawGrid() {
    const MW        = GameConfig.MAP.WIDTH;
    const MH        = GameConfig.MAP.HEIGHT;
    const CELL_SIZE = GameConfig.GRID.CELL_SIZE;
    const LINE_ALPHA = GameConfig.GRID.LINE_ALPHA;

    const graphics = this.add.graphics();
    graphics.lineStyle(1, GameConfig.COLOR.GRID, LINE_ALPHA);

    for (let x = 0; x <= MW; x += CELL_SIZE) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, MH);
    }

    for (let y = 0; y <= MH; y += CELL_SIZE) {
      graphics.moveTo(0, y);
      graphics.lineTo(MW, y);
    }

    graphics.strokePath();
  }
}
