import type { TLostarkCards } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import DetailSection from './DetailSection';

import styles from './cardSection.module.scss';

export default function CardSection(props: { cards: TLostarkCards; className?: string }) {
  const { cards, effects } = props.cards;

  return (
    <DetailSection title="카드" className={props.className}>
      {cards.length === 0 && <p className={styles['empty']}>카드 정보가 없습니다.</p>}

      {cards.length > 0 && (
        <>
          <div className={styles['card-list']}>
            {cards.map((card, index) => (
              <div key={`${card.slot}-${index}`} className={styles['card-item']}>
                <ItemSlot imageUrl={card.icon} grade={card.grade} size={80} />
                <strong>{card.name ?? '-'}</strong>
                <span>{`${card.awakeCount ?? 0}/${card.awakeTotal ?? 0} 각성`}</span>
              </div>
            ))}
          </div>

          {effects.length > 0 && (
            <div className={styles['effect-list']}>
              {effects.map((effect, index) => (
                <div key={`${effect.index}-${index}`}>
                  {effect.items.map((item, itemIndex) => (
                    <p key={`${item.name}-${itemIndex}`}>
                      <strong>{item.name ?? '-'}</strong>
                      {item.description && <span>{item.description}</span>}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DetailSection>
  );
}
