export type TColorAuditItem = {
  expression: string;
  sources: string[];
  note?: string;
  swatch?: string;
  decision?: TColorDecision;
};

export type TColorDecision = {
  kind: 'common-token' | 'domain-token' | 'keep-local' | 'keep-external' | 'fix';
  label: string;
  reason: string;
  tokenName?: string;
};

export type TColorAuditSection = {
  title: string;
  description: string;
  items: TColorAuditItem[];
  decision?: TColorDecision;
};

type TColorPalette = {
  name: string;
  description: string;
  colors: Array<{
    step: number;
    value: string;
  }>;
};

const SOURCE = {
  header: 'src/components/common/header/header.module.scss',
  quality: 'src/utils/lostark.ts',
  summary: 'src/app/lostark/my-characters/_component/specSummaryPanel/',
  mainCharacter: 'src/app/lostark/my-characters/_component/mainCharactersPanel/section/',
  clearGold: 'src/app/lostark/clear-gold/_component/levelGoldPanel.module.scss',
  material: 'src/app/lostark/refining/_component/refiningMaterialInputPanel.module.scss',
  manifest: 'src/app/manifest.ts',
} as const;

export const PROJECT_PALETTES: TColorPalette[] = [
  {
    name: 'Mint',
    description: '현재 활성·성공·긍정 상태에 사용하는 기본 강조 팔레트입니다.',
    colors: [
      { step: 100, value: '#e6fffa' },
      { step: 200, value: '#bbf7d0' },
      { step: 300, value: '#86efac' },
      { step: 400, value: '#4ade80' },
      { step: 500, value: '#10b981' },
      { step: 600, value: '#059669' },
      { step: 700, value: '#047857' },
      { step: 800, value: '#065f46' },
      { step: 900, value: '#14532d' },
    ],
  },
  {
    name: 'Rose',
    description: '현재 오류·위험·제거 같은 부정 상태에 사용하는 강조 팔레트입니다.',
    colors: [
      { step: 100, value: '#fff1f2' },
      { step: 200, value: '#ffe4e6' },
      { step: 300, value: '#fca5a5' },
      { step: 400, value: '#fb7185' },
      { step: 500, value: '#f43f5e' },
      { step: 600, value: '#e11d48' },
      { step: 700, value: '#be123c' },
      { step: 800, value: '#9f1239' },
      { step: 900, value: '#4c0519' },
    ],
  },
  {
    name: 'Amber',
    description: '주의·안내처럼 오류보다 낮은 우선순위의 상태에 사용하는 강조 팔레트입니다.',
    colors: [
      { step: 100, value: '#fef3c7' },
      { step: 200, value: '#fde68a' },
      { step: 300, value: '#fcd34d' },
      { step: 400, value: '#fbbf24' },
      { step: 500, value: '#f59e0b' },
      { step: 600, value: '#d97706' },
      { step: 700, value: '#b45309' },
      { step: 800, value: '#92400e' },
      { step: 900, value: '#78350f' },
    ],
  },
  {
    name: 'Gray',
    description: '페이지·카드·테두리·텍스트의 명도 위계를 구성하는 중립 팔레트입니다.',
    colors: [
      { step: 100, value: '#f4f4f6' },
      { step: 200, value: '#e2e2e6' },
      { step: 300, value: '#c4c4cc' },
      { step: 400, value: '#8f9099' },
      { step: 500, value: '#62636c' },
      { step: 600, value: '#45464e' },
      { step: 700, value: '#34343b' },
      { step: 800, value: '#27272a' },
      { step: 900, value: '#18181b' },
    ],
  },
];

export const COLOR_AUDIT_SECTIONS: TColorAuditSection[] = [
  {
    title: '앱 UI 정적 리터럴',
    description: '_variables.scss 외에 코드와 SCSS에 직접 적힌 색상입니다.',
    items: [
      {
        expression: '#15181d',
        swatch: '#15181d',
        sources: [
          `${SOURCE.mainCharacter}legendaryAvatarSection.module.scss`,
          `${SOURCE.mainCharacter}profileImageSection.module.scss`,
          `${SOURCE.mainCharacter}engravingSection.module.scss`,
        ],
        decision: {
          kind: 'domain-token',
          label: 'Lost Ark 도메인 토큰 후보',
          reason: '메인 캐릭터 카드의 공통 어두운 표면으로 반복됩니다.',
          tokenName: '$lostark-character-surface',
        },
      },
    ],
  },
  {
    title: 'Lost Ark 등급 색상 체계',
    description: '아이템·효과·품질에 걸쳐 나타나는 게임 등급 위계 색상을 함께 검토합니다.',
    items: [
      {
        expression: '#fe9600 · #ce43fc · #00b5ff',
        swatch: 'linear-gradient(90deg, #fe9600, #ce43fc, #00b5ff)',
        sources: [`${SOURCE.summary}AccessorySection.tsx`],
        decision: {
          kind: 'domain-token',
          label: 'Lost Ark 도메인 토큰 후보',
          reason: '악세서리 티어 표시에만 쓰이는 명확한 도메인 팔레트입니다.',
          tokenName: 'LOSTARK_ACCESSORY_TIER_COLORS',
        },
      },
      {
        expression: '#ea6811cc · #df18e3cc · #1260ebcc · #09ae09cc',
        swatch: 'linear-gradient(90deg, #ea6811cc, #df18e3cc, #1260ebcc, #09ae09cc)',
        sources: [SOURCE.quality],
        decision: {
          kind: 'domain-token',
          label: 'Lost Ark 도메인 토큰 후보',
          reason: 'TypeScript에서 계산해 반환하는 장비 품질 배경색입니다.',
          tokenName: 'LOSTARK_QUALITY_BACKGROUND_COLORS',
        },
      },
    ],
  },
  {
    title: '토큰 기반 색상 및 rgba 조합',
    description: '눈에는 보이지만 기존 Sass 토큰 또는 그 알파 합성으로 구성한 값입니다.',
    decision: {
      kind: 'keep-local',
      label: '현 상태 유지',
      reason:
        '의미 토큰으로 대체할 수 없는 투명 표면만 유지합니다.',
    },
    items: [
      {
        expression: 'rgba($rose-600, 0.28) · rgba($rose-900, 0.35 · 0.58) · rgba($rose-400, 0.12)',
        swatch: 'rgba(225, 29, 72, 0.28)',
        sources: [
          'src/components/common/toast/toastContainer.module.scss',
          'src/app/maplestory/equipment/_component/equipmentTable.module.scss',
          'src/app/maplestory/union/_component/unionCharacterRow.module.scss',
          SOURCE.clearGold,
        ],
      },
      {
        expression: 'rgba($gray-600, 0.88) · rgba($white, 0.04 · 0.12)',
        swatch: 'rgba(69, 70, 78, 0.88)',
        sources: [
          'src/components/common/toast/toastContainer.module.scss',
          'src/app/maplestory/equipment/_component/equipmentTable.module.scss',
        ],
      },
      {
        expression: '$mint-ghost',
        swatch: 'rgba(74, 222, 128, 0.1)',
        sources: [
          'src/app/lostark/refining/_component/refiningResult.module.scss',
          'src/app/settings/_component/settingsSection.module.scss',
        ],
      },
    ],
  },
  {
    title: 'PWA manifest',
    description: '설치형 웹 앱의 브라우저 테마 및 배경 설정입니다.',
    decision: {
      kind: 'keep-external',
      label: '외부 소비자 값으로 유지',
      reason:
        'manifest의 브라우저 메타데이터는 Sass 변수를 직접 읽지 못합니다. 화면 토큰과 강제 동기화하지 않습니다.',
    },
    items: [
      {
        expression: '#18181b',
        swatch: '#18181b',
        sources: [SOURCE.manifest],
        note: 'background_color, theme_color',
      },
    ],
  },
];

export const RUNTIME_COLOR_TRACE: TColorAuditSection = {
  title: 'Lost Ark API 런타임 게임 데이터',
  description:
    '아래 값은 변수나 고정 팔레트가 아닙니다. 게임 API 응답에 따라 달라지는 표시용 예시입니다.',
  decision: {
    kind: 'keep-external',
    label: '게임 데이터 그대로 유지',
    reason: 'API가 보내는 표시값이므로 앱 토큰으로 치환하면 원문 정보가 손실됩니다.',
  },
  items: [
    {
      expression: '예시 #FE9600',
      swatch: '#FE9600',
      sources: [
        'supabase/functions/lostark-character-details/index.ts: getColoredEffects() / <FONT COLOR> parse',
        'src/api/lostark/type.ts: TLostarkColoredEffect',
        'src/api/lostark/index.ts: summary 저장·재조회',
        'src/app/lostark/my-characters/_component/mainCharactersPanel/section/EquipmentSection.tsx',
        'src/app/lostark/my-characters/_component/mainCharactersPanel/section/ExtraEquipmentSection.tsx',
        'src/app/lostark/my-characters/_component/specSummaryPanel/AccessorySection.tsx',
        'src/app/lostark/my-characters/_component/specSummaryPanel/BraceletSection.tsx',
      ],
    },
    {
      expression: '예시 #99FF99',
      swatch: '#99FF99',
      note: '팔찌 옵션을 합쳐 표시하는 특수 게임 데이터 값',
      sources: [
        'supabase/functions/lostark-character-details/index.ts: <FONT COLOR> parse',
        'src/api/lostark/type.ts: TLostarkColoredEffect',
        'src/api/lostark/index.ts: summary 저장·재조회',
        'src/app/lostark/my-characters/_component/mainCharactersPanel/section/ExtraEquipmentSection.tsx',
        'src/app/lostark/my-characters/_component/specSummaryPanel/BraceletSection.tsx',
      ],
    },
    {
      expression: '예시 #00B5FF',
      swatch: '#00B5FF',
      sources: [
        'supabase/functions/lostark-character-details/index.ts: response summary 구성',
        'src/api/lostark/type.ts: TLostarkColoredEffect',
        'src/api/lostark/index.ts: summary 저장·재조회',
        'src/app/lostark/my-characters/_component/mainCharactersPanel/section/EquipmentSection.tsx',
        'src/app/lostark/my-characters/_component/specSummaryPanel/AccessorySection.tsx',
      ],
    },
  ],
};
