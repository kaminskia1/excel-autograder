import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { WizardComponent } from './wizard.component';
import { TableRowComponent } from './table-row/table-row.component';
import { QuestionComponent } from '../../components/question/question.component';
import { FacetItemComponent } from '../../components/facet-item/facet-item.component';

// Facet header
import { HeaderComponent } from '../../models/question/facet/header/header/header.component';

// Facet create components
import { ValueCreateComponent } from '../../models/question/facet/types/value.facet/create/value-create.component';
import { FormulaContainsCreateComponent } from '../../models/question/facet/types/formula-contains.facet/create/formula-contains-create.component';
import { FormulaListCreateComponent } from '../../models/question/facet/types/formula-list.facet/create/formula-list-create.component';
import { FormulaRegexCreateComponent } from '../../models/question/facet/types/formula-regex.facet/create/formula-regex-create.component';
import { ValueRangeCreateComponent } from '../../models/question/facet/types/value-range.facet/create/value-range-create.component';
import { ValueLengthCreateComponent } from '../../models/question/facet/types/value-length.facet/create/value-length-create.component';

// Facet review components
import { ValueReviewComponent } from '../../models/question/facet/types/value.facet/review/value-review.component';
import { FormulaContainsReviewComponent } from '../../models/question/facet/types/formula-contains.facet/review/formula-contains-review.component';
import { FormulaListReviewComponent } from '../../models/question/facet/types/formula-list.facet/review/formula-list-review.component';
import { FormulaRegexReviewComponent } from '../../models/question/facet/types/formula-regex.facet/review/formula-regex-review.component';
import { ValueRangeReviewComponent } from '../../models/question/facet/types/value-range.facet/review/value-range-review.component';
import { ValueLengthReviewComponent } from '../../models/question/facet/types/value-length.facet/review/value-length-review.component';

@NgModule({
  declarations: [
    WizardComponent,
    TableRowComponent,
    QuestionComponent,
    FacetItemComponent,
    HeaderComponent,
    // Create components
    ValueCreateComponent,
    FormulaContainsCreateComponent,
    FormulaListCreateComponent,
    FormulaRegexCreateComponent,
    ValueRangeCreateComponent,
    ValueLengthCreateComponent,
    // Review components
    ValueReviewComponent,
    FormulaContainsReviewComponent,
    FormulaListReviewComponent,
    FormulaRegexReviewComponent,
    ValueRangeReviewComponent,
    ValueLengthReviewComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    WizardComponent,
    FacetItemComponent,
  ],
})
export class WizardModule { }

