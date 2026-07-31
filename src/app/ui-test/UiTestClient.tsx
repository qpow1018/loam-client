'use client';

import { useEffect, useState } from 'react';
import { MdAdd, MdDragIndicator, MdMoreHoriz } from 'react-icons/md';

import ClearGoldPanel from '@/app/lostark/clear-gold/_component/ClearGoldPanel';
import LevelGoldPanel from '@/app/lostark/clear-gold/_component/LevelGoldPanel';
import CharacterList from '@/app/lostark/all-characters/_component/CharacterList';
import LoaContentCell from '@/app/lostark/loado/_component/loadoTable/LoaContentCell';
import MainCharacterCard from '@/app/lostark/my-characters/_component/mainCharactersPanel/MainCharacterCard';
import { MOCK_REFINING_MARKET_PRICES } from '@/app/lostark/refining/_define/refiningMarketPrices';
import { REFINING_MATERIALS } from '@/app/lostark/refining/_define/refiningMaterials';
import RefiningConditionPanel from '@/app/lostark/refining/_component/RefiningConditionPanel';
import RefiningMaterialInputPanel from '@/app/lostark/refining/_component/RefiningMaterialInputPanel';
import type {
  TRefiningCondition,
  TRefiningMaterialInput,
  TRefiningMaterialInputs,
} from '@/app/lostark/refining/_type/refining';
import { getRefiningRule } from '@/app/lostark/refining/_util/refiningRules';
import type { TResLostarkCharacterSummary, TResLostarkMyCharacter } from '@/api/lostark/type';
import Button from '@/components/common/button/Button';
import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import DraggableList from '@/components/common/draggableList/DraggableList';
import DropdownMenu from '@/components/common/dropdownMenu/DropdownMenu';
import Checkbox from '@/components/common/form/Checkbox';
import Select from '@/components/common/form/Select';
import Textarea from '@/components/common/form/Textarea';
import TextInput from '@/components/common/form/TextInput';
import Header from '@/components/common/header/Header';
import BoxLoading from '@/components/common/loading/BoxLoading';
import FixedLoading from '@/components/common/loading/FixedLoading';
import Confirm from '@/components/common/modal/Confirm';
import Modal from '@/components/common/modal/Modal';
import Tabs from '@/components/common/tabs/Tabs';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';
import MemoCard from '@/components/memoTable/MemoCard';
import type { TMemo } from '@/types/memo';
import type { TTaskTableCellValue } from '@/types/taskTable';
import toast from '@/utils/toast';

import styles from './uiTestClient.module.scss';

const TAB_OPTIONS = [
  { value: 'overview', label: '개요' },
  { value: 'details', label: '상세 정보' },
  { value: 'history', label: '기록' },
] as const;

const BUTTON_GROUP_OPTIONS = [
  { value: 'weekly', label: '주간' },
  { value: 'monthly', label: '월간' },
  { value: 'all', label: '전체' },
] as const;

const SELECT_OPTIONS = [
  { value: 'normal', label: '일반' },
  { value: 'rare', label: '희귀' },
  { value: 'legendary', label: '전설' },
] as const;

const INITIAL_REFINING_CONDITION: TRefiningCondition = {
  equipmentGrade: 'aegir',
  equipmentType: 'weapon',
  fromLevel: 10,
  failureBonusRate: '0',
  artisanEnergy: '0',
};

const INITIAL_REFINING_MATERIALS = Object.fromEntries(
  Object.keys(REFINING_MATERIALS).map((id) => [id, { owned: '', isZeroPriced: false }]),
) as TRefiningMaterialInputs;

const INITIAL_LOSTARK_CHARACTERS: TResLostarkMyCharacter[] = [
  {
    id: 'ui-test-bard',
    nickname: '테스트바드',
    className: '바드',
    itemLevel: '1,760.00',
    isMain: true,
  },
  {
    id: 'ui-test-slayer',
    nickname: '테스트슬레이어',
    className: '슬레이어',
    itemLevel: '1,740.00',
  },
];

const INITIAL_LOADO_CELL: TTaskTableCellValue = {
  role: 'checkbox',
  cycleKey: 'ui-test',
  lastAccumulatedCycleKey: 'ui-test',
  resetPeriod: 'daily',
  checkboxState: 'unchecked',
  checkboxLabel: '가디언 토벌',
};

const SAMPLE_MAIN_CHARACTER_SUMMARY: TResLostarkCharacterSummary = {
  profiles: {
    characterName: '테스트바드',
    serverName: '아만',
    characterClassName: '바드',
    itemAvgLevel: '1,760.00',
    combatPower: '86,421,390',
    characterImage: null,
  },
  equipment: {
    gears: [
      {
        icon: null,
        name: null,
        type: '투구',
        grade: '고대',
        quality: 96,
        itemLevel: '1,760',
        enhancement: 20,
      },
      {
        icon: null,
        name: null,
        type: '어깨',
        grade: '고대',
        quality: 92,
        itemLevel: '1,760',
        enhancement: 20,
      },
      {
        icon: null,
        name: null,
        type: '상의',
        grade: '고대',
        quality: 99,
        itemLevel: '1,760',
        enhancement: 20,
      },
      {
        icon: null,
        name: null,
        type: '하의',
        grade: '고대',
        quality: 97,
        itemLevel: '1,760',
        enhancement: 20,
      },
      {
        icon: null,
        name: null,
        type: '장갑',
        grade: '고대',
        quality: 94,
        itemLevel: '1,760',
        enhancement: 20,
      },
      {
        icon: null,
        name: null,
        type: '무기',
        grade: '고대',
        quality: 100,
        itemLevel: '1,760',
        enhancement: 20,
      },
    ],
    accessories: [
      {
        icon: null,
        name: null,
        type: '목걸이',
        grade: '고대',
        quality: 99,
        basicEffects: ['지능 +19,820'],
        polishEffects: [],
      },
      {
        icon: null,
        name: null,
        type: '귀걸이',
        grade: '고대',
        quality: 97,
        basicEffects: ['지능 +19,820'],
        polishEffects: [],
      },
      {
        icon: null,
        name: null,
        type: '귀걸이',
        grade: '고대',
        quality: 96,
        basicEffects: ['지능 +19,820'],
        polishEffects: [],
      },
      {
        icon: null,
        name: null,
        type: '반지',
        grade: '고대',
        quality: 94,
        basicEffects: ['지능 +19,820'],
        polishEffects: [],
      },
      {
        icon: null,
        name: null,
        type: '반지',
        grade: '고대',
        quality: 92,
        basicEffects: ['지능 +19,820'],
        polishEffects: [],
      },
    ],
    abilityStone: {
      icon: null,
      name: null,
      type: '어빌리티 스톤',
      grade: '유물',
      abilityStoneBonusEffects: [],
      abilityStoneEngravings: [
        { name: '각성', level: 5 },
        { name: '전문의', level: 4 },
        { name: '중갑 착용', level: 2 },
      ],
    },
    bracelet: {
      icon: null,
      name: null,
      type: '팔찌',
      grade: '고대',
      braceletEffects: [{ text: '치명 +95', color: '99FF99' }],
    },
  },
  engravings: [
    { name: '각성', grade: '유물', level: 4, description: null, abilityStoneLevel: null },
    { name: '전문의', grade: '유물', level: 4, description: null, abilityStoneLevel: null },
  ],
  gems: [
    {
      icon: null,
      slot: 0,
      name: null,
      grade: '고대',
      level: 10,
      kind: '겁화',
      effectType: 'damage',
      skillName: null,
      effects: [],
      bonusEffect: null,
    },
    {
      icon: null,
      slot: 1,
      name: null,
      grade: '고대',
      level: 10,
      kind: '작열',
      effectType: 'cooldown',
      skillName: null,
      effects: [],
      bonusEffect: null,
    },
  ],
  arkPassive: {
    title: '깨달음',
    points: [{ name: '진화', value: 120, description: '전투 스킬의 효과가 강화됩니다.' }],
  },
  arkGrid: {
    cores: [{ icon: null, name: '질서의 해: 수호', grade: '고대', point: 3 }],
    effects: [{ name: '보스 피해', level: 5 }],
  },
  legendaryAvatars: [
    { icon: null, name: '찬란한 지혜의 머리장식', type: '머리', grade: '전설' },
    { icon: null, name: '찬란한 지혜의 의상', type: '상의', grade: '전설' },
  ],
};

const INITIAL_MEMO: TMemo = {
  id: 'ui-test-memo',
  title: '주간 메모',
  content: '수요일 초기화 전 에기르와 카멘 보상 확인',
};

export default function UiTestClient() {
  const [text, setText] = useState('테스트 입력값');
  const [textarea, setTextarea] = useState('공용 요소의 상태와 밀도를 한 화면에서 살펴봅니다.');
  const [selectedOption, setSelectedOption] = useState('normal');
  const [selectedTab, setSelectedTab] = useState<(typeof TAB_OPTIONS)[number]['value']>('overview');
  const [selectedGroup, setSelectedGroup] =
    useState<(typeof BUTTON_GROUP_OPTIONS)[number]['value']>('weekly');
  const [isChecked, setIsChecked] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFixedLoading, setIsFixedLoading] = useState(false);
  const [draggableItems, setDraggableItems] = useState(['카멘 하드', '에기르 하드', '베히모스']);
  const [refiningCondition, setRefiningCondition] = useState<TRefiningCondition>(
    INITIAL_REFINING_CONDITION,
  );
  const [refiningMaterials, setRefiningMaterials] = useState<TRefiningMaterialInputs>(
    INITIAL_REFINING_MATERIALS,
  );
  const [memo, setMemo] = useState<TMemo>(INITIAL_MEMO);
  const [lostarkCharacters, setLostarkCharacters] = useState<TResLostarkMyCharacter[]>(
    INITIAL_LOSTARK_CHARACTERS,
  );
  const [loadoCell, setLoadoCell] = useState<TTaskTableCellValue>(INITIAL_LOADO_CELL);

  const refiningMaterialIds = getRefiningRule(
    refiningCondition.equipmentGrade,
    refiningCondition.equipmentType,
    refiningCondition.fromLevel,
  ).inputMaterialIds;

  useEffect(() => {
    if (!isFixedLoading) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsFixedLoading(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFixedLoading]);

  return (
    <div className={styles['ui-test-page']}>
      <Header
        theme="mint"
        homeLink="/lostark/loado"
        primaryMenus={[
          { name: '컴포넌트', link: '/ui-test' },
          { name: '패턴', link: '/ui-test#patterns' },
        ]}
        gameSwitchMenu={{ name: '로스트아크', link: '/lostark/loado' }}
        settingsMenu={{ name: '설정', link: '/settings' }}
      />

      <main className={styles['content']}>
        <header className={styles['page-header']}>
          <div>
            <p className={styles['eyebrow']}>INTERNAL UI CATALOG</p>
            <h1>디자인 요소 테스트</h1>
            <p>현재 LoaM에서 사용 중인 공용 컴포넌트와 반복 UI 패턴을 모아 둔 페이지입니다.</p>
          </div>
          <span className={styles['status-chip']}>Desktop · Dark theme</span>
        </header>

        <section className={styles['grade-palette-section']}>
          <div className={styles['section-heading']}>
            <div>
              <p className={styles['section-kicker']}>LOST ARK FOUNDATION</p>
              <h2>아이템 등급 팔레트</h2>
              <p>일반부터 고대까지 게임 데이터의 등급 위계를 표현하는 Sass 토큰입니다.</p>
            </div>
          </div>
          <div className={styles['component-surface']}>
            <ul className={styles['grade-palette']}>
              <li>
                <span className={styles['grade-normal']} aria-hidden="true" />
                <strong>일반</strong>
                <code>$loa-grade-normal</code>
              </li>
              <li>
                <span className={styles['grade-uncommon']} aria-hidden="true" />
                <strong>고급</strong>
                <code>$loa-grade-uncommon</code>
              </li>
              <li>
                <span className={styles['grade-rare']} aria-hidden="true" />
                <strong>희귀</strong>
                <code>$loa-grade-rare</code>
              </li>
              <li>
                <span className={styles['grade-epic']} aria-hidden="true" />
                <strong>영웅</strong>
                <code>$loa-grade-epic</code>
              </li>
              <li>
                <span className={styles['grade-legendary']} aria-hidden="true" />
                <strong>전설</strong>
                <code>$loa-grade-legendary</code>
              </li>
              <li>
                <span className={styles['grade-relic']} aria-hidden="true" />
                <strong>유물</strong>
                <code>$loa-grade-relic</code>
              </li>
              <li>
                <span className={styles['grade-ancient']} aria-hidden="true" />
                <strong>고대</strong>
                <code>$loa-grade-ancient</code>
              </li>
            </ul>
          </div>
        </section>

        <CatalogSection title="정렬 목록" description="순서를 직접 조정하는 목록입니다.">
          <DraggableList
            items={draggableItems}
            getId={(item) => item}
            direction="vertical"
            onReorder={setDraggableItems}
            className={styles['draggable-sample']}
          >
            {(item, { dragHandleProps }) => (
              <div className={styles['draggable-item']}>
                <button
                  type="button"
                  className={styles['drag-handle']}
                  aria-label={`${item} 순서 변경`}
                  ref={dragHandleProps.ref}
                  onPointerDown={dragHandleProps.onPointerDown}
                >
                  <MdDragIndicator size={18} />
                </button>
                <span>{item}</span>
              </div>
            )}
          </DraggableList>
        </CatalogSection>

        <CatalogSection
          title="로스트아크 요소"
          description="캐릭터와 장비 화면에서 반복되는 도메인 요소입니다."
        >
          <div className={styles['game-elements']}>
            <div className={styles['element-example']}>
              <span>품질</span>
              <div className={styles['quality-list']}>
                <QualityChip quality={10} />
                <QualityChip quality={30} />
                <QualityChip quality={70} />
                <QualityChip quality={90} />
                <QualityChip quality={100} />
              </div>
            </div>
            <div className={styles['element-example']}>
              <span>아이템 등급</span>
              <div className={styles['item-slot-list']}>
                {['레어', '에픽', '전설', '유물', '고대', '에스더'].map((grade) => (
                  <div key={grade} className={styles['item-slot-example']}>
                    <ItemSlot imageUrl={null} grade={grade} />
                    <span>{grade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CatalogSection>

        <CatalogSection title="입력" description="폼 작성에 사용하는 기본 컨트롤입니다.">
          <div className={styles['form-grid']}>
            <label className={styles['field']}>
              <span>텍스트 입력</span>
              <TextInput value={text} onChange={setText} placeholder="내용을 입력하세요" />
            </label>
            <label className={styles['field']}>
              <span id="ui-test-select-label">등급 선택</span>
              <Select
                labelId="ui-test-select-label"
                options={SELECT_OPTIONS}
                value={selectedOption}
                onChange={setSelectedOption}
              />
            </label>
            <label className={`${styles['field']} ${styles['textarea-field']}`}>
              <span>설명</span>
              <Textarea value={textarea} onChange={setTextarea} placeholder="설명을 입력하세요" />
            </label>
            <div className={styles['checkbox-field']}>
              <span>선택</span>
              <Checkbox
                isChecked={isChecked}
                onChange={setIsChecked}
                label="재료를 보유하고 있습니다"
              />
              <Checkbox
                isChecked={false}
                onChange={() => undefined}
                label="비활성 상태"
                isDisabled
              />
            </div>
          </div>
        </CatalogSection>

        <CatalogSection
          title="탐색과 전환"
          description="같은 맥락 안에서 보기와 범위를 바꾸는 컨트롤입니다."
        >
          <div className={styles['navigation-examples']}>
            <Tabs options={TAB_OPTIONS} value={selectedTab} onChange={setSelectedTab} />
            <ButtonGroup
              options={BUTTON_GROUP_OPTIONS}
              value={selectedGroup}
              onChange={setSelectedGroup}
            />
            <DropdownMenu
              trigger={({ isOpen, toggle }) => (
                <button
                  type="button"
                  className={styles['more-button']}
                  aria-label="더 보기"
                  aria-expanded={isOpen}
                  onClick={toggle}
                >
                  <MdMoreHoriz size={22} />
                </button>
              )}
              items={[
                { label: '수정하기', onClick: () => toast.info('수정하기를 선택했습니다.') },
                { label: '복사하기', onClick: () => toast.success('복사했습니다.') },
                { label: '삭제하기', onClick: () => setIsConfirmOpen(true) },
              ]}
            />
          </div>
        </CatalogSection>

        <section className={styles['catalog-section']}>
          <div className={styles['section-heading']}>
            <div>
              <p className={styles['section-kicker']}>ROUTE UI</p>
              <h2>화면 고유 요소</h2>
              <p>공용 컴포넌트는 아니지만, 현재 서비스 화면을 실제로 구성하는 블록입니다.</p>
            </div>
          </div>
          <div className={styles['route-sample-grid']}>
            <div className={styles['route-sample']}>
              <p className={styles['sample-label']}>재련 조건</p>
              <RefiningConditionPanel
                condition={refiningCondition}
                onChange={setRefiningCondition}
              />
            </div>
            <div className={styles['route-sample']}>
              <p className={styles['sample-label']}>재련 재료 행</p>
              <RefiningMaterialInputPanel
                visibleMaterialIds={refiningMaterialIds}
                marketPrices={MOCK_REFINING_MARKET_PRICES}
                materials={refiningMaterials}
                onMaterialChange={(id, next) => {
                  setRefiningMaterials((materials) => ({
                    ...materials,
                    [id]: { ...materials[id]!, ...next } satisfies TRefiningMaterialInput,
                  }));
                }}
              />
            </div>
          </div>
          <div className={`${styles['route-sample']} ${styles['clear-gold-sample']}`}>
            <p className={styles['sample-label']}>클리어 골드 칩 · 아코디언 · 데이터 테이블</p>
            <ClearGoldPanel />
          </div>
          <div className={styles['other-route-elements']}>
            <div className={styles['route-sample']}>
              <p className={styles['sample-label']}>전체 캐릭터 목록 행</p>
              <CharacterList
                characters={lostarkCharacters}
                onReorder={setLostarkCharacters}
                onDeleteItem={(id) =>
                  setLostarkCharacters((characters) =>
                    characters.filter((character) => character.id !== id),
                  )
                }
                onToggleMain={(target) =>
                  setLostarkCharacters((characters) =>
                    characters.map((character) => ({
                      ...character,
                      isMain: character.id === target.id ? !character.isMain : false,
                    })),
                  )
                }
              />
            </div>
            <div className={styles['route-sample']}>
              <p className={styles['sample-label']}>로아도 메모 카드</p>
              <MemoCard
                memo={memo}
                dragHandleProps={{ ref: () => undefined }}
                onChange={setMemo}
                onDelete={() => toast.info('테스트 메모 삭제를 요청했습니다.')}
              />
            </div>
          </div>
          <div className={styles['other-route-elements']}>
            <div className={styles['route-sample']}>
              <p className={styles['sample-label']}>로아도 체크 셀</p>
              <div className={styles['loado-cell-sample']}>
                <LoaContentCell cell={loadoCell} onChange={setLoadoCell} />
              </div>
            </div>
          </div>
          <div className={`${styles['route-sample']} ${styles['level-gold-sample']}`}>
            <p className={styles['sample-label']}>레이드 제외 선택 · 레벨별 골드 카드</p>
            <LevelGoldPanel />
          </div>
          <div className={`${styles['route-sample']} ${styles['main-character-sample']}`}>
            <p className={styles['sample-label']}>메인 캐릭터 카드 · 장비 · 스펙 요약</p>
            <MainCharacterCard
              summary={SAMPLE_MAIN_CHARACTER_SUMMARY}
              onRefresh={() => toast.info('테스트 캐릭터 정보를 갱신합니다.')}
              onSave={() => toast.success('테스트 캐릭터 변경을 저장했습니다.')}
            />
          </div>
        </section>

        <section id="patterns" className={styles['catalog-section']}>
          <div className={styles['section-heading']}>
            <div>
              <p className={styles['section-kicker']}>REPEATED PATTERNS</p>
              <h2>반복 UI 패턴</h2>
              <p>개별 화면에 존재하지만 공통된 시각 언어를 만드는 요소입니다.</p>
            </div>
          </div>
          <div className={styles['pattern-grid']}>
            <article className={styles['sample-card']}>
              <div className={styles['card-heading']}>
                <div>
                  <p className={styles['card-label']}>캐릭터</p>
                  <h3>아만 서버 바드</h3>
                </div>
                <span className={styles['main-badge']}>메인</span>
              </div>
              <dl className={styles['metric-list']}>
                <div>
                  <dt>아이템 레벨</dt>
                  <dd>1,760.00</dd>
                </div>
                <div>
                  <dt>원정대 레벨</dt>
                  <dd>312</dd>
                </div>
              </dl>
              <Button color="gray" fill="outline" isFullWidth>
                상세 보기
              </Button>
            </article>

            <article className={styles['sample-card']}>
              <div className={styles['card-heading']}>
                <div>
                  <p className={styles['card-label']}>오늘의 진행</p>
                  <h3>주간 레이드</h3>
                </div>
                <span className={styles['accent-chip']}>3 / 3 완료</span>
              </div>
              <div className={styles['list-row']}>
                <span>에기르 하드</span>
                <span>20,000 G</span>
              </div>
              <div className={styles['list-row']}>
                <span>베히모스</span>
                <span>18,000 G</span>
              </div>
              <div className={styles['list-row']}>
                <span>카멘 하드</span>
                <span>15,000 G</span>
              </div>
            </article>

            <article className={`${styles['sample-card']} ${styles['empty-card']}`}>
              <div className={styles['empty-icon']}>
                <MdAdd size={22} />
              </div>
              <h3>아직 등록된 항목이 없습니다</h3>
              <p>새 항목을 추가하면 이 영역에 목록이 표시됩니다.</p>
              <Button color="mint" fill="solid">
                항목 추가
              </Button>
            </article>
          </div>
        </section>

        <CatalogSection
          title="상태 피드백"
          description="비동기 작업과 중요 안내에 사용되는 UI입니다."
        >
          <div className={styles['feedback-grid']}>
            <div className={styles['loading-sample']}>
              <BoxLoading height={112} />
            </div>
            <div className={styles['feedback-actions']}>
              <Button
                color="gray"
                fill="solid"
                onClick={() => toast.success('저장이 완료되었습니다.', { isShowCloseButton: true })}
              >
                성공 토스트
              </Button>
              <Button
                color="gray"
                fill="solid"
                onClick={() =>
                  toast.error('요청을 처리하지 못했습니다.', { isShowCloseButton: true })
                }
              >
                오류 토스트
              </Button>
              <Button color="gray" fill="outline" onClick={() => setIsModalOpen(true)}>
                기본 모달
              </Button>
              <Button color="gray" fill="outline" onClick={() => setIsConfirmOpen(true)}>
                확인 모달
              </Button>
              <Button color="gray" fill="outline" onClick={() => setIsFixedLoading(true)}>
                전체 로딩 보기
              </Button>
            </div>
          </div>
        </CatalogSection>
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="기본 모달 예시">
        <div className={styles['modal-content']}>
          <p>모달은 독립적인 작업이나 추가 정보를 표시할 때 사용합니다.</p>
          <Button color="mint" fill="solid" onClick={() => setIsModalOpen(false)}>
            확인
          </Button>
        </div>
      </Modal>
      <Confirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="삭제할까요?"
        message="삭제한 항목은 되돌릴 수 없습니다."
        buttons={[
          { label: '취소', color: 'gray', fill: 'outline', onClick: () => setIsConfirmOpen(false) },
          { label: '삭제', color: 'rose', fill: 'solid', onClick: () => setIsConfirmOpen(false) },
        ]}
      />
      {isFixedLoading && <FixedLoading />}
    </div>
  );
}

function CatalogSection(props: { title: string; description: string; children: React.ReactNode }) {
  const { title, description, children } = props;

  return (
    <section className={styles['catalog-section']}>
      <div className={styles['section-heading']}>
        <div>
          <p className={styles['section-kicker']}>COMMON COMPONENT</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className={styles['component-surface']}>{children}</div>
    </section>
  );
}
