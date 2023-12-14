import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { Assignment } from '../../models/assignment/assignment';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { WorkbookService } from '../../models/workbook/workbook.service';
import { QuestionService } from '../../models/question/question.service';
import { Facet } from '../../models/question/facet/facet';
import { Question } from '../../models/question/question';
import { HeaderComponent } from '../../models/question/facet/header/header/header.component';
import { FacetLibrary, FacetType } from '../../models/question/facet/types/lib';
import {
  ConfirmationDialogComponent,
} from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements AfterViewInit {
  @ViewChild('facetContainer', { static: false, read: ViewContainerRef })
    facetContainer!: ViewContainerRef;

  range = (start: number, end: number) => Array.from({
    length: (end - start),
  }, (v, k) => k + start);

  activeAssignment: Assignment | null = null;

  activeQuestion: Question | null = null;

  constructor(
    private route: ActivatedRoute,
    public workbookService: WorkbookService,
    public assignmentService: AssignmentService,
    public questionService: QuestionService,
    public assignmentFactory: AssignmentFactory,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngAfterViewInit() {
    // Resolve assignment id => Resolve assignment obj => Resolve workbook file => Enable workbook
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.registerAssignment(id);
        }
      },
    );
  }

  registerAssignment(id: string) {
    this.assignmentService.retrieve(id).subscribe((iAssignment) => {
      const assignment = this.assignmentFactory.createAssignment(iAssignment);
      this.activeAssignment = assignment;
      this.questionService.loadQuestions(assignment);
      this.activateWorkbook(assignment);
    });
  }

  activateWorkbook(assignment: Assignment) {
    assignment.getFile().subscribe((file) => {
      this.workbookService.loadWorkbook(file);
      this.setActiveQuestion(this.questionService.getQuestions()[0]);
    });
  }

  saveQuestions() {
    if (!this.activeAssignment) return;
    this.activeAssignment.questions = this.questionService.getQuestions();
    this.activeAssignment.save().subscribe({
      error: () => {
        this.snackBar.open('Failed to save!', 'Close', { duration: 1500 });
      },
    });
  }

  deleteActiveQuestion() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete?',
        message: 'Any data on this question will be lost',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!this.activeQuestion) return;
        const question = this.activeQuestion;
        if (this.questionService.getQuestions().length === 1) this.setActiveQuestion(null);
        let newIdx = this.questionService.getQuestions().indexOf(question) - 1;
        if (newIdx < 0) newIdx = 0;
        this.questionService.removeQuestion(question);
        this.setActiveQuestion(this.questionService.getQuestions()[newIdx]);
        this.saveQuestions();
      }
    });
  }

  addQuestion() {
    this.questionService.addQuestion();
    this.setActiveQuestion(
      this.questionService.getQuestions()[this.questionService.getQuestions().length - 1],
    );
    this.saveQuestions();
  }

  prevQuestion() {
    if (!this.activeQuestion) return;
    const questions = this.questionService.getQuestions();
    const idx = questions.indexOf(this.activeQuestion);
    if (idx === 0) return;
    this.setActiveQuestion(questions[idx - 1]);
  }

  nextQuestion() {
    if (!this.activeQuestion) return;
    const questions = this.questionService.getQuestions();
    const idx = questions.indexOf(this.activeQuestion);
    if (idx === questions.length - 1) return;
    this.setActiveQuestion(questions[idx + 1]);
  }

  setActiveQuestion(question: Question | null) {
    if (!this.facetContainer) return;
    while (this.facetContainer.get(0)) {
      this.facetContainer.remove(0);
    }
    this.activeQuestion = question;
    if (!question) return;
    question.facets.forEach((facet) => {
      this.addFacetComponent(facet);
    });
  }

  addFacetComponent(facet: Facet) {
    const header = this.facetContainer.createComponent(HeaderComponent);
    const com = FacetLibrary.getFacetComponent(facet, this.facetContainer);
    com.setInput('facet', facet);
    com.instance.valueChange.subscribe(() => { this.saveQuestions(); });
    com.setInput('workbookService', this.workbookService);
    header.setInput('question', this.activeQuestion);
    header.setInput('facet', facet);
    header.setInput('component', com);
    header.setInput('self', header);
    header.instance.facetDeleted.subscribe(() => { this.saveQuestions(); });
    this.saveQuestions();
  }

  protected readonly FacetType = FacetType;
}
