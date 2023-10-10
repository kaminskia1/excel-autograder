import {Cell} from "exceljs";

export type Question = {
  elements: Array<QElement>
}

export type QElement = {
  type: QElementType
  points: number;
  targetCell?: Cell;
  targetValue?: string;
}

export enum QElementType {
  Value= 'value',
  Function = 'function',
  Work = 'work',
}
