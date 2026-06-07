// 게임 씬 — 배경 + 격자 렌더링, 플레이어 이동

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this._drawBackground();
    this._drawGrid();
    this._player = new Player(this);
  }

  update(_time, delta) {
    this._player.update(delta);
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
