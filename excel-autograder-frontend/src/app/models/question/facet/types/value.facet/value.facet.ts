import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import { FacetType } from '../lib';

export interface IValueFacetPartial extends IFacetPartial {
  targetValue?: string
}

export interface IValueFacet extends IValueFacetPartial, IFacet {
}

export class ValueFacet extends Facet implements IValueFacet, IModel<IValueFacetPartial> {
  readonly type: FacetType.ValueFacet = FacetType.ValueFacet;

  targetValue?: string;

  constructor(facet: IValueFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.targetValue = facet.targetValue;
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
    return `${targetCell.value}` === `${this.targetValue}` ? this.points : 0;
  }
}
