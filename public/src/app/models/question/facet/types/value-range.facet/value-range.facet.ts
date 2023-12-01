import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export interface IValueRangeFacetPartial extends IFacetPartial {
  lowerBounds?: number
  upperBounds?: number
}

export interface IValueRangeFacet extends IValueRangeFacetPartial, IFacet {
}

export class ValueRangeFacet extends Facet implements IValueRangeFacet,
  IModel<IValueRangeFacetPartial> {
  readonly type: FacetType.ValueRangeFacet = FacetType.ValueRangeFacet;

  lowerBounds?: number;

  upperBounds?: number;

  constructor(facet: IValueRangeFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.lowerBounds = facet.lowerBounds;
    this.upperBounds = facet.upperBounds;
    this.targetCell = facet.targetCell;
  }

  getName(): string {
    return 'Value Range';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell: ${this.targetCell.address.toString() ?? 'Not set'}`,
      `Lower Bounds: ${this.lowerBounds ?? 'Not set'}`,
      `Upper Bounds: ${this.upperBounds ?? 'Not set'}`,
    ];
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
    if (!targetCell) return 0;
    const value = +FancyWorkbook.getCellSafeValue(targetCell).value;
    if (Number.isNaN(value)) return 0;
    return (this.lowerBounds <= value) && value <= this.upperBounds ? this.points : 0;
  }

  isValid(): boolean {
    return this.lowerBounds !== null && this.upperBounds !== null
      && this.points != null && this.targetCell !== null;
  }
}
