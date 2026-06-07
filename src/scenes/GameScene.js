// 게임 씬 — 배경 + 격자 렌더링, 플레이어 이동, 자동 공격

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this._drawBackground();
    this._drawGrid();
    this._player       = new Player(this);
    this._attackSystem = new AttackSystem(this);
    // TODO: 웨이브 시스템 구현 시 제거 — 자동 공격 테스트용 더미 적
    this._enemies = [this._spawnDummyEnemy()];
  }

  update(_time, delta) {
    this._player.update(delta);
    this._attackSystem.update(delta, this._player.x, this._player.y, this._enemies);
  }

  // TODO: 웨이브 시스템 구현 시 제거 — 빨간 삼각형 더미 적 스폰
  _spawnDummyEnemy() {
    const x = Phaser.Math.Between(60, GameConfig.WIDTH  - 60);
    const y = Phaser.Math.Between(60, GameConfig.HEIGHT / 2);

    const g = this.add.graphics();
    g.fillStyle(GameConfig.COLOR.ENEMY, 1);
    // 정삼각형: 꼭짓점 3개
    g.fillTriangle(x, y - 20, x - 17, y + 10, x + 17, y + 10);

    return { x, y, graphic: g };
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

    // 수직선
    for (let x = 0; x <= WIDTH; x += CELL_SIZE) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, HEIGHT);
    }

    // 수평선
    for (let y = 0; y <= HEIGHT; y += CELL_SIZE) {
      graphics.moveTo(0, y);
      graphics.lineTo(WIDTH, y);
    }

    graphics.strokePath();
  }
}
