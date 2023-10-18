import { Workbook } from 'exceljs';
import {
  Facet, FacetType, IFacet, IFacetPartial,
} from '../facet';
import { IModel } from '../../../model';
import { ICellAddress } from '../../misc';

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

  constructor(facet: IValueFacetPartial) {
    super(facet);
    this.targetValue = facet.targetValue;
    this.targetCell = facet.targetCell;
  }

  getSerializable(): IValueFacetPartial {
    return {
      type: this.type,
      points: this.points,
      targetValue: this.targetValue,
      targetCell: this.targetCell,
    };
  }

  evaluatePoints(workbook: Workbook): number {
    return this.points;
  }
}
