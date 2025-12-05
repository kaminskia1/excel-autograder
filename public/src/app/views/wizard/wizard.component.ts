import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
export class WizardComponent implements AfterViewInit, OnDestroy {
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
    private router: Router,
    public workbookService: WorkbookService,
    public assignmentService: AssignmentService,
    public assignmentFactory: AssignmentFactory,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
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

  ngOnDestroy() {
    // Clean up pending timeouts to prevent memory leaks and errors on destroyed component
    if (this.fadeOutTimeout) {
      clearTimeout(this.fadeOutTimeout);
      this.fadeOutTimeout = null;
    }
    if (this.fadeInTimeout) {
      clearTimeout(this.fadeInTimeout);
      this.fadeInTimeout = null;
    }
  }

  registerAssignment(id: string) {
    this.assignmentService.retrieve(id).subscribe({
      next: (iAssignment) => {
        const assignment = this.assignmentFactory.create(iAssignment);
        this.activeAssignment = assignment;
        this.activateWorkbook(assignment);
      },
      error: (err) => {
        const message = err.status === 404 
          ? 'Assignment not found' 
          : 'YouThis assignment does not exist or you do not have permission to access it.';
        this.snackBar.open(message, 'Close', { duration: 5000 });
        this.router.navigate(['/']);
      },
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
    // If question has no facets, delete without confirmation
    if (!this.activeQuestion?.facets.length) {
      this.deleteActiveQuestion2();
      return;
    }
    // Otherwise, show confirmation dialog
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

    const question = this.activeQuestion;
    const questions = this.activeAssignment.getQuestions();
    const index = questions.indexOf(question);

    // If question not found in array, nothing to delete
    if (index === -1) return;

    questions.splice(index, 1);

    // Set new active question (or null if no questions remain)
    if (questions.length === 0) {
      this.setActiveQuestion(null);
    } else {
      const newIdx = Math.min(index, questions.length - 1);
      this.setActiveQuestion(questions[newIdx]);
    }

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

  // Timeout IDs for animation - stored to allow cancellation on rapid clicks
  private fadeOutTimeout: ReturnType<typeof setTimeout> | null = null;
  private fadeInTimeout: ReturnType<typeof setTimeout> | null = null;
  
  facetAreaFading = false;

  setActiveQuestion(question: Question | null) {
    // Clear any pending animation timeouts to prevent race conditions
    if (this.fadeOutTimeout) {
      clearTimeout(this.fadeOutTimeout);
      this.fadeOutTimeout = null;
    }
    if (this.fadeInTimeout) {
      clearTimeout(this.fadeInTimeout);
      this.fadeInTimeout = null;
    }
    
    if (!question) {
      this.activeQuestion = null;
      this.facetAreaFading = false;
      return;
    }
    
    // Capture initial state to avoid race condition with user toggling the list
    const wasShowingList = this.questionListShown;
    
    // If facet area is visible, fade out first then change question
    // If facet area is hidden (list is shown), skip fade-out and just switch
    if (!wasShowingList) {
      // Facet area is visible - fade out, change, fade in
      this.facetAreaFading = true;
      this.fadeOutTimeout = setTimeout(() => {
        this.activeQuestion = question;
        this.cdr.detectChanges();
        this.fadeInTimeout = setTimeout(() => {
          this.facetAreaFading = false;
          this.cdr.detectChanges();
        }, 10);
      }, 75);
    } else {
      // Facet area is hidden (list is shown) - close list, switch question, fade in
      this.activeQuestion = question;
      // Close the list first so facet area becomes visible (display changes from none to block)
      this.questionListShown = false;
      // Now set fading state so facet area starts at opacity 0
      this.facetAreaFading = true;
      this.cdr.detectChanges();
      // Small delay to let DOM update before fading in
      this.fadeInTimeout = setTimeout(() => {
        this.facetAreaFading = false;
        this.cdr.detectChanges();
      }, 10);
    }
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

  onQuestionDrop(event: CdkDragDrop<Question[]>) {
    if (!this.activeAssignment || event.previousIndex === event.currentIndex) return;

    // Reorder the questions array
    moveItemInArray(this.activeAssignment.getQuestions(), event.previousIndex, event.currentIndex);

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
