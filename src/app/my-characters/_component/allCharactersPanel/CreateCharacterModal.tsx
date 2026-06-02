import { useState } from 'react';

import api from '@/api';
import type { TLostarkSiblingCharacter } from '@/api/lostark/type';
import type { TCreateLostarkMyCharacter, TLostarkMyCharacter } from '@/api/lostark/type';
import { getClassImageUrl } from '@/app/my-characters/_util/lostark';
import toast from '@/utils/toast';

import Modal from '@/components/common/modal/Modal';
import TextInput from '@/components/common/form/TextInput';
import Button from '@/components/common/button/Button';

import styles from './createCharacterModal.module.scss';

import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

export default function CreateCharacterModal(props: {
  isOpen: boolean;
  registeredCharacters: TLostarkMyCharacter[];
  onClose: () => void;
  onSubmit: (characters: TCreateLostarkMyCharacter[]) => void;
}) {
  const [characterName, setCharacterName] = useState('');
  const [characters, setCharacters] = useState<TLostarkSiblingCharacter[]>([]);
  const [selectedCharacterNames, setSelectedCharacterNames] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const isSubmitDisabled = selectedCharacterNames.size === 0;
  const registeredCharacterNames = new Set(
    props.registeredCharacters.map((character) => character.nickname),
  );
  const unregisteredCharacters = characters
    .filter((character) => !registeredCharacterNames.has(character.CharacterName))
    .toSorted((a, b) => parseItemLevel(b.ItemAvgLevel) - parseItemLevel(a.ItemAvgLevel));

  function parseItemLevel(itemLevel: string) {
    return Number(itemLevel.replaceAll(',', ''));
  }

  async function handleSearch() {
    const trimmed = characterName.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setSelectedCharacterNames(new Set());

    try {
      const response = await api.lostark.getSiblingCharacters(trimmed);
      setCharacters(response.data);
      setSelectedCharacterNames(
        new Set(
          response.data
            .filter((character) => !registeredCharacterNames.has(character.CharacterName))
            .map((character) => character.CharacterName),
        ),
      );
    } catch {
      setCharacters([]);
      toast.error('원정대 캐릭터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggleCharacter(characterName: string) {
    setSelectedCharacterNames((prev) => {
      const next = new Set(prev);
      if (next.has(characterName)) {
        next.delete(characterName);
      } else {
        next.add(characterName);
      }
      return next;
    });
  }

  function handleSubmit() {
    const selectedCharacters = unregisteredCharacters
      .filter((character) => selectedCharacterNames.has(character.CharacterName))
      .map((character) => ({
        nickname: character.CharacterName,
        className: character.CharacterClassName,
        itemLevel: character.ItemAvgLevel,
      }));

    props.onSubmit(selectedCharacters);
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title="원정대 불러오기" width={760}>
      <div className={styles['create-character-modal-content']}>
        <div className={styles['search-section']}>
          <span className={styles['label']}>대표 캐릭터</span>
          <TextInput
            value={characterName}
            onChange={setCharacterName}
            onPressEnter={handleSearch}
            placeholder="캐릭터명을 입력하세요"
            className={styles['nickname-input']}
          />
          <Button theme="bg-pri" onClick={handleSearch} isLoading={isLoading}>
            검색
          </Button>
        </div>

        <div className={styles['result-section']}>
          <p className={styles['hint']}>등록되지 않은 캐릭터만 표시됩니다.</p>

          {characters.length > 0 && unregisteredCharacters.length === 0 ? (
            <div className={styles['empty']}>등록할 수 있는 새 캐릭터가 없습니다.</div>
          ) : (
            <div className={styles['character-grid']}>
              {unregisteredCharacters.map((character) => {
                const isSelected = selectedCharacterNames.has(character.CharacterName);
                const classImageUrl = getClassImageUrl(character.CharacterClassName);

                return (
                  <button
                    key={character.CharacterName}
                    type="button"
                    className={`${styles['character-card']} ${isSelected ? styles['selected'] : ''}`}
                    onClick={() => handleToggleCharacter(character.CharacterName)}
                  >
                    <span className={styles['selection-icon']} aria-hidden="true">
                      {isSelected ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                    </span>
                    <span className={styles['thumbnail']}>
                      {classImageUrl && <img src={classImageUrl} alt="" />}
                    </span>
                    <span className={styles['character-info']}>
                      <span className={styles['character-name']}>{character.CharacterName}</span>
                      <span className={styles['character-meta']}>
                        {character.CharacterClassName} · {character.ItemAvgLevel}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles['action-buttons']}>
          <Button theme="bg-gray600" size="large" onClick={props.onClose}>
            취소
          </Button>
          <Button
            theme="bg-pri"
            size="large"
            className={styles['submit-btn']}
            onClick={handleSubmit}
            isDisabled={isSubmitDisabled}
          >
            등록
          </Button>
        </div>
      </div>
    </Modal>
  );
}
