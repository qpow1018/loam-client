'use client';

import { MdOpenInNew } from 'react-icons/md';

import Header from '@/components/common/header/Header';

import styles from './referenceSites.module.scss';

const REFERENCE_SITES = [
  {
    name: '아크그리드 최적화',
    url: 'https://airplaner.github.io/lostark-arkgrid-gem-locator-v2/',
    description: '전투력 기반 아크그리드 최적화 툴',
  },
  {
    name: '로펙',
    url: 'https://lopec.kr/',
    description: '캐릭터 스펙',
  },
  {
    name: '로아업',
    url: 'https://loaup.com/',
    description: '캐릭터 스펙, 스펙업 효율',
  },
  {
    name: '로아지지',
    url: 'https://loagg.com/',
    description: '캐릭터 스펙, 세팅 효율',
  },
  {
    name: '일로아',
    url: 'https://iloa.gg/',
    description: '캐릭터 스펙',
  },
  {
    name: '로스트빌드',
    url: 'https://lostbuilds.com/',
    description: '데미지 시뮬레이터',
  },
  {
    name: '알로아',
    url: 'https://rloa.gg/database/raid/reward',
    description: '레이드 클골',
  },
  {
    name: '로아또',
    url: 'https://loatto.kr/',
    description: '재련효율, 지옥효율, 싱글코인, 특수재련',
  },
  {
    name: '껨산기',
    url: 'https://www.gcalc.kr/',
    description: '각종 효율',
  },
];

export default function ReferenceSitesClient() {
  return (
    <div className={styles['reference-sites-page']}>
      <Header />

      <main className={styles['reference-sites-page-container']}>
        <section className={styles['reference-sites-container']}>
          <div className={styles['section-header']}>
            <h1 className={styles['title']}>참고 사이트</h1>
          </div>

          <ul className={styles['site-list']}>
            {REFERENCE_SITES.map((site) => (
              <li key={site.url}>
                <a
                  href={site.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles['site-item']}
                  aria-label={`${site.name} 새 창에서 열기`}
                >
                  <div className={styles['site-content']}>
                    <div className={styles['site-title-row']}>
                      <h2>{site.name}</h2>
                      <span>{getDisplayUrl(site.url)}</span>
                    </div>
                    <p>{site.description}</p>
                  </div>

                  <span className={styles['site-link-icon']}>
                    <MdOpenInNew size={18} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function getDisplayUrl(url: string) {
  return new URL(url).hostname.replace(/^www\./, '');
}
