export type TResLostarkSiblingCharacters = {
  ok?: boolean;
  status?: number;
  data: TLostarkSiblingCharacter[];
};

export type TLostarkSiblingCharacter = {
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
};
