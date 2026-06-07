// 계열별 수치 및 시너지 — GameConfig에 병합 (GameConfig.js 이후 로드 필수)

Object.assign(GameConfig, {
  // Void 계열
  VOID: {
    SIZE_BONUS:      1.5,  // 3개: 투사체 크기 배율
    LIFESTEAL_BONUS: 1,    // 5개 극강: 피격 시 HP 회복량
  },

  // Flame 계열
  FLAME: {
    EXPLOSION_RANGE: 100,  // 3개: 폭발 범위(px)
    BURN_DAMAGE:       5,  // 5개 극강: 화상 초당 데미지
    BURN_DURATION:     3,  // 화상 지속시간(초)
  },

  // Frost 계열
  FROST: {
    SLOW_AMOUNT:     0.3,  // 3개: 이동속도 감소 비율
    FREEZE_DURATION:   2,  // 5개 극강: 빙결 지속시간(초)
    FROZEN_DMG_MULT: 2.0,  // 빙결 중 피해 배율
  },

  // Thunder 계열
  THUNDER: {
    CHAIN_COUNT:      3,   // 3개: 연쇄 횟수
    CHAIN_RANGE:    150,   // 연쇄 범위(px)
    CHAIN_DMG_DECAY: 0.8,  // 연쇄마다 데미지 감소 비율
  },

  // Swift 계열
  SWIFT: {
    SPEED_BONUS:  0.2,  // 획득마다 이동속도 증가 비율
    MAX_STACK:      3,  // 최대 중첩 횟수
    SPEED_TO_DMG: 0.5,  // 이동속도 → 공격력 변환 비율
  },

  // 계열 시너지
  SYNERGY: {
    VOID_THUNDER_CHAIN_BONUS:    2,     // 추가 연쇄 횟수
    FLAME_FROST_DMG_MULT:       2.0,    // 빙결 적 폭발 데미지 배율
    FROST_THUNDER_FREEZE_CHAIN: true,   // 빙결 + 연쇄 동시 발동
    VOID_FLAME_BURN_ON_PIERCE:  true,   // 관통 시 화상 적용
    SWIFT_THUNDER_TRAIL:        true,   // 이동 시 번개 흔적 생성
  },
});
