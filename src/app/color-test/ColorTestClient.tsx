import LostarkHeader from '@/components/lostark/header/LostarkHeader';

import {
  COLOR_AUDIT_SECTIONS,
  PROJECT_PALETTES,
  RUNTIME_COLOR_TRACE,
  type TColorAuditSection,
} from './_define/colorAudit';

import styles from './colorTestClient.module.scss';

export default function ColorTestClient() {
  return (
    <div className={styles['color-test-page']}>
      <LostarkHeader />

      <main className={styles['content']}>
        <header className={styles['page-header']}>
          <p className={styles['eyebrow']}>STATIC COLOR AUDIT</p>
          <h1>색상 카탈로그</h1>
          <p>
            추적된 저장소 기준 · _variables.scss 정의 자체는 제외 · 백업 알림에는 Amber 토큰 적용
            완료
          </p>
        </header>

        <section className={styles['palette-section']}>
          <div className={styles['section-heading']}>
            <div>
              <p className={styles['section-kicker']}>PROJECT PALETTES</p>
              <h2>현재 프로젝트 팔레트</h2>
            </div>
            <p>_variables.scss에 정의한 Mint, Rose, Amber, Violet, Azure, Gray의 100–900 단계입니다.</p>
          </div>

          <div className={styles['palette-comparison']}>
            {PROJECT_PALETTES.map((palette) => (
              <section key={palette.name} className={styles['palette-card']}>
                <h3>{palette.name}</h3>
                <p>{palette.description}</p>
                <ul className={styles['palette-colors']}>
                  {palette.colors.map((color) => (
                    <li key={color.step}>
                      <span style={{ backgroundColor: color.value }} aria-hidden="true" />
                      <strong>{color.step}</strong>
                      <code>{color.value}</code>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        {COLOR_AUDIT_SECTIONS.map((section) => (
          <ColorAuditSection key={section.title} section={section} />
        ))}

        <ColorAuditSection section={RUNTIME_COLOR_TRACE} isRuntime />
      </main>
    </div>
  );
}

function ColorAuditSection(props: { section: TColorAuditSection; isRuntime?: boolean }) {
  const { section, isRuntime = false } = props;

  return (
    <section className={styles['catalog-section']}>
      <div className={styles['section-heading']}>
        <div>
          <p className={styles['section-kicker']}>
            {isRuntime ? 'RUNTIME / GAME DATA' : 'STATIC SOURCE'}
          </p>
          <h2>{section.title}</h2>
        </div>
        <p>{section.description}</p>
      </div>

      {section.decision !== undefined && <ColorDecision decision={section.decision} />}

      <ul className={`${styles['color-list']} ${isRuntime ? styles['is-runtime'] : ''}`}>
        {section.items.map((item) => (
          <li key={`${item.expression}-${item.sources[0]}`} className={styles['color-item']}>
            {item.swatch === undefined ? (
              <span className={styles['semantic-mark']} aria-hidden="true">
                ∅
              </span>
            ) : (
              <span
                className={styles['swatch']}
                style={{ background: item.swatch }}
                aria-hidden="true"
              />
            )}
            <div className={styles['item-details']}>
              <code>{item.expression}</code>
              {item.note !== undefined && <p>{item.note}</p>}
              {item.decision !== undefined && <ColorDecision decision={item.decision} />}
              <ul className={styles['source-list']}>
                {item.sources.map((source) => (
                  <li key={source}>{source}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ColorDecision(props: { decision: NonNullable<TColorAuditSection['decision']> }) {
  const { decision } = props;

  return (
    <div className={`${styles['color-decision']} ${styles[`decision-${decision.kind}`]}`}>
      <span>{decision.label}</span>
      <p>{decision.reason}</p>
      {decision.tokenName !== undefined && <code>제안: {decision.tokenName}</code>}
    </div>
  );
}
