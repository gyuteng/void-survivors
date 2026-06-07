// 게임 씬 — 배경·격자·플레이어 이동·자동 공격·웨이브·아이템

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
    // 게임 시작 = 준비 페이즈 → 아이템 즉시 스폰
    this._itemSystem.spawnItems();
  }

  update(_time, delta) {
    this._player.update(delta);

    const enemies = this._waveSystem.enemies;

    this._waveSystem.update(delta, this._player.x, this._player.y,
                            this._attackSystem.projectiles);
    this._attackSystem.update(delta, this._player.x, this._player.y, enemies);
    this._itemSystem.update(this._player.x, this._player.y);
  }

  // 단색 배경 렌더링
  _drawBackground() {
    this.add.rectangle(
      0, 0,
      GameConfig.WIDTH,
      GameConfig.HEIGHT,
      GameConfig.COLOR.BACKGROUND
    ).setOrigin(0, 0);
  }

  // 격자선 렌더링
  _drawGrid() {
    const { WIDTH, HEIGHT, CELL_SIZE, LINE_ALPHA } = {
      WIDTH:      GameConfig.WIDTH,
      HEIGHT:     GameConfig.HEIGHT,
      CELL_SIZE:  GameConfig.GRID.CELL_SIZE,
      LINE_ALPHA: GameConfig.GRID.LINE_ALPHA,
    };

    const graphics = this.add.graphics();
    graphics.lineStyle(1, GameConfig.COLOR.GRID, LINE_ALPHA);

    for (let x = 0; x <= WIDTH; x += CELL_SIZE) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, HEIGHT);
    }

    for (let y = 0; y <= HEIGHT; y += CELL_SIZE) {
      graphics.moveTo(0, y);
      graphics.lineTo(WIDTH, y);
    }

    graphics.strokePath();
  }
}
