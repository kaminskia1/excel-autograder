import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { Assignment } from '../../models/assignment/assignment';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { WorkbookService } from '../../models/workbook/workbook.service';
import { Facet } from '../../models/question/facet/facet';
import { Question } from '../../models/question/question';
import { FacetType } from '../../models/question/facet/types/lib';
import {
  ConfirmationDialogComponent,
} from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
})
export class WizardComponent implements AfterViewInit {
  @ViewChild('questionNameInput') questionNameInput!: ElementRef<HTMLInputElement>;

  range = (start: number, end: number) => Array.from({
    length: (end - start),
  }, (v, k) => k + start);

  activeAssignment: Assignment | null = null;

  activeQuestion: Question | null = null;

  questionListShown = false;

  editingQuestionName = false;

  editingQuestionNameValue = '';

  constructor(
    private route: ActivatedRoute,
    public workbookService: WorkbookService,
    public assignmentService: AssignmentService,
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
      const assignment = this.assignmentFactory.create(iAssignment);
      this.activeAssignment = assignment;
      this.activateWorkbook(assignment);
    });
  }

  activateWorkbook(assignment: Assignment) {
    assignment.getFile().subscribe((file) => {
      if (!this.activeAssignment) return;
      this.workbookService.loadWorkbook(file);
      this.setActiveQuestion(this.activeAssignment.getQuestions()[0]);
    });
  }

  saveQuestions() {
    if (!this.activeAssignment) return;
    this.activeAssignment.save().subscribe({
      error: () => {
        this.snackBar.open('Failed to save!', 'Close', { duration: 1500 });
      },
    });
  }

  deleteActiveQuestion() {
    if (this.activeQuestion?.facets.length) this.deleteActiveQuestion2();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete?',
        message: 'Any data on this question will be lost',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.deleteActiveQuestion2();
    });
  }

  deleteActiveQuestion2() {
    if (!this.activeQuestion || !this.activeAssignment) return;
    if (this.activeAssignment.getQuestions().length === 1) this.setActiveQuestion(null);
    const question = this.activeQuestion;
    let newIdx = this.activeAssignment.getQuestions().indexOf(question) - 1;
    if (newIdx < 0) newIdx = 0;
    const index = this.activeAssignment.getQuestions().indexOf(question);
    if (index > -1) {
      this.activeAssignment.getQuestions().splice(index, 1);
    }
    this.setActiveQuestion(this.activeAssignment.getQuestions()[newIdx]);
    this.saveQuestions();
  }

  addQuestion() {
    if (!this.activeAssignment) return;
    this.activeAssignment.addQuestion();
    this.setActiveQuestion(
      this.activeAssignment.getQuestions()[this.activeAssignment.getQuestions().length - 1],
    );
    this.saveQuestions();
  }

  prevQuestion() {
    if (!this.activeQuestion || !this.activeAssignment) return;
    const questions = this.activeAssignment.getQuestions();
    const idx = questions.indexOf(this.activeQuestion);
    if (idx === 0) return;
    this.setActiveQuestion(questions[idx - 1]);
  }

  nextQuestion() {
    if (!this.activeQuestion || !this.activeAssignment) return;
    const questions = this.activeAssignment.getQuestions();
    const idx = questions.indexOf(this.activeQuestion);
    if (idx === questions.length - 1) return;
    this.setActiveQuestion(questions[idx + 1]);
  }

  setActiveQuestion(question: Question | null) {
    this.activeQuestion = question;
    if (!question) return;
    this.questionListShown = false;
  }

  addFacetComponent(facet: Facet) {
    // Facet is added to question, Angular will render it via *ngFor
    this.saveQuestions();
  }

  onFacetDeleted() {
    this.saveQuestions();
  }

  onFacetDrop(event: CdkDragDrop<Facet[]>) {
    if (!this.activeQuestion || event.previousIndex === event.currentIndex) return;

    // Reorder the facets array
    moveItemInArray(this.activeQuestion.facets, event.previousIndex, event.currentIndex);

    this.saveQuestions();
  }

  getQuestionDisplayName(question: Question, index: number): string {
    return question.name || `Problem ${index + 1}`;
  }

  startEditingQuestionName() {
    if (!this.activeQuestion) return;
    this.editingQuestionName = true;
    this.editingQuestionNameValue = this.activeQuestion.name || '';
    setTimeout(() => {
      this.questionNameInput?.nativeElement?.focus();
      this.questionNameInput?.nativeElement?.select();
    });
  }

  saveQuestionName() {
    if (!this.activeQuestion) return;
    this.activeQuestion.name = this.editingQuestionNameValue.trim() || undefined;
    this.editingQuestionName = false;
    this.saveQuestions();
  }

  cancelEditingQuestionName() {
    this.editingQuestionName = false;
    this.editingQuestionNameValue = '';
  }

  protected readonly FacetType = FacetType;
}
