import {
  Component, Input, OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FacetComponent } from '../../../facet.component';
import { FormulaListFacet } from '../formula-list.facet';
import { FORMULAS } from '../../../facet';
import { QuestionFlag } from '../../../../misc';
import { DestroyService } from '../../../../../../core/services';

@Component({
  selector: 'app-formula-list.facet',
  templateUrl: './formula-list-create.component.html',
  styleUrls: ['./formula-list-create.component.scss'],
  providers: [DestroyService],
})
export class FormulaListCreateComponent extends FacetComponent implements OnInit {
  @Input() override facet!: FormulaListFacet;

  formulas: Array<string> = FORMULAS.slice();

  bankFilterCtrl: FormControl<string | null> = new FormControl<string>('');

  filteredFormulas: ReplaySubject<Array<string>> = new ReplaySubject<Array<string>>(1);

  constructor(private destroy$: DestroyService) {
    super();
  }

  ngOnInit() {
    this.facet.formulas = this.facet.formulas || [];
    this.filteredFormulas.next(this.formulas);

    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterBanksMulti();
      });
  }

  protected filterBanksMulti() {
    if (!this.formulas) {
      return;
    }
    let search = this.bankFilterCtrl.value ?? '';
    search = search.toLowerCase();
    this.filteredFormulas.next(this.formulas.filter((fn) => fn.toLowerCase().startsWith(search)));
  }

  protected readonly QuestionFlag = QuestionFlag;
}
