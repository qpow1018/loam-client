import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacters';
import { getClassInfo } from '@/app/my-characters/_util/lostark';

import Button from '@/components/common/button/Button';
import CharacterListItem from './CharacterListItem';

import styles from './characterList.module.scss';

export default function CharacterList(props: {
  characters: TMyCharacterInfo[];
  onClickAdd: () => void;
  onClickItemMove: (id: string) => void;
  onClickItemDelete: (id: string) => void;
}) {
  return (
    <section className={styles['character-list']}>
      <div className={styles['header']}>
        <p className={styles['title']}>내 캐릭터 목록</p>
        <Button onClick={props.onClickAdd} theme="bg-pri">
          추가하기
        </Button>
      </div>

      {props.characters.length === 0 ? (
        <div className={styles['empty']}>
          <p className={styles['empty-message']}>내 캐릭터를 추가하세요.</p>
        </div>
      ) : (
        props.characters.map((item) => {
          const classData = getClassInfo(item.classValue);
          return (
            <CharacterListItem
              key={item.id}
              nickname={item.nickname}
              className={classData.label}
              thumbnail={classData.imageUrl}
              onClickMove={() => props.onClickItemMove(item.id)}
              onClickDelete={() => props.onClickItemDelete(item.id)}
            />
          );
        })
      )}
    </section>
  );
}
