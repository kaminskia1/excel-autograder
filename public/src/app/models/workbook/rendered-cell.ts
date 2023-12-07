import { Cell, FillPattern, Color } from 'exceljs';

export type RenderedCellColor = {
  background: string,
  border: string,
  color: string
}

// Excel default theme colors
const COLORS: [number, number, number][] = [
  [255, 255, 255],
  [0, 0, 0],
  [238, 236, 225],
  [213, 73, 125],
  [79, 129, 189],
  [192, 80, 77],
  [155, 187, 89],
  [128, 100, 162],
  [75, 172, 198],
  [247, 150, 70],
];

function isFillStandard(value: unknown): value is FillPattern {
  return typeof value === 'object' && value !== null && 'fgColor' in value;
}

function toRGB(fill: Partial<Color> | undefined): string {
  const theme = COLORS[fill?.theme ?? -1];
  if (!theme) return 'rgb(255, 255, 255)';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ExcelJS doesn't recognize its own type
  const tint = fill?.tint ?? 1;
  const fn = (val: number, tin: number) => val + (255 - val) * tin;
  return `rgb(${fn(theme[0], tint)}, ${fn(theme[1], tint)}, ${fn(theme[2], tint)})`;
}

export class RenderedCell {
  parent: Cell;

  safeValue: string;

  fill: string;

  isHighlighted: boolean;

  isHighlightedColor: RenderedCellColor;

  height: number;

  constructor(parent: Cell, height = 2, safeValue = '', isHighlighted = false, isHighlightedColor = {
    background: 'rgba(0, 0, 0, .065)',
    border: 'rgba(0, 0, 0, .125)',
    color: '',
  }) {
    this.parent = parent;
    this.height = height;
    this.fill = isFillStandard(parent.fill) ? toRGB(parent.fill.fgColor) : '';
    this.safeValue = safeValue;
    this.isHighlighted = isHighlighted;
    this.isHighlightedColor = isHighlightedColor;
  }
}

export type RenderedColumn = {
  width: number,
  letter: string,
  values: Array<RenderedCell>
}
export type RenderedTable = Array<RenderedColumn>
