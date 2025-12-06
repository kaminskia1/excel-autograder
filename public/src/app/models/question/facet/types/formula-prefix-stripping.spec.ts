/**
 * These tests verify that formulas with Excel's internal function prefixes
 * (_xlfn., _xlws.) are correctly stripped before matching.
 *
 * When Excel saves newer functions like STDEV.S, STDEV.P, CONCAT, IFS, etc.,
 * they are stored with the _xlfn. or _xlws. prefix in the formula string.
 * Our formula matching logic needs to strip these prefixes to correctly
 * identify the functions.
 */

describe('Facet Validation - isValid() null/undefined handling', () => {
  /**
   * These tests verify that isValid() correctly handles both null and undefined.
   * Properties defined as optional (e.g., value?: string) default to undefined,
   * so we must use != null (loose equality) not !== null (strict equality).
   */

  describe('Value check with != null (loose equality)', () => {
    it('should return false for undefined', () => {
      const value: string | undefined = undefined;
      expect(value != null).toBe(false);
    });

    it('should return false for null', () => {
      const value: string | null = null;
      expect(value != null).toBe(false);
    });

    it('should return true for empty string', () => {
      const value: string | undefined = '';
      expect(value != null).toBe(true);
    });

    it('should return true for a value', () => {
      const value: string | undefined = 'test';
      expect(value != null).toBe(true);
    });

    it('should return true for zero (number)', () => {
      const value: number | undefined = 0;
      expect(value != null).toBe(true);
    });
  });

  describe('WRONG: Value check with !== null (strict equality) - shows the bug', () => {
    it('should incorrectly return true for undefined (this is the bug)', () => {
      const value: string | undefined = undefined;
      // This is why !== null is WRONG for optional properties
      expect(value !== null).toBe(true); // BUG: undefined passes the check!
    });

    it('should return false for null', () => {
      const value: string | null = null;
      expect(value !== null).toBe(false);
    });
  });

  describe('Facet isValid simulation', () => {
    // Simulates the fixed isValid() check
    function isValidFacet(props: {
      value?: string;
      points?: number;
      targetCell?: { address: string };
    }): boolean {
      return props.value != null && props.points != null && props.targetCell != null;
    }

    it('should return false when value is undefined', () => {
      expect(isValidFacet({
        value: undefined,
        points: 10,
        targetCell: { address: 'A1' },
      })).toBe(false);
    });

    it('should return false when value is null', () => {
      expect(isValidFacet({
        value: null as any,
        points: 10,
        targetCell: { address: 'A1' },
      })).toBe(false);
    });

    it('should return false when points is undefined', () => {
      expect(isValidFacet({
        value: 'test',
        points: undefined,
        targetCell: { address: 'A1' },
      })).toBe(false);
    });

    it('should return false when targetCell is undefined', () => {
      expect(isValidFacet({
        value: 'test',
        points: 10,
        targetCell: undefined,
      })).toBe(false);
    });

    it('should return true when all required fields are set', () => {
      expect(isValidFacet({
        value: 'test',
        points: 10,
        targetCell: { address: 'A1' },
      })).toBe(true);
    });

    it('should return true when value is empty string (valid value)', () => {
      expect(isValidFacet({
        value: '',
        points: 10,
        targetCell: { address: 'A1' },
      })).toBe(true);
    });

    it('should return true when points is zero (valid value)', () => {
      expect(isValidFacet({
        value: 'test',
        points: 0,
        targetCell: { address: 'A1' },
      })).toBe(true);
    });
  });
});

describe('Formula Prefix Stripping', () => {
  /**
   * This is the same logic used in:
   * - FormulaListFacet.recurse()
   * - FormulaContainsFacet.evaluateScore()
   * - FormulaRegexFacet.evaluateScore()
   */
  function stripPrefixes(formula: string): string {
    return formula.replace(/_xlfn\./g, '').replace(/_xlws\./g, '');
  }

  describe('_xlfn prefix handling', () => {
    it('should strip _xlfn prefix from STDEV.S', () => {
      const formula = '_xlfn.STDEV.S(B1:B10)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('STDEV.S(B1:B10)');
    });

    it('should strip _xlfn prefix from STDEV.P', () => {
      const formula = '_xlfn.STDEV.P(B1:B10)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('STDEV.P(B1:B10)');
    });

    it('should strip _xlfn prefix from CONCAT', () => {
      const formula = '_xlfn.CONCAT(A1,B1,C1)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('CONCAT(A1,B1,C1)');
    });

    it('should strip _xlfn prefix from IFS', () => {
      const formula = '_xlfn.IFS(A1>10,"High",A1>5,"Medium",TRUE,"Low")';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('IFS(A1>10,"High",A1>5,"Medium",TRUE,"Low")');
    });

    it('should strip _xlfn prefix from MAXIFS', () => {
      const formula = '_xlfn.MAXIFS(A1:A10,B1:B10,">5")';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('MAXIFS(A1:A10,B1:B10,">5")');
    });

    it('should strip _xlfn prefix from MINIFS', () => {
      const formula = '_xlfn.MINIFS(A1:A10,B1:B10,"<5")';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('MINIFS(A1:A10,B1:B10,"<5")');
    });

    it('should strip _xlfn prefix from TEXTJOIN', () => {
      const formula = '_xlfn.TEXTJOIN(",",TRUE,A1:A10)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('TEXTJOIN(",",TRUE,A1:A10)');
    });

    it('should strip multiple _xlfn prefixes in same formula', () => {
      const formula = '_xlfn.STDEV.S(A1:A10)+_xlfn.STDEV.P(B1:B10)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('STDEV.S(A1:A10)+STDEV.P(B1:B10)');
    });

    it('should preserve formulas without _xlfn prefix', () => {
      const formula = 'SUM(A1:A10)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('SUM(A1:A10)');
    });

    it('should handle mixed prefixed and regular functions', () => {
      const formula = '_xlfn.STDEV.S(A1:A10)/AVERAGE(A1:A10)*100';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('STDEV.S(A1:A10)/AVERAGE(A1:A10)*100');
    });
  });

  describe('_xlws prefix handling', () => {
    it('should strip _xlws prefix from FILTER', () => {
      const formula = '_xlws.FILTER(A1:A10,B1:B10>5)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('FILTER(A1:A10,B1:B10>5)');
    });

    it('should strip _xlws prefix from SORT', () => {
      const formula = '_xlws.SORT(A1:A10,1,-1)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('SORT(A1:A10,1,-1)');
    });

    it('should strip _xlws prefix from UNIQUE', () => {
      const formula = '_xlws.UNIQUE(A1:A10)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('UNIQUE(A1:A10)');
    });

    it('should strip _xlws prefix from SORTBY', () => {
      const formula = '_xlws.SORTBY(A1:A10,B1:B10)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('SORTBY(A1:A10,B1:B10)');
    });

    it('should strip _xlws prefix from RANDARRAY', () => {
      const formula = '_xlws.RANDARRAY(5,5,1,100,TRUE)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('RANDARRAY(5,5,1,100,TRUE)');
    });

    it('should strip _xlws prefix from SEQUENCE', () => {
      const formula = '_xlws.SEQUENCE(10,1,1,1)';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('SEQUENCE(10,1,1,1)');
    });
  });

  describe('mixed _xlfn and _xlws prefixes', () => {
    it('should strip both prefixes in same formula', () => {
      const formula = '_xlfn.IFS(_xlws.FILTER(A1:A10,B1:B10>5)>10,"High",TRUE,"Low")';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('IFS(FILTER(A1:A10,B1:B10>5)>10,"High",TRUE,"Low")');
    });

    it('should handle complex nested formulas', () => {
      const formula = '_xlfn.STDEV.S(_xlws.FILTER(A1:A100,_xlws.UNIQUE(B1:B100)="Yes"))';
      const stripped = stripPrefixes(formula);
      expect(stripped).toBe('STDEV.S(FILTER(A1:A100,UNIQUE(B1:B100)="Yes"))');
    });
  });

  describe('function name extraction after stripping', () => {
    /**
     * This tests the regex used in FormulaListFacet.recurse() to extract
     * function names from formulas after stripping prefixes.
     */
    function extractFunctions(formula: string): string[] {
      const stripped = stripPrefixes(formula);
      const matches = stripped.match(/[A-Z.]+\(/g);
      return matches ? matches.map((fn) => fn.slice(0, -1)) : [];
    }

    it('should extract STDEV.S from _xlfn prefixed formula', () => {
      const formula = '_xlfn.STDEV.S(B1:B10)';
      const functions = extractFunctions(formula);
      expect(functions).toContain('STDEV.S');
    });

    it('should extract STDEV.P from _xlfn prefixed formula', () => {
      const formula = '_xlfn.STDEV.P(B1:B10)';
      const functions = extractFunctions(formula);
      expect(functions).toContain('STDEV.P');
    });

    it('should extract FILTER from _xlws prefixed formula', () => {
      const formula = '_xlws.FILTER(A1:A10,B1:B10>5)';
      const functions = extractFunctions(formula);
      expect(functions).toContain('FILTER');
    });

    it('should extract multiple functions from mixed formula', () => {
      const formula = '_xlfn.STDEV.S(A1:A10)+AVERAGE(A1:A10)';
      const functions = extractFunctions(formula);
      expect(functions).toContain('STDEV.S');
      expect(functions).toContain('AVERAGE');
    });

    it('should extract nested functions', () => {
      const formula = '_xlfn.ROUND(_xlfn.STDEV.S(A1:A10),2)';
      const functions = extractFunctions(formula);
      expect(functions).toContain('ROUND');
      expect(functions).toContain('STDEV.S');
    });
  });

  describe('formula contains matching after stripping', () => {
    /**
     * This tests the includes() logic used in FormulaContainsFacet.evaluateScore()
     */
    function formulaContains(cellFormula: string, searchText: string): boolean {
      const stripped = stripPrefixes(cellFormula);
      return stripped.includes(searchText);
    }

    it('should find STDEV.S in _xlfn prefixed formula', () => {
      const formula = '_xlfn.STDEV.S(B1:B10)';
      expect(formulaContains(formula, 'STDEV.S')).toBe(true);
    });

    it('should find STDEV.P in _xlfn prefixed formula', () => {
      const formula = '_xlfn.STDEV.P(B1:B10)';
      expect(formulaContains(formula, 'STDEV.P')).toBe(true);
    });

    it('should find range reference in _xlfn prefixed formula', () => {
      const formula = '_xlfn.STDEV.S(B1:B10)';
      expect(formulaContains(formula, 'B1:B10')).toBe(true);
    });

    it('should not match _xlfn prefix itself', () => {
      const formula = '_xlfn.STDEV.S(B1:B10)';
      expect(formulaContains(formula, '_xlfn')).toBe(false);
    });
  });

  describe('regex matching after stripping', () => {
    /**
     * This tests the regex.test() logic used in FormulaRegexFacet.evaluateScore()
     */
    function formulaMatchesRegex(cellFormula: string, pattern: string): boolean {
      const stripped = stripPrefixes(cellFormula);
      return new RegExp(pattern).test(stripped);
    }

    it('should match STDEV.S pattern in _xlfn prefixed formula', () => {
      const formula = '_xlfn.STDEV.S(B1:B10)';
      expect(formulaMatchesRegex(formula, 'STDEV\\.S\\(')).toBe(true);
    });

    it('should match STDEV.P pattern in _xlfn prefixed formula', () => {
      const formula = '_xlfn.STDEV.P(B1:B10)';
      expect(formulaMatchesRegex(formula, 'STDEV\\.P\\(')).toBe(true);
    });

    it('should match either STDEV.S or STDEV.P with alternation', () => {
      const formula1 = '_xlfn.STDEV.S(B1:B10)';
      const formula2 = '_xlfn.STDEV.P(B1:B10)';
      const pattern = 'STDEV\\.(S|P)\\(';
      expect(formulaMatchesRegex(formula1, pattern)).toBe(true);
      expect(formulaMatchesRegex(formula2, pattern)).toBe(true);
    });

    it('should not match _xlfn prefix pattern', () => {
      const formula = '_xlfn.STDEV.S(B1:B10)';
      expect(formulaMatchesRegex(formula, '^_xlfn\\.')).toBe(false);
    });

    it('should match formula that starts with function name', () => {
      const formula = '_xlfn.STDEV.S(B1:B10)';
      expect(formulaMatchesRegex(formula, '^STDEV\\.S')).toBe(true);
    });
  });
});
