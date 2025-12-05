import { Buffer } from 'buffer';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  assignments: Array<Assignment> = [];

  displayedColumns = ['name', 'updated_at', 'action'];

  dataSource = new MatTableDataSource<Assignment>(this.assignments);

  constructor(
    public dialog: MatDialog,
    public assignmentService: AssignmentService,
    public assignmentFactory: AssignmentFactory,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.assignmentService.list().subscribe((assignments) => {
      this.assignments = assignments.map(
        (assignment) => this.assignmentFactory.create(assignment),
      );
      this.dataSource.data = this.assignments;
    });
  }

  openNewDialog(): void {
    const newAssignmentEmitter = new EventEmitter<Assignment | null>();
    newAssignmentEmitter.subscribe((assignment: Assignment | null) => {
      if (assignment) {
        assignment.save().subscribe({
          next: (iLiveAssignment: IAssignment) => {
            const liveAssignment = this.assignmentFactory.create(iLiveAssignment);
            this.snackBar.open('Assignment created!', 'Close', { duration: 1500 });
            this.assignments.push(liveAssignment);
            this.dataSource.data = this.assignments;
          },
          error: () => {
            this.snackBar.open('Failed to create assignment!', 'Close', { duration: 1500 });
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
            this.snackBar.open('Assignment deleted!', 'Close', { duration: 1500 });
            this.assignments = this.assignments.filter(
              (removed) => removed.uuid !== assignment.uuid,
            );
            this.dataSource.data = this.assignments;
          },
          error: () => {
            this.snackBar.open('Failed to delete assignment!', 'Close', { duration: 1500 });
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
      this.snackBar.open('Assignment file downloaded!', 'Close', { duration: 1500 });
    });
  }

  openExportDialog(assignment: Assignment) {
    // @TODO: Clean this up (move to assignment or modular encoding class?)
    assignment.getFile().subscribe((file) => {
      const encodeBlobToBase64 = (blob: Blob): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      encodeBlobToBase64(file).then((base64) => {
        const xp = {
          name: assignment.name,
          file: base64,
          questions: assignment.questions.map((q: Question) => q.getSerializable()),
        };
        const encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');
        this.dialog.open(ExportAssignmentDialogComponent, {
          width: '350px',
          data: encode(JSON.stringify(xp)),
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
            this.snackBar.open('Assignment imported!', 'Close', { duration: 1500 });
            this.assignments.push(liveAssignment);
            this.dataSource.data = this.assignments;
          },
          error: () => {
            this.snackBar.open('Failed to import assignment!', 'Close', { duration: 1500 });
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
            this.snackBar.open('Assignment updated!', 'Close', { duration: 1500 });
            this.dataSource.data = this.assignments;
          },
          error: () => {
            this.snackBar.open('Failed to update assignment!', 'Close', { duration: 1500 });
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
    const hasFacets = questions.some(q => q.getFacets().length > 0);
    if (!hasFacets) return false;
    
    // Check if all facets are valid
    return questions.every(q => 
      q.getFacets().every(f => f.isValid())
    );
  }

  /**
   * Check if an assignment has any facets at all.
   */
  hasAnyFacets(assignment: Assignment): boolean {
    return assignment.getQuestions().some(q => q.getFacets().length > 0);
  }

  /**
   * Count the number of invalid facets in an assignment.
   */
  countInvalidFacets(assignment: Assignment): number {
    return assignment.getQuestions().reduce((count, q) => 
      count + q.getFacets().filter(f => !f.isValid()).length, 0);
  }
}
