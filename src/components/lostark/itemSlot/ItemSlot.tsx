import styles from './itemSlot.module.scss';

const GRADE_CLASS_MAP = {
  희귀: 'item-slot-rare',
  영웅: 'item-slot-epic',
  전설: 'item-slot-legendary',
  유물: 'item-slot-relic',
  고대: 'item-slot-ancient',
  에스더: 'item-slot-esther',
} as const;

export type TItemSlotProps = {
  imageUrl: string | null;
  size?: number;
  grade?: string | null;
};

export default function ItemSlot(props: TItemSlotProps) {
  const { imageUrl, size = 48, grade } = props;
  const gradeClassName = grade ? GRADE_CLASS_MAP[grade as keyof typeof GRADE_CLASS_MAP] : null;

  return (
    <div
      className={`${styles['item-slot']} ${gradeClassName ? styles[gradeClassName] : ''}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {imageUrl && <img src={imageUrl} alt="" />}
    </div>
  );
}
