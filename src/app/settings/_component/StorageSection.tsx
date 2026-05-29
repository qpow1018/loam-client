import { MdBackup, MdDeleteOutline, MdFileDownload, MdSecurity } from 'react-icons/md';

import SettingsItem, { type TSettingItem } from './SettingsItem';

import styles from '../settingsClient.module.scss';

const UPCOMING_SETTINGS: TSettingItem[] = [
  {
    title: '저장소 초기화',
    description: '전체 초기화와 할일/메모/캐릭터별 초기화를 Confirm 모달과 함께 제공',
    icon: MdDeleteOutline,
  },
  {
    title: '저장 데이터 검사/복구',
    description: '깨진 localStorage 값, 예전 구조, 누락된 Loado 셀을 감지하고 복구',
    icon: MdSecurity,
  },
  {
    title: '저장소 자동백업',
    description: '일정 주기마다 저장 데이터를 자동으로 백업하고 최근 백업 이력을 관리',
    icon: MdBackup,
  },
];

export default function StorageSection(props: {
  backupStatus?: string;
  onExport: () => void;
  onImport: () => void;
}) {
  const storageSettings: TSettingItem[] = [
    {
      title: '데이터 백업/복원',
      description: '할일 테이블, 메모, 내 캐릭터 데이터를 JSON 파일로 내보내고 다시 가져옵니다.',
      icon: MdFileDownload,
      status: props.backupStatus,
      actions: [
        {
          label: '내보내기',
          icon: MdFileDownload,
          theme: 'bg-sec',
          onClick: props.onExport,
        },
        {
          label: '가져오기',
          icon: MdFileDownload,
          theme: 'bd-gray',
          onClick: props.onImport,
        },
      ],
    },
  ];

  return (
    <>
      <section className={styles['settings-container']}>
        <div className={styles['section-header']}>
          <p className={styles['title']}>저장소</p>
        </div>

        <div className={styles['memo-list']} aria-label="저장소 설정 기능">
          {storageSettings.map((item) => (
            <SettingsItem key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className={styles['settings-container']}>
        <div className={styles['section-header']}>
          <p className={styles['title']}>저장소 TODO 메모</p>
        </div>

        <div className={styles['memo-list']} aria-label="설정 페이지 개발 메모">
          {UPCOMING_SETTINGS.map((item) => (
            <SettingsItem key={item.title} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
