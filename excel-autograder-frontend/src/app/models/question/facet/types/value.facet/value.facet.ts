import { Cell } from 'exceljs';
import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { ICellAddress } from '../../../misc';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export interface IValueFacetPartial extends IFacetPartial {
  targetValue?: string
  targetCell?: ICellAddress
}

export interface IValueFacet extends IValueFacetPartial, IFacet {
}

export class ValueFacet extends Facet implements IValueFacet, IModel<IValueFacetPartial> {
  readonly type: FacetType.ValueFacet = FacetType.ValueFacet;

  targetValue?: string;

  targetCell?: ICellAddress;

  private cache: { targetCell?: Cell } = {};

  constructor(facet: IValueFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.targetValue = facet.targetValue;
    this.targetCell = facet.targetCell;
  }

  getName(): string {
    return 'Value';
  }

  getSerializable(): IValueFacetPartial {
    return {
      type: this.type,
      points: this.points,
      targetValue: this.targetValue,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) throw new Error('Error reading target cell from workbook');
    console.log(typeof this.points)
    return `${targetCell.value}` === `${this.targetValue}` ? this.points : 0;
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
