// 아이템 시스템 — 스폰·획득·조합 트리거 (효과 구현은 각 시스템에서 이벤트 수신)

class ItemSystem {
  constructor(scene) {
    this._scene  = scene;
    this._items  = [];
    // 계열별 보유 카운트
    this._counts = { VOID: 0, FLAME: 0, FROST: 0, THUNDER: 0 };
  }

  // 준비 페이즈 시작 시 호출 — 맵에 아이템 랜덤 스폰
  spawnItems() {
    const { SPAWN_COUNT, TYPES } = GameConfig.ITEM;
    const margin = 40;
    const W      = GameConfig.WIDTH;
    const H      = GameConfig.HEIGHT;

    for (let i = 0; i < SPAWN_COUNT; i++) {
      const x    = Phaser.Math.Between(margin, W - margin);
      const y    = Phaser.Math.Between(margin, H - margin);
      // 랜덤 계열 배정
      const type = TYPES[Phaser.Math.Between(0, TYPES.length - 1)];
      this._items.push(new Item(this._scene, x, y, type));
    }
  }

  // 매 프레임 — 플레이어와 거리 기반 획득 판정
  update(playerX, playerY) {
    const rSq = GameConfig.ITEM.PICKUP_RADIUS ** 2;

    for (const item of this._items) {
      if (!item.active) continue;
      const dx = item.x - playerX;
      const dy = item.y - playerY;
      if (dx * dx + dy * dy < rSq) this._pickup(item);
    }

    // 획득된 아이템 정리
    this._items = this._items.filter(i => i.active);
  }

  // 획득 처리 — 카운트 증가 + 임계값 도달 시 이벤트 발신
  _pickup(item) {
    item.destroy();
    this._counts[item.type]++;
    const count = this._counts[item.type];

    console.log(`[아이템 획득] ${item.type} × ${count}`);

    const { TIER1_THRESHOLD: t1, TIER2_THRESHOLD: t2 } = GameConfig.ITEM;

    if (count === t1) {
      console.log(`[효과 트리거] ${item.type} 1단계 발동 (${count}개)`);
      this._scene.events.emit('item:trigger', { type: item.type, tier: 1 });
    } else if (count === t2) {
      console.log(`[효과 트리거] ${item.type} 2단계 발동 (${count}개)`);
      this._scene.events.emit('item:trigger', { type: item.type, tier: 2 });
    }
  }

  get counts() { return this._counts; }
  get items()  { return this._items;  }
}
