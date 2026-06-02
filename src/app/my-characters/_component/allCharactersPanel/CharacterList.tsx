import type { TLostarkMyCharacter } from '@/api/lostark/type';
import { getClassImageUrl } from '@/app/my-characters/_util/lostark';

import DraggableList from '@/components/common/draggableList/DraggableList';
import CharacterListItem from './CharacterListItem';

export default function CharacterList(props: {
  characters: TLostarkMyCharacter[];
  togglingMainCharacterId?: string | null;
  onReorder: (characters: TLostarkMyCharacter[]) => void;
  onDeleteItem: (id: string) => void;
  onToggleMain: (character: TLostarkMyCharacter) => void;
}) {
  return (
    <DraggableList<TLostarkMyCharacter>
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
