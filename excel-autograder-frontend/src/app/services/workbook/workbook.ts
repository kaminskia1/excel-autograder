import {Cell} from "exceljs";

export type RenderedTable = Array<{letter: string, values:Array<RenderedCell>}>

export type RenderedCellColor = {
  background: string,
  border: string,
  color: string
}

export class RenderedCell {
  parent: Cell
  safeValue: string
  isHighlighted: boolean
  isHighlightedColor: RenderedCellColor
  constructor(parent: Cell, safeValue = "", isHighlighted = false, isHighlightedColor = {background: "rgba(0, 0, 0, .075)", border: "rgba(0, 0, 0, .125)", color: ""}) {
    this.parent = parent;
    this.safeValue = safeValue;
    this.isHighlighted = isHighlighted;
    this.isHighlightedColor = isHighlightedColor;
  }
}
