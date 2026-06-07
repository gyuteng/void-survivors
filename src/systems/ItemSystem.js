// 아이템 시스템 — 스폰·획득·조합 트리거 (효과 구현은 각 시스템에서 이벤트 수신)

class ItemSystem {
  constructor(scene) {
    this._scene  = scene;
    this._items  = [];
    // 계열별 보유 카운트 (SWIFT 포함)
    this._counts = { VOID: 0, FLAME: 0, FROST: 0, THUNDER: 0, SWIFT: 0 };
  }

  // 준비 페이즈 시작 시 호출 — 거리 존 기반 극좌표 분산 배치
  spawnItems() {
    const { ZONES } = GameConfig.ITEM;
    const cx = GameConfig.PLAYER.START_X;
    const cy = GameConfig.PLAYER.START_Y;
    const MW = GameConfig.MAP.WIDTH;
    const MH = GameConfig.MAP.HEIGHT;

    for (const zone of ZONES) {
      for (let i = 0; i < zone.COUNT; i++) {
        let x, y;
        if (zone.GLOBAL) {
          // 맵 전체 랜덤 배치 (SWIFT 계열)
          x = Phaser.Math.Between(0, MW);
          y = Phaser.Math.Between(0, MH);
        } else {
          // 플레이어 스폰 기준 극좌표 — 맵 경계 클램프
          const angle = Math.random() * Math.PI * 2;
          const r     = Phaser.Math.Between(zone.R_MIN, zone.R_MAX);
          x = Phaser.Math.Clamp(Math.round(cx + Math.cos(angle) * r), 0, MW);
          y = Phaser.Math.Clamp(Math.round(cy + Math.sin(angle) * r), 0, MH);
        }
        const type = zone.TYPES[Phaser.Math.Between(0, zone.TYPES.length - 1)];
        this._items.push(new Item(this._scene, x, y, type));
      }
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
