import type {
  TLostarkBracelet,
  TLostarkColoredEffect,
  TResLostarkMainCharacter,
} from '@/api/lostark/type';

import SummaryCharacterCell from './_shared/SummaryCharacterCell';
import SummarySection from './_shared/SummarySection';

import styles from './braceletSection.module.scss';

export default function BraceletSection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection title="팔찌" className={styles['bracelet-section']}>
      <div className={styles['bracelet-table']}>
        {props.characters.map((character) => (
          <div key={character.id} className={styles['character-row']}>
            <SummaryCharacterCell
              name={character.characterName}
              className={styles['character-cell']}
            />

            <BraceletEffects bracelet={character.summary.equipment.bracelet} />
          </div>
        ))}
      </div>
    </SummarySection>
  );
}

function BraceletEffects(props: { bracelet: TLostarkBracelet | null }) {
  if (!props.bracelet) {
    return <div className={styles['empty-cell']}>-</div>;
  }

  const braceletEffects = getBraceletEffects(props.bracelet.braceletEffects);

  if (braceletEffects.length === 0) {
    return <div className={styles['empty-cell']}>-</div>;
  }

  return (
    <div className={styles['effect-list']}>
      {braceletEffects.map((effect, index) => (
        <p key={`${effect.text}-${index}`} className={styles['effect']}>
          <span
            className={styles['effect-marker']}
            style={{ backgroundColor: `#${effect.color}` }}
          />
          <span className={styles['effect-text']}>{effect.text}</span>
        </p>
      ))}
    </div>
  );
}

function getBraceletEffects(effects: TLostarkColoredEffect[]) {
  return effects.reduce<TLostarkColoredEffect[]>((combinedEffects, effect) => {
    const previousEffect = combinedEffects[combinedEffects.length - 1];

    if (isBraceletCombinedOption(effect) && previousEffect) {
      previousEffect.text = `${previousEffect.text}\n${effect.text}`;
      return combinedEffects;
    }

    combinedEffects.push({ ...effect });
    return combinedEffects;
  }, []);
}

function isBraceletCombinedOption(effect: TLostarkColoredEffect) {
  return effect.color?.replace('#', '').toUpperCase() === '99FF99';
}
