/**
 * Enum defining all available facet types.
 * Separated into its own file to avoid circular dependencies.
 */
export enum FacetType {
  FormulaContainsFacet = 'FormulaContainsFacet',
  FormulaRegexFacet = 'FormulaRegexFacet',
  FormulaListFacet = 'FormulaListFacet',
  ValueFacet = 'ValueFacet',
  ValueRangeFacet = 'ValueRangeFacet',
  ValueLengthFacet = 'ValueLengthFacet',
}

