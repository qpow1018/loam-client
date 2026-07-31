import ButtonShowcase from './_component/ButtonShowcase';
import ButtonGroupShowcase from './_component/ButtonGroupShowcase';
import IconButtonShowcase from './_component/IconButtonShowcase';
import DropdownMenuShowcase from './_component/DropdownMenuShowcase';
import FormShowcase from './_component/FormShowcase';
import ModalShowcase from './_component/ModalShowcase';

import styles from './designSystem.module.scss';

export default function DesignSystemPage() {
  return (
    <main className={styles['design-system-page']}>
      <div className={styles['content']}>
        <header className={styles['page-header']}>
          <p>DESIGN SYSTEM</p>
          <h1>Components</h1>
          <span>완료된 공용 요소만 이 페이지에 추가합니다.</span>
        </header>

        <ButtonShowcase />
        <IconButtonShowcase />
        <ButtonGroupShowcase />
        <DropdownMenuShowcase />
        <FormShowcase />
        <ModalShowcase />
      </div>
    </main>
  );
}
