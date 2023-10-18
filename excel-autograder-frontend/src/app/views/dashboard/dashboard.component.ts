import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { Assignment, IAssignment } from '../../models/assignment/assignment';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { NewAssignmentDialogComponent } from './new-assignment-dialog/new-assignment-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  assignments: Array<Assignment> = [];

  displayedColumns = ['name', 'updated_at', 'action'];

  dataSource = new MatTableDataSource<IAssignment>(this.assignments);

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
        (assignment) => this.assignmentFactory.createAssignment(assignment),
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
            const liveAssignment = this.assignmentFactory.createAssignment(iLiveAssignment);
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
      width: '300px',
      data: newAssignmentEmitter,
    });
  }

  deleteItem(assignment: Assignment) {
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

  download(assignment: Assignment) {
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
}
