import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../facet-type.enum';

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

  getDefaultName(): string {
    return 'Value Range';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell:${this.targetCell?.address?.toString() ? ' ' + this.targetCell.address.toString() : '&nbsp;<span class="red">Not set</span>'}`,
      `Lower Bounds:${this.lowerBounds != null ? ' ' + this.lowerBounds : '&nbsp;<span class="red">Not set</span>'}`,
      `Upper Bounds:${this.upperBounds != null ? ' ' + this.upperBounds : '&nbsp;<span class="red">Not set</span>'}`,
    ];
  }

  getSerializable(): IValueRangeFacetPartial {
    return {
      type: this.type,
      name: this.name,
      points: this.points,
      review: this.review,
      lowerBounds: this.lowerBounds,
      upperBounds: this.upperBounds,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    console.log(this.lowerBounds)
    if (typeof this.lowerBounds != "number" || typeof this.upperBounds != "number") throw new Error('Boundaries not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) return 0;
    const value = +FancyWorkbook.getCellSafeValue(targetCell).value;
    if (Number.isNaN(value)) return 0;
    return (this.lowerBounds <= value) && value <= this.upperBounds ? this.points : 0;
  }

  isValid(): boolean {
    return this.lowerBounds != null && this.upperBounds != null
      && this.points != null && this.targetCell != null;
  }
}
