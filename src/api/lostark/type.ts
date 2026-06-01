export type TLostarkSiblingCharacter = {
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
};

export type TLostarkSiblingCharactersResponse = {
  ok?: boolean;
  status?: number;
  data: TLostarkSiblingCharacter[];
};
