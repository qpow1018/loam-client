export type TEquipmentEditorKind = 'itemName' | 'spec' | 'goal' | 'purchasePrice';

export type TEquipmentEditor = {
  slotKey: string;
  slotName: string;
  kind: TEquipmentEditorKind;
};
