import type {
  TLostarkBracelet,
  TLostarkColoredEffect,
  TResLostarkMainCharacter,
} from '@/api/lostark/type';

import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';
import SummaryCharacterRow from './_shared/SummaryCharacterRow';
import SummaryCell from './_shared/SummaryCell';

import styles from './braceletSection.module.scss';

export default function BraceletSection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection title="팔찌" className={styles['bracelet-section']}>
      <SummaryTable columns={[]} gridClassName={styles['bracelet-grid']}>
        {props.characters.map((character) => (
          <SummaryCharacterRow
            key={character.id}
            name={character.characterName}
            className={styles['bracelet-grid']}
          >
            <BraceletEffects bracelet={character.summary.equipment.bracelet} />
          </SummaryCharacterRow>
        ))}
      </SummaryTable>
    </SummarySection>
  );
}

function BraceletEffects(props: { bracelet: TLostarkBracelet | null }) {
  const { bracelet } = props;

  if (!bracelet) {
    return null;
  }

  const braceletEffects = getBraceletEffects(bracelet.braceletEffects);

  return (
    <SummaryCell className={styles['effect-list']}>
      {braceletEffects.map((effect, index) => (
        <p key={`${effect.text}-${index}`} className={styles['effect']}>
          <span
            className={styles['effect-marker']}
            style={{ backgroundColor: `#${effect.color}` }}
          />
          <span className={styles['effect-text']}>{effect.text}</span>
        </p>
      ))}
    </SummaryCell>
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
