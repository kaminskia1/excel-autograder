import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { Assignment, IAssignment } from '../../models/assignment/assignment';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { NewAssignmentDialogComponent } from './new-assignment-dialog/new-assignment-dialog.component';
import {
  ExportAssignmentDialogComponent,
} from './export-assignment-dialog/export-assignment-dialog.component';
import {
  EditAssignmentDialogComponent,
} from './edit-assignment-dialog/edit-assignment-dialog.component';
import { Question } from '../../models/question/question';
import {
  ImportAssignmentDialogComponent,
} from './import-assignment-dialog/import-assignment-dialog.component';
import {
  ConfirmationDialogComponent,
} from '../../components/confirmation-dialog/confirmation-dialog.component';
import { encodeBlobToBase64, encodeString } from '../../utils/encoding.utils';
import { NotificationService } from '../../core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  assignments: Array<Assignment> = [];

  displayedColumns = ['name', 'status', 'updatedAt', 'action'];

  dataSource = new MatTableDataSource<Assignment>(this.assignments);

  isLoading = true;

  constructor(
    public dialog: MatDialog,
    public assignmentService: AssignmentService,
    public assignmentFactory: AssignmentFactory,
    private notification: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.assignmentService.list().subscribe((assignments) => {
      this.assignments = assignments.map(
        (assignment) => this.assignmentFactory.create(assignment),
      );
      this.dataSource.data = this.assignments;
      this.isLoading = false;
    });
  }

  openNewDialog(): void {
    const newAssignmentEmitter = new EventEmitter<Assignment | null>();
    newAssignmentEmitter.subscribe((assignment: Assignment | null) => {
      if (assignment) {
        assignment.save().subscribe({
          next: (iLiveAssignment: IAssignment) => {
            const liveAssignment = this.assignmentFactory.create(iLiveAssignment);
            this.notification.success('Assignment created!');
            this.assignments.push(liveAssignment);
            this.dataSource.data = this.assignments;
          },
          error: () => {
            this.notification.error('Failed to create assignment!');
          },
        });
      }
    });
    this.dialog.open(NewAssignmentDialogComponent, {
      width: '350px',
      data: newAssignmentEmitter,
    });
  }

  deleteItem(assignment: Assignment) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete?',
        message: 'This assignment will be permanently removed.',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        assignment.destroy().subscribe({
          next: () => {
            this.notification.success('Assignment deleted!');
            this.assignments = this.assignments.filter(
              (removed) => removed.uuid !== assignment.uuid,
            );
            this.dataSource.data = this.assignments;
          },
          error: () => {
            this.notification.error('Failed to delete assignment!');
          },
        });
      }
    });
  }

  openDownloadDialog(assignment: Assignment) {
    assignment.getFile().subscribe((file) => {
      const blobUrl = URL.createObjectURL(file);
      const aElement = document.createElement('a');
      aElement.href = blobUrl;
      aElement.download = `${assignment.name}.xlsx`;
      aElement.style.display = 'none';
      document.body.appendChild(aElement);
      aElement.click();
      URL.revokeObjectURL(blobUrl);
      aElement.remove();
      this.notification.success('Assignment file downloaded!');
    });
  }

  openExportDialog(assignment: Assignment) {
    assignment.getFile().subscribe((file) => {
      encodeBlobToBase64(file).then((base64) => {
        const exportData = {
          name: assignment.name,
          file: base64,
          questions: assignment.questions.map((q: Question) => q.getSerializable()),
        };
        this.dialog.open(ExportAssignmentDialogComponent, {
          width: '350px',
          data: encodeString(JSON.stringify(exportData)),
        });
      });
    });
  }

  openImportDialog() {
    const importAssignmentEmitter = new EventEmitter<Assignment | null>();
    importAssignmentEmitter.subscribe((assignment: Assignment | null) => {
      if (assignment) {
        assignment.save().subscribe({
          next: (iLiveAssignment: IAssignment) => {
            const liveAssignment = this.assignmentFactory.create(iLiveAssignment);
            this.notification.success('Assignment imported!');
            this.assignments.push(liveAssignment);
            this.dataSource.data = this.assignments;
          },
          error: () => {
            this.notification.error('Failed to import assignment!');
          },
        });
      }
    });
    this.dialog.open(ImportAssignmentDialogComponent, {
      width: '350px',
      data: importAssignmentEmitter,
    });
  }

  openEditDialog(assignment: Assignment) {
    const assignmentEmitter = new EventEmitter<Assignment | null>();
    assignmentEmitter.subscribe((as: Assignment | null) => {
      if (as) {
        as.save().subscribe({
          next: () => {
            this.notification.success('Assignment updated!');
            this.dataSource.data = this.assignments;
          },
          error: () => {
            this.notification.error('Failed to update assignment!');
          },
        });
      }
    });
    this.dialog.open(EditAssignmentDialogComponent, {
      width: '350px',
      data: assignment,
    });
  }

  /**
   * Check if all facets in an assignment are valid.
   * Returns true if the assignment has questions with facets and all facets are valid.
   * Returns false if any facet is invalid.
   */
  areAllFacetsValid(assignment: Assignment): boolean {
    const questions = assignment.getQuestions();
    if (!questions.length) return false;

    // Check if there's at least one facet across all questions
    const hasFacets = questions.some((q) => q.getFacets().length > 0);
    if (!hasFacets) return false;

    // Check if all facets are valid
    return questions.every((q) => q.getFacets().every((f) => f.isValid()));
  }

  /**
   * Check if an assignment has any facets at all.
   */
  hasAnyFacets(assignment: Assignment): boolean {
    return assignment.getQuestions().some((q) => q.getFacets().length > 0);
  }

  /**
   * Count the number of invalid facets in an assignment.
   */
  countInvalidFacets(assignment: Assignment): number {
    return assignment.getQuestions().reduce((count, q) => count + q.getFacets().filter((f) => !f.isValid()).length, 0);
  }

  /**
   * Get the status class for styling based on assignment state.
   */
  getStatusClass(assignment: Assignment): string {
    if (!assignment.getQuestions().length) {
      return 'status-setup';
    }
    if (!this.hasAnyFacets(assignment)) {
      return 'status-setup';
    }
    if (!this.areAllFacetsValid(assignment)) {
      return 'status-warning';
    }
    return 'status-ready';
  }

  /**
   * Get the status icon based on assignment state.
   */
  getStatusIcon(assignment: Assignment): string {
    if (!assignment.getQuestions().length) {
      return 'construction';
    }
    if (!this.hasAnyFacets(assignment)) {
      return 'construction';
    }
    if (!this.areAllFacetsValid(assignment)) {
      return 'warning';
    }
    return 'check_circle';
  }

  /**
   * Get human-readable status text based on assignment state.
   */
  getStatusText(assignment: Assignment): string {
    if (!assignment.getQuestions().length) {
      return 'Needs Setup';
    }
    if (!this.hasAnyFacets(assignment)) {
      return 'Needs Rules';
    }
    if (!this.areAllFacetsValid(assignment)) {
      const count = this.countInvalidFacets(assignment);
      return count === 1 ? '1 Issue' : `${count} Issues`;
    }
    return 'Ready';
  }

  /**
   * Get tooltip text for status badge (only for warning state).
   */
  getStatusTooltip(assignment: Assignment): string {
    if (!this.areAllFacetsValid(assignment) && this.hasAnyFacets(assignment)) {
      const invalidFacets: string[] = [];
      assignment.getQuestions().forEach((q) => {
        q.getFacets().forEach((f) => {
          if (!f.isValid()) {
            const cellAddress = f.targetCell?.address || 'No cell';
            invalidFacets.push(`${q.name}: ${cellAddress} - ${f.getName()}`);
          }
        });
      });
      return invalidFacets.length > 3
        ? `${invalidFacets.slice(0, 3).join('\n')}\n...and ${invalidFacets.length - 3} more`
        : invalidFacets.join('\n');
    }
    return '';
  }
}
