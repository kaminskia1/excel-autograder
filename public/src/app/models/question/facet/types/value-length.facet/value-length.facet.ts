import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export interface IValueLengthFacetPartial extends IFacetPartial {
  minLength?: number
  maxLength?: number
}

export interface IValueLengthFacet extends IValueLengthFacetPartial, IFacet {
}

export class ValueLengthFacet extends Facet implements IValueLengthFacet,
  IModel<IValueLengthFacetPartial> {
  readonly type: FacetType.ValueLengthFacet = FacetType.ValueLengthFacet;

  minLength?: number;

  maxLength?: number;

  constructor(facet: IValueLengthFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.minLength = facet.minLength;
    this.maxLength = facet.maxLength;
  }

  getName(): string {
    return 'Value Length';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell: ${this.targetCell.address.toString() ?? 'Not set'}`,
      `Minimum Length: ${this.minLength ?? 'Not set'}`,
      `Maximum Length: ${this.maxLength ?? 'Not set'}`,
    ];
  }

  getSerializable(): IValueLengthFacetPartial {
    return {
      type: this.type,
      points: this.points,
      review: this.review,
      minLength: this.minLength,
      maxLength: this.maxLength,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.minLength && !this.maxLength) throw new Error('At least one of min or max length must be set');
    if (this.maxLength && this.minLength && this.maxLength < this.minLength) throw new Error('Max length less than min');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) return 0;
    const { value } = FancyWorkbook.getCellSafeValue(targetCell);
    if (this.minLength && value.length < this.minLength) return 0;
    if (this.maxLength && value.length > this.maxLength) return 0;
    return this.points;
  }

  isValid(): boolean {
    return (!(this.minLength == null && this.maxLength == null)
    ) && this.points != null && this.targetCell !== null;
  }
}
