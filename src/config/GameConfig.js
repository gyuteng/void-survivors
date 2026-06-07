// 게임 전역 설정 — 모든 수치는 여기서 관리, 하드코딩 금지

const GameConfig = {
  // 캔버스 해상도
  WIDTH: 480,
  HEIGHT: 854,

  // 색상 팔레트
  COLOR: {
    BACKGROUND: 0x0a0a0f,
    GRID:       0x1a1a2e,
    PLAYER:     0xffffff,
    ENEMY:      0xff4444,
    BOSS:       0xff0000,
    ITEM:       0x00ffcc,
    UI:         0xffffff,
    EXP:        0xffd700,
  },

  // 격자 설정
  GRID: {
    CELL_SIZE: 48,   // 격자 한 칸 크기(px)
    LINE_ALPHA: 0.3, // 격자선 투명도
  },

  // 플레이어 설정
  PLAYER: {
    RADIUS: 16,       // 원 반지름(px)
    SPEED: 220,       // 이동속도(px/초)
    START_X: 240,     // 초기 X 위치
    START_Y: 427,     // 초기 Y 위치 (화면 중앙)
  },

  // 자동 공격 설정
  ATTACK: {
    FIRE_RATE:   800,  // 발사 간격(ms)
    PROJ_SPEED:  400,  // 투사체 속도(px/초)
    PROJ_RADIUS: 5,    // 투사체 반지름(px)
  },

  // 씬 전환 딜레이(ms)
  BOOT_DELAY: 500,
};
