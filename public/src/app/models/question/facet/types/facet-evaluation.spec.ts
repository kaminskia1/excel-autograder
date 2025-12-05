/**
 * Unit tests for facet evaluateScore() and isValid() methods.
 * 
 * These tests cover the core grading logic for all facet types:
 * - ValueFacet: Exact value matching
 * - FormulaListFacet: Formula function matching with prefix stripping
 * - FormulaContainsFacet: Formula substring matching
 * - FormulaRegexFacet: Formula regex pattern matching
 * - ValueRangeFacet: Numeric range validation
 * - ValueLengthFacet: String length validation
 */

import { Workbook, Worksheet, CellFormulaValue } from 'exceljs';
import { FancyWorkbook } from '../../../workbook/workbook';
import { WorkbookService } from '../../../workbook/workbook.service';
import { QuestionFlag, ICellAddress } from '../../misc';
import { FacetType } from './facet-type.enum';

import { ValueFacet, IValueFacetPartial } from './value.facet/value.facet';
import { FormulaListFacet, IFormulaListFacetPartial } from './formula-list.facet/formula-list.facet';
import { FormulaContainsFacet, IFormulaContainsFacetPartial } from './formula-contains.facet/formula-contain.facet';
import { FormulaRegexFacet, IFormulaRegexFacetPartial } from './formula-regex.facet/formula-regex.facet';
import { ValueRangeFacet, IValueRangeFacetPartial } from './value-range.facet/value-range.facet';
import { ValueLengthFacet, IValueLengthFacetPartial } from './value-length.facet/value-length.facet';

/**
 * Helper to create a formula cell value with proper typing
 */
function createFormulaValue(formula: string): CellFormulaValue {
  return { formula } as CellFormulaValue;
}

/**
 * Helper to create a mock WorkbookService
 */
function createMockWorkbookService(): WorkbookService {
  return {
    getCell: () => undefined,
  } as unknown as WorkbookService;
}

/**
 * Helper to create a test cell address
 */
function createCellAddress(sheetName: string, address: string, row: number, col: number): ICellAddress {
  return { sheetName, address, row, col };
}

/**
 * Helper to create a FancyWorkbook from an ExcelJS Workbook
 */
async function createFancyWorkbook(setupFn: (wb: Workbook, ws: Worksheet) => void): Promise<FancyWorkbook> {
  const wb = new Workbook();
  const ws = wb.addWorksheet('Sheet1');
  setupFn(wb, ws);
  
  // Convert to FancyWorkbook by writing to buffer and reading back
  const buffer = await wb.xlsx.writeBuffer();
  const fancy = new FancyWorkbook();
  await fancy.xlsx.load(buffer);
  return fancy;
}

describe('ValueFacet', () => {
  const mockService = createMockWorkbookService();
  const targetCell = createCellAddress('Sheet1', 'A1', 1, 1);
  
  describe('isValid()', () => {
    it('should return true when all required fields are set', () => {
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: 'test',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return false when value is undefined', () => {
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });

    it('should handle undefined points by converting to NaN (constructor behavior)', () => {
      // Note: The Facet constructor does `this.points = +facet.points ?? 1`
      // When points is undefined: +undefined = NaN, and NaN ?? 1 = NaN (not null/undefined)
      // So NaN != null is true, which means isValid() returns true even though points is NaN
      // This is technically a bug in the constructor, but we document the actual behavior here
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: 'test',
        points: undefined as any,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      // The current implementation returns true because NaN != null
      expect(facet.isValid()).toBe(true);
      // But points is NaN
      expect(Number.isNaN(facet.points)).toBe(true);
    });

    it('should return false when targetCell is undefined', () => {
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: 'test',
        points: 10,
        targetCell: undefined as any,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });

    it('should return true when value is empty string', () => {
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: '',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return true when points is zero', () => {
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: 'test',
        points: 0,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });
  });

  describe('evaluateScore()', () => {
    it('should return points when cell value matches exactly', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Hello';
      });
      
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: 'Hello',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when cell value does not match', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Hello';
      });
      
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: 'World',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should return 0 when cell is empty', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        // Cell A1 is not set
      });
      
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: 'test',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should match numeric values as strings', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 42;
      });
      
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: '42',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should throw error when targetCell is not set', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'test';
      });
      
      const facet = new ValueFacet({
        type: FacetType.ValueFacet,
        value: 'test',
        points: 10,
        targetCell: undefined as any,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(() => facet.evaluateScore(workbook)).toThrowError(Error, 'Target cell not set');
    });
  });
});

describe('FormulaListFacet', () => {
  const mockService = createMockWorkbookService();
  const targetCell = createCellAddress('Sheet1', 'A1', 1, 1);

  describe('isValid()', () => {
    it('should return true when all required fields are set', () => {
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: ['SUM', 'AVERAGE'],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return false when formulas is undefined', () => {
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });

    it('should return false when formulas is empty array', () => {
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: [],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });
  });

  describe('evaluateScore()', () => {
    it('should return points when formula contains required function', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('SUM(B1:B10)');
      });
      
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: ['SUM'],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when formula does not contain required function', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('AVERAGE(B1:B10)');
      });
      
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: ['SUM'],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should return points when all required functions are present', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('SUM(B1:B10)+AVERAGE(C1:C10)');
      });
      
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: ['SUM', 'AVERAGE'],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when cell has no formula', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Just text';
      });
      
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: ['SUM'],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should strip _xlfn prefix and match STDEV.S', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('_xlfn.STDEV.S(B1:B10)');
      });
      
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: ['STDEV.S'],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should strip _xlfn prefix and match STDEV.P', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('_xlfn.STDEV.P(B1:B10)');
      });
      
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: ['STDEV.P'],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should strip _xlws prefix and match FILTER', async () => {
      // Note: Using simple FILTER formula without cell references to avoid recursive evaluation
      // The FormulaListFacet.recurse() follows cell references which can cause issues in tests
      const workbook = await createFancyWorkbook((wb, ws) => {
        // Put data in Z1 that doesn't reference back to A1 to avoid recursion
        ws.getCell('Z1').value = 1;
        ws.getCell('A1').value = createFormulaValue('_xlws.FILTER(Z1,Z1>0)');
      });
      
      const facet = new FormulaListFacet({
        type: FacetType.FormulaListFacet,
        formulas: ['FILTER'],
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });
  });
});

describe('FormulaContainsFacet', () => {
  const mockService = createMockWorkbookService();
  const targetCell = createCellAddress('Sheet1', 'A1', 1, 1);

  describe('isValid()', () => {
    it('should return true when all required fields are set', () => {
      const facet = new FormulaContainsFacet({
        type: FacetType.FormulaContainsFacet,
        formula: 'SUM',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return false when formula is undefined', () => {
      const facet = new FormulaContainsFacet({
        type: FacetType.FormulaContainsFacet,
        formula: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });
  });

  describe('evaluateScore()', () => {
    it('should return points when formula contains search string', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('SUM(B1:B10)');
      });
      
      const facet = new FormulaContainsFacet({
        type: FacetType.FormulaContainsFacet,
        formula: 'SUM',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when formula does not contain search string', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('AVERAGE(B1:B10)');
      });
      
      const facet = new FormulaContainsFacet({
        type: FacetType.FormulaContainsFacet,
        formula: 'SUM',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should strip _xlfn prefix before matching', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('_xlfn.STDEV.S(B1:B10)');
      });
      
      const facet = new FormulaContainsFacet({
        type: FacetType.FormulaContainsFacet,
        formula: 'STDEV.S',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should match cell references', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('SUM(B1:B10)');
      });
      
      const facet = new FormulaContainsFacet({
        type: FacetType.FormulaContainsFacet,
        formula: 'B1:B10',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });
  });
});

describe('FormulaRegexFacet', () => {
  const mockService = createMockWorkbookService();
  const targetCell = createCellAddress('Sheet1', 'A1', 1, 1);

  describe('isValid()', () => {
    it('should return true when expression is valid regex', () => {
      const facet = new FormulaRegexFacet({
        type: FacetType.FormulaRegexFacet,
        expression: 'SUM\\(',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return false when expression is undefined', () => {
      const facet = new FormulaRegexFacet({
        type: FacetType.FormulaRegexFacet,
        expression: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });

    it('should return false when expression is invalid regex', () => {
      const facet = new FormulaRegexFacet({
        type: FacetType.FormulaRegexFacet,
        expression: '[invalid',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });
  });

  describe('evaluateScore()', () => {
    it('should return points when formula matches regex', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('SUM(B1:B10)');
      });
      
      const facet = new FormulaRegexFacet({
        type: FacetType.FormulaRegexFacet,
        expression: 'SUM\\(.*\\)',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when formula does not match regex', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('AVERAGE(B1:B10)');
      });
      
      const facet = new FormulaRegexFacet({
        type: FacetType.FormulaRegexFacet,
        expression: '^SUM\\(',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should strip _xlfn prefix before matching', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('_xlfn.STDEV.S(B1:B10)');
      });
      
      const facet = new FormulaRegexFacet({
        type: FacetType.FormulaRegexFacet,
        expression: '^STDEV\\.S\\(',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should match STDEV.S or STDEV.P using alternation', async () => {
      const workbook1 = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('_xlfn.STDEV.S(B1:B10)');
      });
      const workbook2 = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('_xlfn.STDEV.P(B1:B10)');
      });
      
      const facet = new FormulaRegexFacet({
        type: FacetType.FormulaRegexFacet,
        expression: 'STDEV\\.(S|P)\\(',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook1)).toBe(10);
      expect(facet.evaluateScore(workbook2)).toBe(10);
    });

    it('should throw error for invalid regex', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = createFormulaValue('SUM(B1:B10)');
      });
      
      const facet = new FormulaRegexFacet({
        type: FacetType.FormulaRegexFacet,
        expression: '[invalid',
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(() => facet.evaluateScore(workbook)).toThrowError(Error, 'Error parsing regex');
    });
  });
});

describe('ValueRangeFacet', () => {
  const mockService = createMockWorkbookService();
  const targetCell = createCellAddress('Sheet1', 'A1', 1, 1);

  describe('isValid()', () => {
    it('should return true when both bounds are set', () => {
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: 100,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return false when lowerBounds is undefined', () => {
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: undefined,
        upperBounds: 100,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });

    it('should return false when upperBounds is undefined', () => {
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });

    it('should return true when bounds are zero', () => {
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: 0,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });
  });

  describe('evaluateScore()', () => {
    it('should return points when value is within range', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 50;
      });
      
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: 100,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return points when value equals lower bound', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 0;
      });
      
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: 100,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return points when value equals upper bound', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 100;
      });
      
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: 100,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when value is below range', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = -1;
      });
      
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: 100,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should return 0 when value is above range', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 101;
      });
      
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: 100,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should return 0 when cell contains non-numeric value', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'not a number';
      });
      
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: 0,
        upperBounds: 100,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should handle negative ranges', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = -50;
      });
      
      const facet = new ValueRangeFacet({
        type: FacetType.ValueRangeFacet,
        lowerBounds: -100,
        upperBounds: -1,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });
  });
});

describe('ValueLengthFacet', () => {
  const mockService = createMockWorkbookService();
  const targetCell = createCellAddress('Sheet1', 'A1', 1, 1);

  describe('isValid()', () => {
    it('should return true when minLength is set', () => {
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: 5,
        maxLength: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return true when maxLength is set', () => {
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: undefined,
        maxLength: 10,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return true when both bounds are set', () => {
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: 5,
        maxLength: 10,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });

    it('should return false when neither bound is set', () => {
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: undefined,
        maxLength: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(false);
    });

    it('should return true when minLength is zero', () => {
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: 0,
        maxLength: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      expect(facet.isValid()).toBe(true);
    });
  });

  describe('evaluateScore()', () => {
    it('should return points when length meets minimum', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Hello';
      });
      
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: 3,
        maxLength: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when length is below minimum', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Hi';
      });
      
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: 5,
        maxLength: undefined,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should return points when length is within maximum', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Hello';
      });
      
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: undefined,
        maxLength: 10,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when length exceeds maximum', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Hello World';
      });
      
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: undefined,
        maxLength: 5,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(0);
    });

    it('should return points when length is within both bounds', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Hello';
      });
      
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: 3,
        maxLength: 10,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(facet.evaluateScore(workbook)).toBe(10);
    });

    it('should throw error when maxLength is less than minLength', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'Hello';
      });
      
      const facet = new ValueLengthFacet({
        type: FacetType.ValueLengthFacet,
        minLength: 10,
        maxLength: 5,
        points: 10,
        targetCell,
        review: QuestionFlag.None,
      }, mockService);
      
      expect(() => facet.evaluateScore(workbook)).toThrowError(Error, 'Max length less than min');
    });
  });
});

