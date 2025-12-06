import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../facet-type.enum';

export interface IValueFacetPartial extends IFacetPartial {
  value?: string
}

export interface IValueFacet extends IValueFacetPartial, IFacet {
}

export class ValueFacet extends Facet implements IValueFacet, IModel<IValueFacetPartial> {
  readonly type: FacetType.ValueFacet = FacetType.ValueFacet;

  value?: string;

  constructor(facet: IValueFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.value = facet.value;
  }

  getDefaultName(): string {
    return 'Value Equals';
  }

  getInfo(): Array<string> {
    return [
      `Target Cell:${this.targetCell?.address?.toString() ? ` ${this.targetCell.address.toString()}` : '&nbsp;<span class="red">Not set</span>'}`,
      `Value:${this.value != null ? ` ${this.value}` : '&nbsp;<span class="red">Not set</span>'}`,
    ];
  }

  getSerializable(): IValueFacetPartial {
    return {
      type: this.type,
      name: this.name,
      points: this.points,
      review: this.review,
      value: this.value,
      targetCell: this.targetCell,
    };
  }

  evaluateScore(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) return 0;
    return FancyWorkbook.getCellSafeValue(targetCell).value === `${this.value}` ? this.points : 0;
  }

  isValid(): boolean {
    return this.value != null && this.points != null && this.targetCell != null;
  }
}
