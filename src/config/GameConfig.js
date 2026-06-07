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

  // 맵 크기 (뷰포트와 독립)
  MAP: {
    WIDTH:  4800,  // 전체 맵 너비(px)
    HEIGHT: 4800,  // 전체 맵 높이(px)
  },

  // 플레이어 설정
  PLAYER: {
    RADIUS: 16,       // 원 반지름(px)
    SPEED: 220,       // 이동속도(px/초)
    START_X: 2400,    // 초기 X 위치 (맵 중앙)
    START_Y: 2400,    // 초기 Y 위치 (맵 중앙)
  },

  // 자동 공격 설정
  ATTACK: {
    FIRE_RATE:   800,  // 발사 간격(ms)
    PROJ_SPEED:  400,  // 투사체 속도(px/초)
    PROJ_RADIUS: 5,    // 투사체 반지름(px)
  },

  // 웨이브 시스템 설정
  WAVE: {
    PREP_DURATION:   45000, // 준비 페이즈 시간(ms)
    CLEAR_DELAY:      2000, // 웨이브 클리어 후 다음 웨이브 대기(ms)
    BASE_COUNT:           5, // 웨이브 1 적 수
    COUNT_INCREMENT:      3, // 웨이브마다 추가되는 적 수
    SPAWN_MARGIN:        40, // 화면 밖 스폰 여백(px)
    ENEMY_SPEED:         80, // 적 이동속도(px/초)
    ENEMY_HP:             3, // 적 기본 HP
    ENEMY_RADIUS:        20, // 충돌 반지름(px)
  },

  // 보스 설정
  BOSS: {
    HP:          30,   // 보스 체력
    SPEED:       50,   // 이동속도(px/초)
    SIZE:        40,   // 사각형 한 변 절반(px) — 실제 크기 80×80
    RADIUS:      44,   // 충돌 반지름(px)
    WAVE_CYCLE:   3,   // 몇 웨이브마다 보스 스폰
  },

  // 아이템 시스템 설정
  ITEM: {
    RADIUS:           10,   // 도형 반지름(px)
    PICKUP_RADIUS:    30,   // 획득 판정 거리(px)
    TIER1_THRESHOLD:   3,   // 1단계 효과 발동 개수
    TIER2_THRESHOLD:   5,   // 2단계 효과 발동 개수
    TYPES: ['VOID', 'FLAME', 'FROST', 'THUNDER', 'SWIFT'],
    COLOR: {
      VOID:    0xffffff,
      FLAME:   0xff6600,
      FROST:   0x00ccff,
      THUNDER: 0xffd700,
      SWIFT:   0x00ff88,  // 빠른 계열 — 밝은 초록
    },
    // 거리 존 기반 분산 배치 (총 38개) — R_MIN/R_MAX: 플레이어 스폰 기준 반경(px)
    ZONES: [
      { R_MIN:    0, R_MAX: 1500, COUNT: 12, TYPES: ['FLAME', 'FROST', 'VOID', 'THUNDER'],    GLOBAL: false }, // 근거리 기본 (4계열)
      { R_MIN: 1500, R_MAX: 2200, COUNT: 12, TYPES: ['VOID', 'THUNDER', 'FLAME'],             GLOBAL: false }, // 중거리 2A (점진적 계열 노출)
      { R_MIN: 2200, R_MAX: 3400, COUNT: 12, TYPES: ['VOID', 'FLAME', 'FROST', 'THUNDER'],   GLOBAL: false }, // 중거리 2B → 원거리 강한 계열
      { R_MIN: 1500, R_MAX: 2500, COUNT:  2, TYPES: ['SWIFT'],                               GLOBAL: false }, // SWIFT — 중거리 반경 한정
    ],
  },

  // 레벨업 선택지 설정
  LEVELUP: {
    CHOICE_COUNT:    3,    // 제시할 선택지 수
    PANEL_WIDTH:   360,    // 선택지 패널 너비(px)
    PANEL_HEIGHT:  110,    // 선택지 패널 높이(px)
    PANEL_GAP:      18,    // 패널 간 간격(px)
    PANEL_RADIUS:   12,    // 패널 모서리 반지름(px)
    PANEL_COLOR: 0x1a1a2e, // 패널 배경색
    PANEL_ALPHA:   0.95,   // 패널 투명도
    OVERLAY_ALPHA: 0.75,   // 어두운 오버레이 투명도
    FONT_TITLE:     20,    // 선택지 제목 폰트 크기
    FONT_DESC:      14,    // 선택지 설명 폰트 크기
    HOVER_COLOR: 0x2a2a4e, // 호버 시 패널 색상
  },

  // 씬 전환 딜레이(ms)
  BOOT_DELAY: 500,
};
