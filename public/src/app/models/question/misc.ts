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

export enum QuestionFlag {
  None = 'QuestionFlag.None',
  Incorrect = 'QuestionFlag.Incorrect',
  Correct = 'QuestionFlag.Correct',
  Always = 'QuestionFlag.Always',
}
