import { Cell } from 'exceljs';
import { IModel } from '../../model';
import { WorkbookService } from '../../workbook/workbook.service';
import { FacetType } from './types/lib';
import { ICellAddress } from '../misc';
import { FancyWorkbook } from '../../workbook/workbook';

export interface IFacetPartial {
  type: FacetType
  points: number
  targetCell: ICellAddress
}

export interface IFacet extends IFacetPartial, IModel<IFacetPartial> {
  evaluateScore(workbook: FancyWorkbook): number
  getMaxScore(): number
  getName(): string
  getTargetCell(): Cell | undefined
  setTargetCell(cell: Cell | ICellAddress | undefined): void
}

export abstract class Facet implements IFacet {
  abstract readonly type: FacetType;

  points = 1;

  targetCell: ICellAddress;

  private cache: { targetCell?: Cell } = {};

  protected constructor(facet: IFacetPartial, protected workbookService: WorkbookService) {
    this.points = facet.points ?? 1;
    this.targetCell = facet.targetCell;
  }

  abstract evaluateScore(workbook: FancyWorkbook): number

  abstract getSerializable(): IFacetPartial

  abstract getName(): string

  getMaxScore(): number {
    return this.points;
  }

  getTargetCell(): Cell | undefined {
    if (this.cache.targetCell) return this.cache.targetCell;
    if (this.targetCell) return this.workbookService.getCell(this.targetCell);
    return undefined;
  }

  setTargetCell(cell: Cell | ICellAddress) {
    if ('fullAddress' in cell) {
      this.cache.targetCell = cell;
      this.targetCell = cell.fullAddress;
    } else {
      this.targetCell = cell;
    }
  }
}
