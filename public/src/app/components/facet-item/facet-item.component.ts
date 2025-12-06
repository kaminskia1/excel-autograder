import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Facet } from '../../models/question/facet/facet';
import { Question } from '../../models/question/question';
import { WorkbookService } from '../../models/workbook/workbook.service';
import { FacetLibrary } from '../../models/question/facet/types/lib';
import {
  ConfirmationDialogComponent,
} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-facet-item',
  templateUrl: './facet-item.component.html',
  styleUrls: ['./facet-item.component.scss'],
})
export class FacetItemComponent implements AfterViewInit {
  @Input() question!: Question;

  @Input() facet!: Facet;

  @Input() workbookService!: WorkbookService;

  @Output() facetDeleted = new EventEmitter<void>();

  @Output() valueChanged = new EventEmitter<void>();

  @ViewChild('facetContent', { read: ViewContainerRef })
    facetContent!: ViewContainerRef;

  @ViewChild('facetNameInput') facetNameInput!: ElementRef<HTMLInputElement>;

  editingName = false;

  editingNameValue = '';

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.renderFacetComponent();
  }

  private renderFacetComponent() {
    if (!this.facet || !this.facetContent) return;

    this.facetContent.clear();
    const componentRef = FacetLibrary.getFacetComponent(this.facet, this.facetContent);
    componentRef.setInput('facet', this.facet);
    componentRef.setInput('workbookService', this.workbookService);
    componentRef.instance.valueChange.subscribe(() => {
      this.valueChanged.emit();
    });
  }

  remove() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete?',
        message: 'Any data on this attribute will be lost.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.question.removeFacet(this.facet);
        this.facetDeleted.emit();
      }
    });
  }

  startEditingName() {
    this.editingName = true;
    this.editingNameValue = this.facet.name || '';
    setTimeout(() => {
      this.facetNameInput?.nativeElement?.focus();
      this.facetNameInput?.nativeElement?.select();
    });
  }

  saveName() {
    this.facet.name = this.editingNameValue.trim() || undefined;
    this.editingName = false;
    this.valueChanged.emit();
  }

  cancelEditingName() {
    this.editingName = false;
    this.editingNameValue = '';
  }
}
