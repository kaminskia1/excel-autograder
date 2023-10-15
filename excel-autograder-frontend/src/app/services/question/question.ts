import { Cell } from "exceljs";

export interface Question {
  type: QType
  points: number
  targetCell?: CellAddress
  _targetCell?: Cell
  targetValue?: string
}

export enum QType {
  Value= 'value',
  Function = 'function',
  Work = 'work',
}

export interface CellAddress {
  sheetName: string;
  address: string;
  row: number;
  col: number;
}
