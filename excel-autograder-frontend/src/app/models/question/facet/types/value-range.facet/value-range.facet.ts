import { Cell } from 'exceljs';
import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { ICellAddress } from '../../../misc';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export interface IValueRangeFacetPartial extends IFacetPartial {
  lowerBounds?: number
  upperBounds?: number
  targetCell?: ICellAddress
}

export interface IValueRangeFacet extends IValueRangeFacetPartial, IFacet {
}

export class ValueRangeFacet extends Facet implements IValueRangeFacet, IModel<IValueRangeFacetPartial> {
  readonly type: FacetType.ValueRangeFacet = FacetType.ValueRangeFacet;

  targetCell?: ICellAddress;

  lowerBounds?: number;

  upperBounds?: number;

  private cache: { targetCell?: Cell } = {};

  constructor(facet: IValueRangeFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.lowerBounds = facet.lowerBounds;
    this.upperBounds = facet.upperBounds;
    this.targetCell = facet.targetCell;
  }

  getName(): string {
    return 'Range';
  }

  getSerializable(): IValueRangeFacetPartial {
    return {
      type: this.type,
      points: this.points,
      lowerBounds: this.lowerBounds,
      upperBounds: this.upperBounds,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.lowerBounds || !this.upperBounds) throw new Error('Boundaries not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) throw new Error('Error reading cell object from workbook');
    if (!targetCell.value) return 0;
    return this.lowerBounds < +targetCell.value && +targetCell.value < this.upperBounds ? this.points : 0;
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
