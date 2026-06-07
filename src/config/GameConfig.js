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

  // 웨이브 시스템 설정
  WAVE: {
    PREP_DURATION:   30000, // 준비 페이즈 시간(ms)
    CLEAR_DELAY:      2000, // 웨이브 클리어 후 다음 웨이브 대기(ms)
    BASE_COUNT:           5, // 웨이브 1 적 수
    COUNT_INCREMENT:      3, // 웨이브마다 추가되는 적 수
    SPAWN_MARGIN:        40, // 화면 밖 스폰 여백(px)
    ENEMY_SPEED:         80, // 적 이동속도(px/초)
    ENEMY_HP:             3, // 적 기본 HP
    ENEMY_RADIUS:        20, // 충돌 반지름(px)
  },

  // 씬 전환 딜레이(ms)
  BOOT_DELAY: 500,
};
