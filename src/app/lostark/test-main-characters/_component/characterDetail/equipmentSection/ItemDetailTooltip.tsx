import styles from './itemDetailTooltip.module.scss';

type TItemDetailTooltipDetail = {
  label: string;
  value: string | number | null | undefined;
};

type TItemDetailTooltipEffect = {
  text: string;
  color?: string | null;
};

export default function ItemDetailTooltip(props: {
  name: string | null;
  grade: string | null;
  details: TItemDetailTooltipDetail[];
  effects?: TItemDetailTooltipEffect[];
}) {
  const details = props.details.filter(
    (detail) => detail.value !== null && detail.value !== undefined,
  );
  const effects = props.effects?.filter((effect) => effect.text.trim()) ?? [];

  if (!props.name && details.length === 0 && effects.length === 0) return null;

  return (
    <>
      <div className={styles['tooltip-header']}>
        <strong>{props.name ?? '-'}</strong>
        {props.grade && <span>{props.grade}</span>}
      </div>
      {details.length > 0 && (
        <div className={styles['tooltip-details']}>
          {details.map((detail) => (
            <span key={detail.label}>
              <b>{detail.label}</b>
              {detail.value}
            </span>
          ))}
        </div>
      )}
      {effects.length > 0 && (
        <div className={styles['tooltip-effects']}>
          {effects.map((effect, index) => (
            <span key={`${effect.text}-${index}`} style={{ color: effect.color ?? undefined }}>
              {effect.text}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
