import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from '../../../core/services';

@Component({
  selector: 'app-export-assignment-dialog',
  templateUrl: './export-assignment-dialog.component.html',
  styleUrls: ['./export-assignment-dialog.component.scss'],
})
export class ExportAssignmentDialogComponent {
  constructor(
    private notification: NotificationService,
    public dialogRef: MatDialogRef<ExportAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { }

  copied() {
    this.notification.success('Copied to clipboard!');
  }
}
