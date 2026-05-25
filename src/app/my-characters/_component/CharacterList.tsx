import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacters';
import { getClassInfo } from '@/app/my-characters/_util/lostark';

import DraggableList from '@/components/common/draggableList/DraggableList';
import CharacterListItem from './CharacterListItem';

export default function CharacterList(props: {
  characters: TMyCharacterInfo[];
  onReorder: (characters: TMyCharacterInfo[]) => void;
  onDeleteItem: (id: string) => void;
}) {
  return (
    <DraggableList<TMyCharacterInfo>
      items={props.characters}
      getId={(c) => c.id}
      direction="vertical"
      onReorder={props.onReorder}
    >
      {(character, { dragHandleProps }) => {
        const classData = getClassInfo(character.classValue);
        return (
          <CharacterListItem
            nickname={character.nickname}
            className={classData.label}
            thumbnail={classData.imageUrl}
            dragHandleProps={dragHandleProps}
            onDelete={() => props.onDeleteItem(character.id)}
          />
        );
      }}
    </DraggableList>
  );
}
