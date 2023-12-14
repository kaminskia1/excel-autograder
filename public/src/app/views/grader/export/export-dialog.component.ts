import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ExportDialogData {
  cols: Array<{ [key: string]: string }>;
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
}
