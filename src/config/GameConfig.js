// 게임 전역 설정 — 모든 수치는 여기서 관리, 하드코딩 금지

const GameConfig = {
  WIDTH:  480,
  HEIGHT: 854,

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

  GRID: {
    CELL_SIZE:  48,
    LINE_ALPHA: 0.3,
  },

  // 맵 크기 (뷰포트와 독립)
  MAP: {
    WIDTH:  4800,
    HEIGHT: 4800,
  },

  // 플레이어 기본 스탯
  PLAYER: {
    RADIUS:       16,
    START_X:      2400,
    START_Y:      2400,
    SPEED:        220,   // 이동속도(px/초)
    MAX_HP:       100,
    HP_REGEN:     0,     // 초당 자연 회복량
    SHIELD:       0,     // 피해 흡수 보호막
    ARMOR:        0,     // 피해 감소 수치
    EVASION:      0,     // 회피율 (0~1)
    LIFESTEAL:    0,     // 흡혈 비율 (0~1)
    PICKUP_RANGE: 50,    // 아이템 획득 범위(px)
  },

  // 무기 기본 스탯
  WEAPON: {
    DAMAGE:             10,
    CRIT_CHANCE:        0.05,  // 치명타 확률 (0~1)
    CRIT_DAMAGE:        1.5,   // 치명타 배율
    ATTACK_SPEED:       1.0,   // 공격 속도 배율
    PROJECTILE_COUNT:   1,
    PROJECTILE_BOUNCES: 0,     // 관통 횟수
    PROJECTILE_SPEED:   1.0,   // 투사체 속도 배율
    SIZE:               1.0,   // 투사체 크기 배율
    KNOCKBACK:          1.0,   // 넉백 배율
  },

  // 기타 스탯
  MISC: {
    LUCK:     0,     // 행운 (희귀 아이템 확률에 영향)
    XP_GAIN:  1.0,   // 경험치 획득 배율
    DURATION: 1.0,   // 효과 지속시간 배율
  },

  // Void Survivors 고유 스탯
  UNIQUE: {
    RIFT_GAUGE:     0,    // 균열 게이지 현재값
    RIFT_GAUGE_MAX: 100,  // 균열 게이지 최대값
    PURITY:         0,    // 순수도 (계열 혼합도 역수)
  },

  // 자동 공격 설정
  ATTACK: {
    FIRE_RATE:   800,  // 발사 간격(ms)
    PROJ_SPEED:  400,  // 투사체 속도(px/초)
    PROJ_RADIUS: 5,    // 투사체 반지름(px)
    PROJ_RANGE:  800,  // 최대 사거리(px) — 발사 지점 기준 거리로 소멸
  },

  // 웨이브 시스템 설정
  WAVE: {
    PREP_DURATION:   45000,  // 준비 페이즈 시간(ms)
    CLEAR_DELAY:      2000,  // 웨이브 클리어 후 대기(ms)
    BASE_COUNT:          5,  // 웨이브 1 적 수
    COUNT_INCREMENT:     3,  // 웨이브마다 추가 적 수
    SPAWN_MARGIN:       40,  // 화면 밖 스폰 여백(px)
    ENEMY_SPEED:        80,  // 적 이동속도 — DDA 적용 전 기준값
    ENEMY_HP:            3,  // 적 HP — DDA 적용 전 기준값
    ENEMY_RADIUS:       20,  // 충돌 반지름(px)
  },

  // 적 스케일링 (구간별 배율)
  ENEMY_SCALING: {
    BASE_HP:       30,
    BASE_SPEED:    80,
    BASE_DAMAGE:   10,
    SCALE_EARLY:   1.2,  // 웨이브 1~3
    SCALE_MID:     1.5,  // 웨이브 4~6
    SCALE_LATE:    2.0,  // 웨이브 7~9
    SCALE_ENDGAME: 2.5,  // 웨이브 10+
  },

  // 보스 설정
  BOSS: {
    HP:         30,   // 보스 체력 — DDA 적용 전 기준값
    SPEED:      50,   // 이동속도 — DDA 적용 전 기준값
    SIZE:       40,   // 사각형 한 변 절반(px)
    RADIUS:     44,   // 충돌 반지름(px)
    WAVE_CYCLE:  3,   // 몇 웨이브마다 보스 등장
  },

  // 보스 스케일링
  BOSS_SCALING: {
    BASE_HP:          900,
    SCALE_MULTIPLIER: 4.0,   // 등장마다 HP 배율
    BASE_DAMAGE:       20,
    DAMAGE_SCALE:      1.4,  // 등장마다 데미지 배율
  },

  // 아이템 시스템 설정
  ITEM: {
    RADIUS:          10,
    PICKUP_RADIUS:   30,  // 획득 판정 거리(px) — ItemSystem 호환용
    TIER1_THRESHOLD:  3,
    TIER2_THRESHOLD:  5,
    TYPES: ['VOID', 'FLAME', 'FROST', 'THUNDER', 'SWIFT'],
    COLOR: {
      VOID:    0xffffff,
      FLAME:   0xff6600,
      FROST:   0x00ccff,
      THUNDER: 0xffd700,
      SWIFT:   0x00ff88,
    },
    ZONES: [
      { R_MIN:    0, R_MAX: 1500, COUNT: 12, TYPES: ['FLAME', 'FROST', 'VOID', 'THUNDER'], GLOBAL: false },
      { R_MIN: 1500, R_MAX: 2200, COUNT: 12, TYPES: ['VOID', 'THUNDER', 'FLAME'],          GLOBAL: false },
      { R_MIN: 2200, R_MAX: 3400, COUNT: 12, TYPES: ['VOID', 'FLAME', 'FROST', 'THUNDER'], GLOBAL: false },
      { R_MIN: 1500, R_MAX: 2500, COUNT:  2, TYPES: ['SWIFT'],                             GLOBAL: false },
    ],
  },

  // 계열 시스템 임계값
  ITEM_TIER: {
    EFFECT_1_COUNT:  3,  // 첫 번째 효과 발동 개수
    EFFECT_2_COUNT:  5,  // 두 번째 효과 발동 개수
    EVOLUTION_COUNT: 8,  // 2차 진화 개수
  },

  // DDA — 동적 난이도 조정
  DDA: {
    MODIFIER_INIT:  1.0,
    MODIFIER_MIN:   0.5,
    MODIFIER_MAX:   2.0,
    CLEAR_TIME_REF: 30000,  // 기준 클리어 시간(ms)
    HP_EASY:        0.8,
    HP_HARD:        0.4,
    SCALE_EASY:     1.3,
    SCALE_HARD:     0.8,
    HP_GROWTH:      1.2,    // 웨이브당 적 HP 성장률
    SPEED_GROWTH:   1.1,    // 웨이브당 적 속도 성장률
  },

  // 경험치
  XP: {
    BASE_REQUIRED:    100,
    LEVEL_MULTIPLIER: 1.2,  // 레벨마다 필요 경험치 증가 배율
    ENEMY_DROP_MIN:     1,
    ENEMY_DROP_MAX:     3,
    BOSS_DROP_MIN:     10,
    BOSS_DROP_MAX:     15,
    HP_PER_LEVEL:       5,  // 레벨업마다 HP 증가량
  },

  // 아이템 희귀도 가중치
  RARITY: {
    COMMON:    { WEIGHT: 60, COLOR: '#ffffff' },
    RARE:      { WEIGHT: 30, COLOR: '#00ffcc' },
    LEGENDARY: { WEIGHT: 10, COLOR: '#ffd700' },
  },

  // 레벨업 선택지
  LEVELUP: {
    CHOICE_COUNT:      3,
    CURRENT_TIER_PROB: 0.70,  // 보유 계열 강화 확률
    NEW_TIER_PROB:     0.20,  // 새 계열 아이템 확률
    LEGENDARY_PROB:    0.10,  // 희귀 효과 확률
    PANEL_WIDTH:     360,
    PANEL_HEIGHT:    110,
    PANEL_GAP:        18,
    PANEL_RADIUS:     12,
    PANEL_COLOR:  0x1a1a2e,
    PANEL_ALPHA:    0.95,
    OVERLAY_ALPHA:  0.75,
    FONT_TITLE:       20,
    FONT_DESC:        14,
    HOVER_COLOR:  0x2a2a4e,
  },

  BOOT_DELAY: 500,
};
