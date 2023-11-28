import { Component, ComponentRef, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Facet } from '../../facet';
import { Question } from '../../../question';
import { FacetComponent } from '../../facet.component';
import {
  ConfirmationDialogComponent,
} from '../../../../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() question!: Question;

  @Input() facet!: Facet;

  @Input() component!: ComponentRef<FacetComponent>;

  @Input() self!: ComponentRef<HeaderComponent>;

  constructor(
    private dialog: MatDialog,
  ) {}

  remove() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Any data on this attribute will be lost.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.question.removeFacet(this.facet);
        this.component.destroy();
        this.self.destroy(); // inception
      }
    });
  }
}
