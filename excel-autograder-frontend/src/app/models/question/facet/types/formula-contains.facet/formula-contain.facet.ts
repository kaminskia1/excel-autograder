import {
  Facet, IFacet, IFacetPartial,
} from '../../facet';
import { IModel } from '../../../../model';
import { FancyWorkbook } from '../../../../workbook/workbook';
import { WorkbookService } from '../../../../workbook/workbook.service';
import {Cell} from "exceljs";
import {ICellAddress} from "../../../misc";
import {FacetType} from "../lib";

export interface IFormulaContainsFacetPartial extends IFacetPartial {
  targetCell?: ICellAddress
  formula?: string
}

export interface IFormulaContainsFacet extends IFormulaContainsFacetPartial, IFacet {

}

export class FormulaContainsFacet extends Facet implements
  IFormulaContainsFacet, IModel<IFormulaContainsFacetPartial> {
  readonly type: FacetType.FormulaContainsFacet = FacetType.FormulaContainsFacet;

  formula?: string;

  targetCell?: ICellAddress;

  private cache: { targetCell?: Cell } = {};

  constructor(facet: IFormulaContainsFacetPartial, workbookService: WorkbookService) {
    super(facet, workbookService);
    this.targetCell = facet.targetCell;
    this.formula = facet.formula;
  }

  getName(): string {
    return 'Formula Contains';
  }

  getSerializable(): IFormulaContainsFacetPartial {
    return {
      type: this.type,
      points: this.points,
      formula: this.formula,
      targetCell: this.targetCell,
    };
  }

  evaluatePoints(workbook: FancyWorkbook): number {
    if (!this.targetCell) throw new Error('Target cell not set');
    if (!this.formula) throw new Error('Target formula not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) throw new Error('Error reading target cell from workbook');
    let cleaned = this.formula.replace(/"([^"]*")/g, '')
    return targetCell.formula.includes(cleaned) ? this.points : 0;
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
