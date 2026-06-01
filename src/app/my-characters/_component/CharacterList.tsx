import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacters';
import { getClassImageUrl } from '@/app/my-characters/_util/lostark';

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
        return (
          <CharacterListItem
            nickname={character.nickname}
            className={character.className}
            itemLevel={character.itemLevel}
            thumbnail={getClassImageUrl(character.className)}
            dragHandleProps={dragHandleProps}
            onDelete={() => props.onDeleteItem(character.id)}
          />
        );
      }}
    </DraggableList>
  );
}
