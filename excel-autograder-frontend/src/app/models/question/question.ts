import { Cell } from 'exceljs';
import { ICellAddress, QuestionType } from './misc';
import { WorkbookService } from '../workbook/workbook.service';
import { IModel } from '../model';
import { IFacet } from './fascet/facet';

export interface IQuestionPartial {
  targetCell?: ICellAddress
  type: QuestionType
  points: number
  targetValue?: string
  attributes: Array<IFacet>
}

export interface IQuestion extends IQuestionPartial, IModel<IQuestionPartial> {
  getTargetCell(): Cell | undefined
  setTargetCell(cell: Cell | ICellAddress | undefined): void
}

export class Question implements IQuestion {
  targetCell?: ICellAddress;

  type: QuestionType;

  points: number;

  targetValue?: string;

  attributes: Array<IFacet> = [];

  private cache: { targetCell?: Cell } = {};

  constructor(
    question: IQuestionPartial,
    private workbookService: WorkbookService,
  ) {
    this.targetCell = question.targetCell;
    this.type = question.type;
    this.points = question.points;
    this.targetValue = question.targetValue;
    this.attributes = question.attributes;
  }

  getSerializable(): IQuestionPartial {
    return {
      targetCell: this.targetCell,
      type: this.type,
      points: this.points,
      targetValue: this.targetValue,
      attributes: this.attributes,
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
