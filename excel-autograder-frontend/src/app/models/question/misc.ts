export enum QuestionType {
  Value= 'QuestionType.Value',
  Function = 'QuestionType.Function',
  Work = 'QuestionType.Work',
}

export interface ICellAddress {
  sheetName: string;
  address: string;
  row: number;
  col: number;
}
