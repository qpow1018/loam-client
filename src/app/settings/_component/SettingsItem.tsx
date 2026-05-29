import type { IconType } from 'react-icons';

import Button, { type TButtonTheme } from '@/components/common/button/Button';

import styles from '../settingsClient.module.scss';

export type TSettingAction = {
  label: string;
  icon: IconType;
  theme: TButtonTheme;
  onClick: () => void;
  isDisabled?: boolean;
};

export type TSettingItem = {
  title: string;
  description: string;
  icon: IconType;
  actions?: TSettingAction[];
  status?: string;
};

export default function SettingsItem(props: { item: TSettingItem }) {
  const { item } = props;
  const Icon = item.icon;

  return (
    <article className={styles['memo-item']}>
      <div className={styles['icon-box']}>
        <Icon size={20} />
      </div>
      <div className={styles['memo-content']}>
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        {item.status !== undefined && <p className={styles['item-status']}>{item.status}</p>}
      </div>
      {item.actions !== undefined && (
        <div className={styles['item-actions']}>
          {item.actions.map((action) => {
            const ActionIcon = action.icon;

            return (
              <Button
                key={action.label}
                theme={action.theme}
                size="small"
                isDisabled={action.isDisabled}
                onClick={action.onClick}
              >
                <ActionIcon size={18} />
                <span>{action.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </article>
  );
}
