import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacters';
import { getClassImageUrl } from '@/app/my-characters/_util/lostark';

import DraggableList from '@/components/common/draggableList/DraggableList';
import CharacterListItem from './CharacterListItem';

export default function CharacterList(props: {
  characters: TMyCharacterInfo[];
  togglingMainCharacterId?: string | null;
  onReorder: (characters: TMyCharacterInfo[]) => void;
  onDeleteItem: (id: string) => void;
  onToggleMain: (character: TMyCharacterInfo) => void;
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
            isMain={character.isMain === true}
            isMainToggleLoading={props.togglingMainCharacterId === character.id}
            dragHandleProps={dragHandleProps}
            onToggleMain={() => props.onToggleMain(character)}
            onDelete={() => props.onDeleteItem(character.id)}
          />
        );
      }}
    </DraggableList>
  );
}
