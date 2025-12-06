/**
 * Unit tests for Question score aggregation methods.
 *
 * Tests cover:
 * - getMaxScore(): Aggregates max points from all facets
 * - evaluateScore(): Sums actual scores from all facets
 * - evaluateResponses(): Returns Map with per-facet responses
 */

import { Workbook, Worksheet, CellFormulaValue } from 'exceljs';
import { FancyWorkbook } from '../workbook/workbook';
import { Question } from './question';
import { FacetFactory } from './facet/facet.factory';
import { WorkbookService } from '../workbook/workbook.service';
import { QuestionFlag, ICellAddress } from './misc';
import { FacetType } from './facet/types/facet-type.enum';
import { IFacetPartial } from './facet/facet';

/**
 * Helper to create a formula cell value with proper typing
 */
function createFormulaValue(formula: string): CellFormulaValue {
  return { formula } as CellFormulaValue;
}

/**
 * Helper to create a ValueFacet partial config
 */
function valueFacet(value: string, points: number, targetCell: ICellAddress): IFacetPartial {
  return {
    type: FacetType.ValueFacet,
    value,
    points,
    targetCell,
    review: QuestionFlag.None,
  } as IFacetPartial;
}

/**
 * Helper to create a ValueRangeFacet partial config
 */
function valueRangeFacet(
  lowerBounds: number,
  upperBounds: number,
  points: number,
  targetCell: ICellAddress,
): IFacetPartial {
  return {
    type: FacetType.ValueRangeFacet,
    lowerBounds,
    upperBounds,
    points,
    targetCell,
    review: QuestionFlag.None,
  } as IFacetPartial;
}

/**
 * Helper to create a FormulaListFacet partial config
 */
function formulaListFacet(formulas: string[], points: number, targetCell: ICellAddress): IFacetPartial {
  return {
    type: FacetType.FormulaListFacet,
    formulas,
    points,
    targetCell,
    review: QuestionFlag.None,
  } as IFacetPartial;
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
 * Helper to create a mock FacetFactory
 */
function createMockFacetFactory(): FacetFactory {
  const mockService = createMockWorkbookService();
  return new FacetFactory(mockService);
}

/**
 * Helper to create a test cell address
 */
function createCellAddress(sheetName: string, address: string, row: number, col: number): ICellAddress {
  return {
    sheetName, address, row, col,
  };
}

/**
 * Helper to create a FancyWorkbook from an ExcelJS Workbook
 */
async function createFancyWorkbook(setupFn: (wb: Workbook, ws: Worksheet) => void): Promise<FancyWorkbook> {
  const wb = new Workbook();
  const ws = wb.addWorksheet('Sheet1');
  setupFn(wb, ws);

  const buffer = await wb.xlsx.writeBuffer();
  const fancy = new FancyWorkbook();
  await fancy.xlsx.load(buffer);
  return fancy;
}

describe('Question', () => {
  const facetFactory = createMockFacetFactory();
  const targetCellA1 = createCellAddress('Sheet1', 'A1', 1, 1);
  const targetCellA2 = createCellAddress('Sheet1', 'A2', 2, 1);
  const targetCellA3 = createCellAddress('Sheet1', 'A3', 3, 1);

  describe('getMaxScore()', () => {
    it('should return 0 for question with no facets', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [],
      }, facetFactory);

      expect(question.getMaxScore()).toBe(0);
    });

    it('should return points from single facet', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [valueFacet('test', 10, targetCellA1)],
      }, facetFactory);

      expect(question.getMaxScore()).toBe(10);
    });

    it('should sum points from multiple facets', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [
          valueFacet('test1', 10, targetCellA1),
          valueFacet('test2', 15, targetCellA2),
          valueFacet('test3', 5, targetCellA3),
        ],
      }, facetFactory);

      expect(question.getMaxScore()).toBe(30);
    });

    it('should handle facets with zero points', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [
          valueFacet('test1', 10, targetCellA1),
          valueFacet('test2', 0, targetCellA2),
        ],
      }, facetFactory);

      expect(question.getMaxScore()).toBe(10);
    });
  });

  describe('evaluateScore()', () => {
    it('should return 0 for question with no facets', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'test';
      });

      const question = new Question({
        name: 'Test Question',
        facets: [],
      }, facetFactory);

      expect(question.evaluateScore(workbook)).toBe(0);
    });

    it('should return full points when single facet matches', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'correct';
      });

      const question = new Question({
        name: 'Test Question',
        facets: [valueFacet('correct', 10, targetCellA1)],
      }, facetFactory);

      expect(question.evaluateScore(workbook)).toBe(10);
    });

    it('should return 0 when single facet does not match', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'wrong';
      });

      const question = new Question({
        name: 'Test Question',
        facets: [valueFacet('correct', 10, targetCellA1)],
      }, facetFactory);

      expect(question.evaluateScore(workbook)).toBe(0);
    });

    it('should sum scores from multiple matching facets', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'correct1';
        ws.getCell('A2').value = 'correct2';
        ws.getCell('A3').value = 'correct3';
      });

      const question = new Question({
        name: 'Test Question',
        facets: [
          valueFacet('correct1', 10, targetCellA1),
          valueFacet('correct2', 15, targetCellA2),
          valueFacet('correct3', 5, targetCellA3),
        ],
      }, facetFactory);

      expect(question.evaluateScore(workbook)).toBe(30);
    });

    it('should return partial score when some facets match', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'correct1';
        ws.getCell('A2').value = 'wrong';
        ws.getCell('A3').value = 'correct3';
      });

      const question = new Question({
        name: 'Test Question',
        facets: [
          valueFacet('correct1', 10, targetCellA1),
          valueFacet('correct2', 15, targetCellA2),
          valueFacet('correct3', 5, targetCellA3),
        ],
      }, facetFactory);

      // Only facets 1 and 3 match (10 + 5 = 15)
      expect(question.evaluateScore(workbook)).toBe(15);
    });

    it('should handle mixed facet types', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'test';
        ws.getCell('A2').value = 50;
        ws.getCell('A3').value = createFormulaValue('SUM(B1:B10)');
      });

      const question = new Question({
        name: 'Test Question',
        facets: [
          valueFacet('test', 10, targetCellA1),
          valueRangeFacet(0, 100, 15, targetCellA2),
          formulaListFacet(['SUM'], 5, targetCellA3),
        ],
      }, facetFactory);

      expect(question.evaluateScore(workbook)).toBe(30);
    });
  });

  describe('evaluateResponses()', () => {
    it('should return empty Map for question with no facets', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'test';
      });

      const question = new Question({
        name: 'Test Question',
        facets: [],
      }, facetFactory);

      const responses = question.evaluateResponses(workbook);
      expect(responses.size).toBe(0);
    });

    it('should return response for each facet', async () => {
      const workbook = await createFancyWorkbook((wb, ws) => {
        ws.getCell('A1').value = 'correct';
        ws.getCell('A2').value = 'wrong';
      });

      const question = new Question({
        name: 'Test Question',
        facets: [
          valueFacet('correct', 10, targetCellA1),
          valueFacet('expected', 15, targetCellA2),
        ],
      }, facetFactory);

      const responses = question.evaluateResponses(workbook);
      expect(responses.size).toBe(2);

      // Get facets to check responses
      const facets = question.getFacets();

      // The return type annotation in Question says Map<Facet, number> but it actually returns objects
      type FacetResponse = { score: number; maxScore: number; providedValue: string };
      const response1 = responses.get(facets[0]) as unknown as FacetResponse;
      expect(response1).toBeDefined();
      expect(response1.score).toBe(10);
      expect(response1.maxScore).toBe(10);
      expect(response1.providedValue).toBe('correct');

      const response2 = responses.get(facets[1]) as unknown as FacetResponse;
      expect(response2).toBeDefined();
      expect(response2.score).toBe(0);
      expect(response2.maxScore).toBe(15);
      expect(response2.providedValue).toBe('wrong');
    });
  });

  describe('getFacets()', () => {
    it('should return empty array for question with no facets', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [],
      }, facetFactory);

      expect(question.getFacets()).toEqual([]);
    });

    it('should return all facets', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [
          valueFacet('test1', 10, targetCellA1),
          valueFacet('test2', 15, targetCellA2),
        ],
      }, facetFactory);

      expect(question.getFacets().length).toBe(2);
    });
  });

  describe('createFacet()', () => {
    it('should add facet to question', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [],
      }, facetFactory);

      expect(question.getFacets().length).toBe(0);

      question.createFacet(valueFacet('test', 10, targetCellA1));

      expect(question.getFacets().length).toBe(1);
    });
  });

  describe('removeFacet()', () => {
    it('should remove facet from question', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [valueFacet('test', 10, targetCellA1)],
      }, facetFactory);

      expect(question.getFacets().length).toBe(1);

      const facet = question.getFacets()[0];
      question.removeFacet(facet);

      expect(question.getFacets().length).toBe(0);
    });

    it('should throw error when facet not found', () => {
      const question1 = new Question({
        name: 'Test Question 1',
        facets: [],
      }, facetFactory);

      const question2 = new Question({
        name: 'Test Question 2',
        facets: [valueFacet('test', 10, targetCellA1)],
      }, facetFactory);

      const facetFromQuestion2 = question2.getFacets()[0];

      expect(() => question1.removeFacet(facetFromQuestion2)).toThrowError(Error, 'Facet not found in question');
    });
  });

  describe('getSerializable()', () => {
    it('should return serializable object', () => {
      const question = new Question({
        name: 'Test Question',
        facets: [valueFacet('test', 10, targetCellA1)],
      }, facetFactory);

      const serialized = question.getSerializable();

      expect(serialized.name).toBe('Test Question');
      expect(serialized.facets.length).toBe(1);
      expect(serialized.facets[0].type).toBe(FacetType.ValueFacet);
    });
  });
});
