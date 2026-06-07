// 플레이어 엔티티 — 흰색 원, WASD 이동, 화면 경계 처리

class Player {
  constructor(scene) {
    this._scene = scene;

    const { START_X, START_Y, RADIUS } = GameConfig.PLAYER;

    // 흰색 원 생성
    this._graphic = scene.add.circle(START_X, START_Y, RADIUS, GameConfig.COLOR.PLAYER);

    // WASD 커서 키 등록
    this._keys = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  // 매 프레임 호출 — 이동 및 경계 처리
  update(delta) {
    const speed  = GameConfig.PLAYER.SPEED;
    const radius = GameConfig.PLAYER.RADIUS;
    const dt     = delta / 1000; // ms → 초 단위

    let vx = 0;
    let vy = 0;

    if (this._keys.left.isDown)  vx -= 1;
    if (this._keys.right.isDown) vx += 1;
    if (this._keys.up.isDown)    vy -= 1;
    if (this._keys.down.isDown)  vy += 1;

    // 대각선 이동 시 속도 정규화
    if (vx !== 0 && vy !== 0) {
      const inv = 1 / Math.sqrt(2);
      vx *= inv;
      vy *= inv;
    }

    let nx = this._graphic.x + vx * speed * dt;
    let ny = this._graphic.y + vy * speed * dt;

    // 맵 경계 클램프 (뷰포트가 아닌 전체 맵 기준)
    nx = Phaser.Math.Clamp(nx, radius, GameConfig.MAP.WIDTH  - radius);
    ny = Phaser.Math.Clamp(ny, radius, GameConfig.MAP.HEIGHT - radius);

    this._graphic.setPosition(nx, ny);
  }

  get x()       { return this._graphic.x; }
  get y()       { return this._graphic.y; }
  // 카메라 startFollow 용 게임 오브젝트 참조
  get graphic() { return this._graphic;   }
}
