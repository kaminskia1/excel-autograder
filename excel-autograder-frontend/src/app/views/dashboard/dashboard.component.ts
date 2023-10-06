import { Component, OnInit} from '@angular/core';
import { AssignmentService } from "../../api/assignment/assignment.service";
import { Assignment } from "../../api/assignment/assignment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  assignments: Array<Assignment> = [];
  displayedColumns = ['name', 'file', 'updated_at', 'action'];
  constructor(public assignmentService: AssignmentService) {}

  ngOnInit(): void {
    this.assignmentService.list().subscribe({
      next: (assignments) => {
        this.assignments = assignments;
      }
    })
  }
}
