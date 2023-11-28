import {
  Component, Input, OnDestroy, OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { FacetComponent } from '../../facet.component';
import { FormulaListFacet } from './formula-list.facet';
import { FORMULAS } from '../../facet';

@Component({
  selector: 'app-formula-list.facet',
  templateUrl: './formula-list.component.html',
  styleUrls: ['./formula-list.component.scss'],
})
export class FormulaListComponent extends FacetComponent implements OnInit, OnDestroy {
  @Input() override facet!: FormulaListFacet;

  formulas: Array<string> = FORMULAS.slice();

  bankFilterCtrl: FormControl<string | null> = new FormControl<string>('');

  filteredFormulas: ReplaySubject<Array<string>> = new ReplaySubject<Array<string>>(1);

  protected onDestroy = new Subject<void>();

  ngOnInit() {
    this.facet.formulas = this.facet.formulas || [];
    this.filteredFormulas.next(this.formulas);

    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
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

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
