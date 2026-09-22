import LostarkHeader from '@/components/lostark/header/LostarkHeader';

import styles from './buildAnalysisPage.module.scss';

export default function BuildAnalysisPage() {
  return (
    <>
      <LostarkHeader />

      <main className={styles['build-analysis-page']}>
        <h1>세팅 분석</h1>
        <p>캐릭터 세팅 분석 기능을 준비하고 있습니다.</p>
      </main>
    </>
  );
}
