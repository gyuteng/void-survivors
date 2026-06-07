// 부트 씬 — 에셋 프리로드 후 GameScene으로 전환

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // MVP는 Phaser 도형만 사용하므로 외부 에셋 없음
  }

  create() {
    // 프리로드 완료 후 게임 씬으로 전환
    this.time.delayedCall(GameConfig.BOOT_DELAY, () => {
      this.scene.start('GameScene');
    });
  }
}
