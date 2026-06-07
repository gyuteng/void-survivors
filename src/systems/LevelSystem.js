// 레벨업 시스템 — 웨이브 클리어 시 선택지 표시 및 선택 처리

class LevelSystem {
  constructor(scene, itemSystem) {
    this._scene      = scene;
    this._itemSystem = itemSystem;
    this._active     = false; // 선택지 표시 중 여부
    this._uiObjects  = [];    // 정리용 UI 오브젝트 목록

    // 웨이브 클리어 이벤트 수신
    this._scene.events.on('wave:clear', this._onWaveClear, this);
  }

  // 웨이브 클리어 시 호출 — GameScene.update()에서 active 플래그로 일시정지
  _onWaveClear() {
    if (this._active) return;
    this._active = true;
    this._showChoices();
  }

  // 선택지 3개 랜덤 생성 후 화면에 표시
  _showChoices() {
    const cfg  = GameConfig.LEVELUP;
    const W    = GameConfig.WIDTH;
    const H    = GameConfig.HEIGHT;

    // 어두운 오버레이
    const overlay = this._scene.add.rectangle(0, 0, W, H, 0x000000, cfg.OVERLAY_ALPHA)
      .setOrigin(0, 0).setDepth(10).setInteractive();
    this._uiObjects.push(overlay);

    // 제목 텍스트
    const title = this._scene.add.text(W / 2, 80, '— 강화 선택 —', {
      fontSize: `${cfg.FONT_TITLE + 4}px`,
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5).setDepth(11);
    this._uiObjects.push(title);

    const choices  = this._buildChoices();
    const totalH   = choices.length * cfg.PANEL_HEIGHT + (choices.length - 1) * cfg.PANEL_GAP;
    const startY   = (H - totalH) / 2;

    choices.forEach((choice, idx) => {
      const panelY = startY + idx * (cfg.PANEL_HEIGHT + cfg.PANEL_GAP) + cfg.PANEL_HEIGHT / 2;
      this._createPanel(choice, W / 2, panelY, idx);
    });
  }

  // 선택지 목록 생성 — 계열별 아이템 추가 + 강화 옵션 섞기
  _buildChoices() {
    const types   = [...GameConfig.ITEM.TYPES];
    const counts  = this._itemSystem.counts;
    const pool    = [];

    // 보유 중인 계열 → 강화 옵션
    for (const type of types) {
      if (counts[type] > 0) {
        pool.push({ kind: 'UPGRADE', type, label: `${type} 강화`, desc: `${type} 계열 아이템 +1 (현재 ${counts[type]}개)` });
      }
    }

    // 새 계열 획득 옵션
    for (const type of types) {
      pool.push({ kind: 'NEW', type, label: `${type} 획득`, desc: `${type} 계열 아이템 추가` });
    }

    // 셔플 후 CHOICE_COUNT 개 반환
    Phaser.Utils.Array.Shuffle(pool);
    return pool.slice(0, GameConfig.LEVELUP.CHOICE_COUNT);
  }

  // 개별 선택지 패널 생성
  _createPanel(choice, cx, cy, idx) {
    const cfg   = GameConfig.LEVELUP;
    const hw    = cfg.PANEL_WIDTH  / 2;
    const hh    = cfg.PANEL_HEIGHT / 2;
    const color = GameConfig.ITEM.COLOR[choice.type] || 0xffffff;

    // 패널 배경
    const bg = this._scene.add.graphics().setDepth(11);
    this._drawPanel(bg, cx, cy, cfg.PANEL_COLOR);
    this._uiObjects.push(bg);

    // 계열 색상 왼쪽 강조 바
    const bar = this._scene.add.graphics().setDepth(12);
    bar.fillStyle(color, 1);
    bar.fillRect(cx - hw + 8, cy - hh + 10, 5, cfg.PANEL_HEIGHT - 20);
    this._uiObjects.push(bar);

    // 선택지 제목
    const labelText = this._scene.add.text(cx - hw + 24, cy - 18, choice.label, {
      fontSize: `${cfg.FONT_TITLE}px`,
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0, 0.5).setDepth(12);
    this._uiObjects.push(labelText);

    // 선택지 설명
    const descText = this._scene.add.text(cx - hw + 24, cy + 16, choice.desc, {
      fontSize: `${cfg.FONT_DESC}px`,
      color: '#aaaaaa',
    }).setOrigin(0, 0.5).setDepth(12);
    this._uiObjects.push(descText);

    // 클릭 영역 (투명 직사각형)
    const hitArea = this._scene.add.rectangle(cx, cy, cfg.PANEL_WIDTH, cfg.PANEL_HEIGHT, 0xffffff, 0)
      .setDepth(13).setInteractive({ useHandCursor: true });
    this._uiObjects.push(hitArea);

    hitArea.on('pointerover', () => { this._drawPanel(bg, cx, cy, cfg.HOVER_COLOR); });
    hitArea.on('pointerout',  () => { this._drawPanel(bg, cx, cy, cfg.PANEL_COLOR); });
    hitArea.on('pointerdown', () => { this._select(choice, idx); });
  }

  // 패널 배경 그리기 (호버 시 색상 교체용 재사용)
  _drawPanel(g, cx, cy, color) {
    const { PANEL_WIDTH: pw, PANEL_HEIGHT: ph, PANEL_RADIUS: pr, PANEL_ALPHA: pa } = GameConfig.LEVELUP;
    g.clear();
    g.fillStyle(color, pa);
    g.fillRoundedRect(cx - pw / 2, cy - ph / 2, pw, ph, pr);
  }

  // 선택 확정 처리
  _select(choice, idx) {
    console.log(`[레벨업 선택] ${choice.label} (인덱스 ${idx})`);

    // 실제 효과는 미구현 — ItemSystem 카운트만 반영
    this._itemSystem.counts[choice.type] = (this._itemSystem.counts[choice.type] || 0) + 1;
    const newCount = this._itemSystem.counts[choice.type];
    console.log(`[레벨업 적용] ${choice.type} → ${newCount}개`);

    this._closeUI();
    this._scene.events.emit('levelup:done');
  }

  // UI 전부 제거 후 게임 재개
  _closeUI() {
    for (const obj of this._uiObjects) obj.destroy();
    this._uiObjects = [];
    this._active    = false;
  }

  get active() { return this._active; }
}
