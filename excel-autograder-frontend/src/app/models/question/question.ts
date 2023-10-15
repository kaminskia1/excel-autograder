import { Cell } from 'exceljs';
import { ICellAddress, QuestionType } from './misc';
import { WorkbookService } from '../../services/workbook/workbook.service';
import { IModel } from '../model';

export interface IQuestionPartial {
  targetCell?: ICellAddress
  type: QuestionType
  points: number
  targetValue?: string
}

export interface IQuestion extends IQuestionPartial {
  getTargetCell(): Cell | undefined
  setTargetCell(cell: Cell | ICellAddress | undefined): void
}

export class Question implements IQuestion, IModel<IQuestionPartial> {
  targetCell?: ICellAddress;

  type: QuestionType;

  points: number;

  targetValue?: string;

  private cache: { targetCell?: Cell } = {};

  constructor(
    question: IQuestionPartial,
    private workbookService: WorkbookService,
  ) {
    this.targetCell = question.targetCell;
    this.type = question.type;
    this.points = question.points;
    this.targetValue = question.targetValue;
  }

  getSerializable(): IQuestionPartial {
    return {
      targetCell: this.targetCell,
      type: this.type,
      points: this.points,
      targetValue: this.targetValue,
    };
  }

  getTargetCell(): Cell | undefined {
    if (this.cache.targetCell) return this.cache.targetCell;
    if (this.targetCell) return this.workbookService.getCell(this.targetCell);
    return undefined;
  }

  setTargetCell(cell: Cell | ICellAddress | undefined) {
    if (cell === undefined) {
      this.targetCell = undefined;
      delete this.cache.targetCell;
      return;
    }
    if ('fullAddress' in cell) {
      this.cache.targetCell = cell;
      this.targetCell = cell.fullAddress;
    } else {
      this.targetCell = cell;
    }
  }
}
