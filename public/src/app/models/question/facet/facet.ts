import { Cell } from 'exceljs';
import { IModel } from '../../model';
import { WorkbookService } from '../../workbook/workbook.service';
import { FacetType } from './types/lib';
import { ICellAddress, QuestionFlag } from '../misc';
import { FancyWorkbook } from '../../workbook/workbook';

export const FORMULAS = ['ABS', 'ACCRINT', 'ACCRINTM', 'ACOS', 'ACOSH', 'ACOT', 'ACOTH', 'AGGREGATE', 'ADDRESS', 'AMORDEGRC', 'AMORLINC', 'AND', 'ARABIC', 'AREAS', 'ARRAYTOTEXT', 'ASC', 'ASIN', 'ASINH', 'ATAN', 'ATAN2', 'ATANH', 'AVEDEV', 'AVERAGE', 'AVERAGEA', 'AVERAGEIF', 'AVERAGEIFS', 'BAHTTEXT', 'BASE', 'BESSELI', 'BESSELJ', 'BESSELK', 'BESSELY', 'BETADIST', 'BETA.DIST', 'BETAINV', 'BETA.INV', 'BIN2DEC', 'BIN2HEX', 'BIN2OCT', 'BINOMDIST', 'BINOM.DIST', 'BINOM.DIST.RANGE', 'BINOM.INV', 'BITAND', 'BITLSHIFT', 'BITOR', 'BITRSHIFT', 'BITXOR', 'BYCOL', 'BYROW', 'CALL', 'CEILING', 'CEILING.MATH', 'CEILING.PRECISE', 'CELL', 'CHAR', 'CHIDIST', 'CHIINV', 'CHITEST', 'CHISQ.DIST', 'CHISQ.DIST.RT', 'CHISQ.INV', 'CHISQ.INV.RT', 'CHISQ.TEST', 'CHOOSE', 'CHOOSECOLS', 'CHOOSEROWS', 'CLEAN', 'CODE', 'COLUMN', 'COLUMNS', 'COMBIN', 'COMBINA', 'COMPLEX', 'CONCAT', 'CONCATENATE', 'CONFIDENCE', 'CONFIDENCE.NORM', 'CONFIDENCE.T', 'CONVERT', 'CORREL', 'COS', 'COSH', 'COT', 'COTH', 'COUNT', 'COUNTA', 'COUNTBLANK', 'COUNTIF', 'COUNTIFS', 'COUPDAYBS', 'COUPDAYS', 'COUPDAYSNC', 'COUPNCD', 'COUPNUM', 'COUPPCD', 'COVAR', 'COVARIANCE.P', 'COVARIANCE.S', 'CRITBINOM', 'CSC', 'CSCH', 'CUBEKPIMEMBER', 'CUBEMEMBER', 'CUBEMEMBERPROPERTY', 'CUBERANKEDMEMBER', 'CUBESET', 'CUBESETCOUNT', 'CUBEVALUE', 'CUMIPMT', 'CUMPRINC', 'DATE', 'DATEDIF', 'DATEVALUE', 'DAVERAGE', 'DAY', 'DAYS', 'DAYS360', 'DB', 'DBCS', 'DCOUNT', 'DCOUNTA', 'DDB', 'DEC2BIN', 'DEC2HEX', 'DEC2OCT', 'DECIMAL', 'DEGREES', 'DELTA', 'DEVSQ', 'DGET', 'DISC', 'DMAX', 'DMIN', 'DOLLAR', 'DOLLARDE', 'DOLLARFR', 'DPRODUCT', 'DROP', 'DSTDEV', 'DSTDEVP', 'DSUM', 'DURATION', 'DVAR', 'DVARP', 'EDATE', 'EFFECT', 'ENCODEURL', 'EOMONTH', 'ERF', 'ERF.PRECISE', 'ERFC', 'ERFC.PRECISE', 'ERROR.TYPE', 'EUROCONVERT', 'EVEN', 'EXACT', 'EXP', 'EXPAND', 'EXPON.DIST', 'EXPONDIST', 'FACT', 'FACTDOUBLE', 'FALSE', 'F.DIST', 'FDIST', 'F.DIST.RT', 'FILTER', 'FILTERXML', 'FIND,', 'F.INV', 'F.INV.RT', 'FINV', 'FISHER', 'FISHERINV', 'FIXED', 'FLOOR', 'FLOOR.MATH', 'FLOOR.PRECISE', 'FORECAST', 'FORECAST.ETS', 'FORECAST.ETS.CONFINT', 'FORECAST.ETS.SEASONALITY', 'FORECAST.ETS.STAT', 'FORECAST.LINEAR', 'FORMULATEXT', 'FREQUENCY', 'F.TEST', 'FTEST', 'FV', 'FVSCHEDULE', 'GAMMA', 'GAMMA.DIST', 'GAMMADIST', 'GAMMA.INV', 'GAMMAINV', 'GAMMALN', 'GAMMALN.PRECISE', 'GAUSS', 'GCD', 'GEOMEAN', 'GESTEP', 'GETPIVOTDATA', 'GROWTH', 'HARMEAN', 'HEX2BIN', 'HEX2DEC', 'HEX2OCT', 'HLOOKUP', 'HOUR', 'HSTACK', 'HYPERLINK', 'HYPGEOM.DIST', 'HYPGEOMDIST', 'IF', 'IFERROR', 'IFNA', 'IFS', 'IMABS', 'IMAGE', 'IMAGINARY', 'IMARGUMENT', 'IMCONJUGATE', 'IMCOS', 'IMCOSH', 'IMCOT', 'IMCSC', 'IMCSCH', 'IMDIV', 'IMEXP', 'IMLN', 'IMLOG10', 'IMLOG2', 'IMPOWER', 'IMPRODUCT', 'IMREAL', 'IMSEC', 'IMSECH', 'IMSIN', 'IMSINH', 'IMSQRT', 'IMSUB', 'IMSUM', 'IMTAN', 'INDEX', 'INDIRECT', 'INFO', 'INT', 'INTERCEPT', 'INTRATE', 'IPMT', 'IRR', 'ISBLANK', 'ISERR', 'ISERROR', 'ISEVEN', 'ISFORMULA', 'ISLOGICAL', 'ISNA', 'ISNONTEXT', 'ISNUMBER', 'ISODD', 'ISOMITTED', 'ISREF', 'ISTEXT', 'ISO.CEILING', 'ISOWEEKNUM', 'ISPMT', 'JIS', 'KURT', 'LAMBDA', 'LARGE', 'LCM', 'LEFT,', 'LEN,', 'LET', 'LINEST', 'LN', 'LOG', 'LOG10', 'LOGEST', 'LOGINV', 'LOGNORM.DIST', 'LOGNORMDIST', 'LOGNORM.INV', 'LOOKUP', 'LOWER', 'MAKEARRAY', 'MAP', 'MATCH', 'MAX', 'MAXA', 'MAXIFS', 'MDETERM', 'MDURATION', 'MEDIAN', 'MID,', 'MIN', 'MINIFS', 'MINA', 'MINUTE', 'MINVERSE', 'MIRR', 'MMULT', 'MOD', 'MODE', 'MODE.MULT', 'MODE.SNGL', 'MONTH', 'MROUND', 'MULTINOMIAL', 'MUNIT', 'N', 'NA', 'NEGBINOM.DIST', 'NEGBINOMDIST', 'NETWORKDAYS', 'NETWORKDAYS.INTL', 'NOMINAL', 'NORM.DIST', 'NORMDIST', 'NORMINV', 'NORM.INV', 'NORM.S.DIST', 'NORMSDIST', 'NORM.S.INV', 'NORMSINV', 'NOT', 'NOW', 'NPER', 'NPV', 'NUMBERVALUE', 'OCT2BIN', 'OCT2DEC', 'OCT2HEX', 'ODD', 'ODDFPRICE', 'ODDFYIELD', 'ODDLPRICE', 'ODDLYIELD', 'OFFSET', 'OR', 'PDURATION', 'PEARSON', 'PERCENTILE.EXC', 'PERCENTILE.INC', 'PERCENTILE', 'PERCENTRANK.EXC', 'PERCENTRANK.INC', 'PERCENTRANK', 'PERMUT', 'PERMUTATIONA', 'PHI', 'PHONETIC', 'PI', 'PMT', 'POISSON.DIST', 'POISSON', 'POWER', 'PPMT', 'PRICE', 'PRICEDISC', 'PRICEMAT', 'PROB', 'PRODUCT', 'PROPER', 'PV', 'QUARTILE', 'QUARTILE.EXC', 'QUARTILE.INC', 'QUOTIENT', 'RADIANS', 'RAND', 'RANDARRAY', 'RANDBETWEEN', 'RANK.AVG', 'RANK.EQ', 'RANK', 'RATE', 'RECEIVED', 'REDUCE', 'REGISTER.ID', 'REPLACE,', 'REPT', 'RIGHT,', 'ROMAN', 'ROUND', 'ROUNDDOWN', 'ROUNDUP', 'ROW', 'ROWS', 'RRI', 'RSQ', 'RTD', 'SCAN', 'SEARCH,', 'SEC', 'SECH', 'SECOND', 'SEQUENCE', 'SERIESSUM', 'SHEET', 'SHEETS', 'SIGN', 'SIN', 'SINH', 'SKEW', 'SKEW.P', 'SLN', 'SLOPE', 'SMALL', 'SORT', 'SORTBY', 'SQRT', 'SQRTPI', 'STANDARDIZE', 'STOCKHISTORY', 'STDEV', 'STDEV.P', 'STDEV.S', 'STDEVA', 'STDEVP', 'STDEVPA', 'STEYX', 'SUBSTITUTE', 'SUBTOTAL', 'SUM', 'SUMIF', 'SUMIFS', 'SUMPRODUCT', 'SUMSQ', 'SUMX2MY2', 'SUMX2PY2', 'SUMXMY2', 'SWITCH', 'SYD', 'T', 'TAN', 'TANH', 'TAKE', 'TBILLEQ', 'TBILLPRICE', 'TBILLYIELD', 'T.DIST', 'T.DIST.2T', 'T.DIST.RT', 'TDIST', 'TEXT', 'TEXTAFTER', 'TEXTBEFORE', 'TEXTJOIN', 'TEXTSPLIT', 'TIME', 'TIMEVALUE', 'T.INV', 'T.INV.2T', 'TINV', 'TOCOL', 'TOROW', 'TODAY', 'TRANSPOSE', 'TREND', 'TRIM', 'TRIMMEAN', 'TRUE', 'TRUNC', 'T.TEST', 'TTEST', 'TYPE', 'UNICHAR', 'UNICODE', 'UNIQUE', 'UPPER', 'VALUE', 'VALUETOTEXT', 'VAR', 'VAR.P', 'VAR.S', 'VARA', 'VARP', 'VARPA', 'VDB', 'VLOOKUP', 'VSTACK', 'WEBSERVICE', 'WEEKDAY', 'WEEKNUM', 'WEIBULL', 'WEIBULL.DIST', 'WORKDAY', 'WORKDAY.INTL', 'WRAPCOLS', 'WRAPROWS', 'XIRR', 'XLOOKUP', 'XMATCH', 'XNPV', 'XOR', 'YEAR', 'YEARFRAC', 'YIELD', 'YIELDDISC', 'YIELDMAT', 'Z.TEST', 'ZTEST'];

export interface IFacetPartial {
  type: FacetType
  points: number
  targetCell: ICellAddress
  review: QuestionFlag
}

export interface IFacet extends IFacetPartial, IModel<IFacetPartial> {
  evaluateScore(workbook: FancyWorkbook): number
  getMaxScore(): number
  getName(): string
  getInfo(): Array<string>
  getTargetCell(): Cell | undefined
  setTargetCell(cell: Cell | ICellAddress | undefined): void
}

export abstract class Facet implements IFacet {
  abstract readonly type: FacetType;

  readonly uuid: string = Math.random().toString(36).substring(2, 15);

  points = 1;

  targetCell: ICellAddress;

  review: QuestionFlag = QuestionFlag.None;

  private cache: { targetCell?: Cell } = {};

  protected constructor(facet: IFacetPartial, protected workbookService: WorkbookService) {
    this.points = +facet.points ?? 1;
    this.targetCell = facet.targetCell;
    this.review = facet.review;
  }

  abstract evaluateScore(workbook: FancyWorkbook): number

  abstract getSerializable(): IFacetPartial

  abstract getName(): string

  abstract getInfo(): Array<string>

  abstract isValid(): boolean

  getTargetCellValue(): string | undefined {
    const cell = this.getTargetCell();
    if (!cell) return undefined;
    return FancyWorkbook.getCellSafeValue(cell).value;
  }

  getMaxScore(): number {
    return this.points;
  }

  getProvidedValue(workbook: FancyWorkbook): string | undefined {
    if (!this.targetCell) throw new Error('Target cell not set');
    const targetCell = workbook.getCell(this.targetCell);
    if (!targetCell) return undefined;
    return FancyWorkbook.getCellSafeValue(targetCell).value;
  }

  getTargetCell(): Cell | undefined {
    if (this.cache.targetCell) return this.cache.targetCell;
    if (this.targetCell) return this.workbookService.getCell(this.targetCell);
    return undefined;
  }

  setTargetCell(cell: Cell | ICellAddress) {
    if ('fullAddress' in cell) {
      this.cache.targetCell = cell;
      this.targetCell = cell.fullAddress;
    } else {
      this.targetCell = cell;
    }
  }
}
