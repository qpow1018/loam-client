// import type {
//   TCharacterSpec,
//   TCharacterSpecGemSummary,
//   TCharacterSpecSectionStatusValue,
// } from '@/api/lostark/type';
// import type { TLostarkMyCharacter } from '@/api/lostark/type';

// import Button from '@/components/common/button/Button';

// import styles from './mainCharacterSpec.module.scss';

// function stringifyValue(value: unknown) {
//   if (value === null || value === undefined || value === '') {
//     return '-';
//   }

//   if (typeof value === 'string' || typeof value === 'number') {
//     return String(value);
//   }

//   return JSON.stringify(value);
// }

// function getStatusLabel(status: TCharacterSpecSectionStatusValue) {
//   switch (status) {
//     case 'success':
//       return '성공';
//     case 'failed':
//       return '조회 실패';
//     case 'empty':
//       return '빈 응답';
//     case 'needsReview':
//       return '응답 확인 필요';
//   }
// }

// function getStatusClassName(status: TCharacterSpecSectionStatusValue) {
//   if (status === 'needsReview') {
//     return styles['status-needs-review'];
//   }

//   return styles[`status-${status}`];
// }

// function renderKeyValueList(data: Record<string, unknown>) {
//   const entries = Object.entries(data);

//   if (entries.length === 0) {
//     return <p className={styles['empty-section']}>응답 확인 필요</p>;
//   }

//   return (
//     <dl className={styles['kv-list']}>
//       {entries.map(([key, value]) => (
//         <div key={key} className={styles['kv-item']}>
//           <dt>{key}</dt>
//           <dd>{stringifyValue(value)}</dd>
//         </div>
//       ))}
//     </dl>
//   );
// }

// function renderArraySection(items: unknown[]) {
//   if (items === undefined || items === null || items.length === 0) {
//     return <p className={styles['empty-section']}>응답 확인 필요</p>;
//   }

//   return (
//     <ul className={styles['raw-list']}>
//       {items.map((item, index) => (
//         <li key={index}>{stringifyValue(item)}</li>
//       ))}
//     </ul>
//   );
// }

// function isGemSummary(value: unknown): value is TCharacterSpecGemSummary {
//   return (
//     value !== null &&
//     typeof value === 'object' &&
//     !Array.isArray(value) &&
//     Array.isArray((value as TCharacterSpecGemSummary).items)
//   );
// }

// function getGemItems(gems: TCharacterSpec['summary']['gems']) {
//   return isGemSummary(gems) ? gems.items : gems;
// }

// export default function MainCharacterSpecCard(props: {
//   character: TLostarkMyCharacter;
//   spec?: TCharacterSpec;
//   isDirty: boolean;
//   isLoading: boolean;
//   isSaving: boolean;
//   onRefresh: () => void;
//   onSave: () => void;
// }) {
//   const { character, spec } = props;
//   const summary = spec?.summary;

//   return (
//     <article className={styles['spec-card']}>
//       <div className={styles['card-header']}>
//         <div>
//           <p className={styles['character-name']}>{character.nickname}</p>
//           <p className={styles['character-meta']}>
//             {spec?.serverName ?? '-'} · {spec?.characterClass ?? character.className} ·{' '}
//             {spec?.itemLevel ?? character.itemLevel}
//           </p>
//           {props.isDirty && <p className={styles['dirty-label']}>저장되지 않은 최신 스펙입니다.</p>}
//         </div>

//         <div className={styles['card-actions']}>
//           <Button
//             theme="bg-gray600"
//             size="small"
//             isLoading={props.isLoading}
//             onClick={props.onRefresh}
//           >
//             갱신
//           </Button>
//           <Button
//             theme="bg-pri"
//             size="small"
//             isLoading={props.isSaving}
//             isDisabled={!spec}
//             onClick={props.onSave}
//           >
//             저장
//           </Button>
//         </div>
//       </div>

//       {spec && (
//         <div className={styles['status-list']}>
//           {Object.entries(spec.sectionStatus).map(([key, status]) => (
//             <span key={key} className={getStatusClassName(status)}>
//               {key}: {getStatusLabel(status)}
//             </span>
//           ))}
//         </div>
//       )}

//       {!summary ? (
//         <div className={styles['empty-spec']}>
//           <p>저장된 스펙 정보가 없습니다. 갱신을 눌러 스펙을 불러오세요.</p>
//         </div>
//       ) : (
//         <div className={styles['sections']}>
//           <section className={styles['spec-section']}>
//             <h3>기본 스펙</h3>
//             {renderKeyValueList(summary.profile)}
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>장비 강화 / 상급재련</h3>
//             {renderArraySection(summary.equipment)}
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>장신구</h3>
//             {renderArraySection(summary.accessories)}
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>팔찌</h3>
//             {summary.bracelet ? (
//               renderKeyValueList(summary.bracelet)
//             ) : (
//               <p className={styles['empty-section']}>응답 확인 필요</p>
//             )}
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>어빌리티스톤</h3>
//             {summary.abilityStone ? (
//               renderKeyValueList(summary.abilityStone)
//             ) : (
//               <p className={styles['empty-section']}>응답 확인 필요</p>
//             )}
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>각인</h3>
//             {renderArraySection(summary.engravings)}
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>보석</h3>
//             {renderArraySection(getGemItems(summary.gems))}
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>아크패시브</h3>
//             <p className={styles['empty-section']}>응답 확인 필요</p>
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>코어 / 젬 / 카르마</h3>
//             <p className={styles['empty-section']}>응답 확인 필요</p>
//           </section>
//           <section className={styles['spec-section']}>
//             <h3>전설아바타</h3>
//             {renderArraySection(summary.legendaryAvatars)}
//           </section>
//         </div>
//       )}
//     </article>
//   );
// }
