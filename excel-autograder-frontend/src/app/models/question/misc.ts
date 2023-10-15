export enum QuestionType {
  Value= 'value',
  Function = 'function',
  Work = 'work',
}

export interface ICellAddress {
  sheetName: string;
  address: string;
  row: number;
  col: number;
}
