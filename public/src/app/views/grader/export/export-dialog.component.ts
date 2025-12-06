import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Facet } from '../../../models/question/facet/facet';
import { ExportValue } from '../../../models/submission/submission';

interface ExportDialogData {
  cols: Array<{ [key: string]: { val: string, fac?: Facet}}>;
}

@Component({
  selector: 'app-export',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss'],
})
export class ExportDialogComponent {
  selectedCols: Array<string> = [];

  constructor(
    public dialogRef: MatDialogRef<ExportDialogData>,
    @Inject(MAT_DIALOG_DATA) public data: ExportDialogData,
  ) {}

  format(val: unknown) {
    const isExportValue = (c: unknown): c is ExportValue => typeof c === 'object' && c !== null && 'val' in c;
    if (isExportValue(val)) return val.val;
    return val;
  }
}
