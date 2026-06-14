export type TMemo = {
  id: string;
  title?: string;
  content: string;
};

export type TMemoData = {
  memos: TMemo[];
};
