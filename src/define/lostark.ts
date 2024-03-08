type MainClassInfo = {
  [key: string]: {
    value: string;
    label: string;
  }
}

type ClassInfo = {
  [key: string]: {
    value: string;
    label: string;
    mainClass: string;
    imageUrl: string;
  }
}

const mainClassInfo: MainClassInfo = {
  Warrior: { value: 'Warrior', label: '전사' },
  MartialArtist: { value: 'MartialArtist', label: '무도가' },
  Gunner: { value: 'Gunner', label: '헌터' },
  Mage: { value: 'Mage', label: '마법사' },
  Assassin: { value: 'Assassin', label: '암살자' },
  Specialist: { value: 'Specialist', label: '스페셜리스트' },
}

const classInfo: ClassInfo = {
  // start 전사
  Berserker: {
    value: 'Berserker',
    label: '버서커',
    mainClass: 'Warrior',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/berserker_m.png',
  },
  Destroyer: {
    value: 'Destroyer',
    label: '디스트로이어',
    mainClass: 'Warrior',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/destroyer_m.png',
  },
  Warlord: {
    value: 'Warlord',
    label: '워로드',
    mainClass: 'Warrior',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/warlord_m.png',
  },
  HolyKnight: {
    value: 'HolyKnight',
    label: '홀리나이트',
    mainClass: 'Warrior',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/holyknight_m.png',
  },
  Slayer: {
    value: 'Slayer',
    label: '슬레이어',
    mainClass: 'Warrior',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/berserker_female.png',
  },
  // end 전사
  // start 무도가
  BattleMaster: {
    value: 'BattleMaster',
    label: '배틀마스터',
    mainClass: 'MartialArtist',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/battle_master_m.png',
  },
  Infighter: {
    value: 'Infighter',
    label: '인파이터',
    mainClass: 'MartialArtist',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/infighter_m.png',
  },
  ForceMaster: {
    value: 'ForceMaster',
    label: '기공사',
    mainClass: 'MartialArtist',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/force_master_m.png',
  },
  LanceMaster: {
    value: 'LanceMaster',
    label: '창술사',
    mainClass: 'MartialArtist',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/lance_master_m.png',
  },
  Striker: {
    value: 'Striker',
    label: '스트라이커',
    mainClass: 'MartialArtist',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/battle_master_male_m.png',
  },
  Breaker: {
    value: 'Breaker',
    label: '브레이커',
    mainClass: 'MartialArtist',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/infighter_male.png',
  },
  // end 무도가
  // start 헌터
  DevilHunter: {
    value: 'DevilHunter',
    label: '데빌헌터',
    mainClass: 'Gunner',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/devil_hunter_m.png',
  },
  Blaster: {
    value: 'Blaster',
    label: '블래스터',
    mainClass: 'Gunner',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/blaster_m.png',
  },
  HawkEye: {
    value: 'HawkEye',
    label: '호크아이',
    mainClass: 'Gunner',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/hawk_eye_m.png',
  },
  Scouter: {
    value: 'Scouter',
    label: '스카우터',
    mainClass: 'Gunner',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/scouter.png',
  },
  Gunslinger: {
    value: 'Gunslinger',
    label: '건슬링어',
    mainClass: 'Gunner',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/devil_hunter_female_m.png',
  },
  // end 헌터
  // start 마법사
  Arcana: {
    value: 'Arcana',
    label: '아르카나',
    mainClass: 'Mage',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/arcana_m.png',
  },
  Summoner: {
    value: 'Summoner',
    label: '서머너',
    mainClass: 'Mage',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/summoner_m.png',
  },
  Bard: {
    value: 'Bard',
    label: '바드',
    mainClass: 'Mage',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/bard_m.png',
  },
  Sorceress: {
    value: 'Sorceress',
    label: '소서리스',
    mainClass: 'Mage',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/elemental_master_m.png',
  },
  // end 마법사
  // start 암살자
  Demonic: {
    value: 'Demonic',
    label: '데모닉',
    mainClass: 'Assassin',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/demonic_m.png',
  },
  Blade: {
    value: 'Blade',
    label: '블레이드',
    mainClass: 'Assassin',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/blade_m.png',
  },
  Reaper: {
    value: 'Reaper',
    label: '리퍼',
    mainClass: 'Assassin',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/reaper_m.png',
  },
  SoulEater: {
    value: 'SoulEater',
    label: '소울이터',
    mainClass: 'Assassin',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/soul_eater.png',
  },
  // end 암살자
  // start 스페셜리스트
  Dohwaga: {
    value: 'Dohwaga',
    label: '도화가',
    mainClass: 'Specialist',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/yinyangshi_m.png',
  },
  WeatherArtist: {
    value: 'WeatherArtist',
    label: '기상술사',
    mainClass: 'Specialist',
    imageUrl: 'https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/weather_artist_m.png',
  },
  // end 스페셜리스트
}

const LOSTARK = {
  mainClassInfo: mainClassInfo,
  classInfo: classInfo,
}

export default LOSTARK;