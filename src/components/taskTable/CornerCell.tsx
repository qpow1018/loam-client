import IconButton from '@/components/common/button/IconButton';
import DropdownMenu from '@/components/common/dropdownMenu/DropdownMenu';
import type { TDropdownMenuItem } from '@/components/common/dropdownMenu/DropdownMenu';

import styles from './cornerCell.module.scss';

import { MdAdd } from 'react-icons/md';

export default function CornerCell(props: { items: TDropdownMenuItem[] }) {
  const { items } = props;

  return (
    <div className={styles['corner-cell']}>
      <DropdownMenu
        trigger={({ toggle }) => (
          <IconButton size="small" onClick={toggle}>
            <MdAdd />
          </IconButton>
        )}
        items={items}
      />
    </div>
  );
}
