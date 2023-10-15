import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AssignmentService } from '../../services/api/assignment/assignment.service';
import { Assignment } from '../../services/api/assignment/assignment';
import { NewAssignmentDialogComponent } from './new-assignment-dialog/new-assignment-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  assignments: Array<Assignment> = [];

  displayedColumns = ['name', 'updated_at', 'action'];

  dataSource = new MatTableDataSource<Assignment>(this.assignments);

  constructor(public dialog: MatDialog, public assignmentService: AssignmentService) {
  }

  ngOnInit(): void {
    this.assignmentService.list().subscribe((assignments) => {
      this.assignments = assignments;
      this.dataSource.data = this.assignments;
    });
  }

  openNewDialog(): void {
    const newAssignment = new EventEmitter<Assignment | null>();
    newAssignment.subscribe((assignment: Assignment | null) => {
      if (assignment) {
        this.assignmentService.create(assignment).subscribe((liveAssignment) => {
          this.assignments.push(liveAssignment);
          this.dataSource.data = this.assignments;
        });
      }
    });
    this.dialog.open(NewAssignmentDialogComponent, {
      width: '300px',
      data: newAssignment,
    });
  }

  deleteItem(assignment: Assignment) {
    this.assignmentService.destroy(assignment).subscribe(() => {
      this.assignments = this.assignments.filter((a) => a.uuid !== assignment.uuid);
      this.dataSource.data = this.assignments;
    });
  }

  download(assignment: Assignment) {
    this.assignmentService.getFile(assignment).subscribe((file) => {
      const blobUrl = URL.createObjectURL(file);
      const aElement = document.createElement('a');
      aElement.href = blobUrl;
      aElement.download = `${assignment.name}.xlsx`;
      aElement.style.display = 'none';
      document.body.appendChild(aElement);
      aElement.click();
      URL.revokeObjectURL(blobUrl);
      aElement.remove();
    });
  }
}
