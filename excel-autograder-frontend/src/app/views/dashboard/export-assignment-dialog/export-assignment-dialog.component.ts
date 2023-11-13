import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-export-assignment-dialog',
  templateUrl: './export-assignment-dialog.component.html',
  styleUrls: ['./export-assignment-dialog.component.scss'],
})
export class ExportAssignmentDialogComponent {
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ExportAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { }

  copied() {
    this.snackBar.open('Copied to clipboard!', 'Close', { duration: 1500 });
  }
}
