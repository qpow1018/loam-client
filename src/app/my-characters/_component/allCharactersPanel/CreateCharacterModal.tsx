import { useState } from 'react';

import api from '@/api';
import type {
  TResLostarkMyCharacter,
  TReqCreateLostarkMyCharacter,
  TLostarkSiblingCharacter,
} from '@/api/lostark/type';
import { getClassImageUrl, convertItemLevelToNumber } from '@/utils/lostark';
import toast from '@/utils/toast';

import Modal from '@/components/common/modal/Modal';
import TextInput from '@/components/common/form/TextInput';
import Button from '@/components/common/button/Button';

import styles from './createCharacterModal.module.scss';

import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';

export default function CreateCharacterModal(props: {
  isOpen: boolean;
  onClose: () => void;
  registeredCharacters: TResLostarkMyCharacter[];
  onSubmit: (characters: TReqCreateLostarkMyCharacter[]) => void;
}) {
  const { isOpen, onClose, registeredCharacters, onSubmit } = props;

  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [siblings, setSiblings] = useState<TLostarkSiblingCharacter[]>([]);
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set());

  const isSubmitDisabled = selectedNames.size === 0;
  const registeredCharacterNames = new Set(
    registeredCharacters.map((character) => character.nickname),
  );
  const unregisteredCharacters = siblings
    .filter((character) => !registeredCharacterNames.has(character.CharacterName))
    .toSorted(
      (a, b) => convertItemLevelToNumber(b.ItemAvgLevel) - convertItemLevelToNumber(a.ItemAvgLevel),
    );

  async function handleSearch() {
    const trimmed = nickname.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setSelectedNames(new Set());

    try {
      const response = await api.lostark.getSiblingCharacters(trimmed);
      setSiblings(response.data);
      setSelectedNames(
        new Set(
          response.data
            .filter((character) => !registeredCharacterNames.has(character.CharacterName))
            .map((character) => character.CharacterName),
        ),
      );
    } catch {
      setSiblings([]);
      toast.error('원정대 캐릭터를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleToggleCharacter(characterName: string) {
    setSelectedNames((prev) => {
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
      .filter((character) => selectedNames.has(character.CharacterName))
      .map((character) => ({
        nickname: character.CharacterName,
        className: character.CharacterClassName,
        itemLevel: character.ItemAvgLevel,
      }));
    onSubmit(selectedCharacters);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="원정대 불러오기" width={760}>
      <div className={styles['create-character-modal-content']}>
        <div className={styles['search-section']}>
          <span className={styles['label']}>대표 캐릭터</span>
          <TextInput
            value={nickname}
            onChange={setNickname}
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

          {siblings.length > 0 && unregisteredCharacters.length === 0 ? (
            <div className={styles['empty']}>등록할 수 있는 새 캐릭터가 없습니다.</div>
          ) : (
            <div className={styles['character-grid']}>
              {unregisteredCharacters.map((character) => {
                const isSelected = selectedNames.has(character.CharacterName);
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
          <Button theme="bg-gray600" size="large" onClick={onClose}>
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
