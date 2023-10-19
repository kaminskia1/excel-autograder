import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from '../../models/assignment/assignment.service';
import { Assignment } from '../../models/assignment/assignment';
import { AssignmentFactory } from '../../models/assignment/assignment.factory';
import { WorkbookService } from '../../models/workbook/workbook.service';
import { QuestionService } from '../../models/question/question.service';
import { Facet, FacetType } from '../../models/question/facet/facet';
import {
  FunctionListFacetComponent,
} from '../../models/question/facet/types/function-list.facet/function-list.facet.component';
import {
  ValueFacetComponent,
} from '../../models/question/facet/types/value.facet/value.facet.component';
import {
  FunctionChainFacetComponent,
} from '../../models/question/facet/types/function-chain.facet/function-chain.facet.component';
import {
  FunctionContainsFacetComponent,
} from '../../models/question/facet/types/function-contains.facet/function-contains.facet.component';
import { Question } from '../../models/question/question';

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
      next: () => {
        this.snackBar.open('Saved!', 'Close', { duration: 1500 });
      },
      error: () => {
        this.snackBar.open('Failed to save!', 'Close', { duration: 1500 });
      },
    });
  }

  deleteActiveQuestion() {
    if (!this.activeQuestion) return;
    const question = this.activeQuestion;
    if (this.questionService.getQuestions().length === 1) this.setActiveQuestion(null);
    let newIdx = this.questionService.getQuestions().indexOf(question) - 1;
    if (newIdx < 0) newIdx = 0;
    this.questionService.removeQuestion(question);
    this.setActiveQuestion(this.questionService.getQuestions()[newIdx]);
  }

  addQuestion() {
    this.questionService.addQuestion();
    this.setActiveQuestion(this.questionService.getQuestions()[this.questionService.getQuestions().length - 1]);
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
    let com;
    switch (facet.type) {
      case FacetType.FunctionChainFacet:
        com = this.facetContainer.createComponent(FunctionChainFacetComponent);
        break;
      case FacetType.FunctionContainsFacet:
        com = this.facetContainer.createComponent(FunctionContainsFacetComponent);
        break;
      case FacetType.FunctionListFacet:
        com = this.facetContainer.createComponent(FunctionListFacetComponent);
        break;
      case FacetType.ValueFacet:
        com = this.facetContainer.createComponent(ValueFacetComponent);
    }
    com.setInput('facet', facet);
    com.setInput('workbookService', this.workbookService);
  }

  addFacet(question: Question, type: FacetType) {
    switch (type) {
      case FacetType.FunctionChainFacet:
        this.addFacetComponent(question.createFacet({
          type: FacetType.FunctionChainFacet,
          points: 0,
        }));
        break;
      case FacetType.FunctionContainsFacet:
        this.addFacetComponent(question.createFacet({
          type: FacetType.FunctionContainsFacet,
          points: 0,
        }));
        break;
      case FacetType.FunctionListFacet:
        this.addFacetComponent(question.createFacet({
          type: FacetType.FunctionListFacet,
          points: 0,
        }));
        break;
      case FacetType.ValueFacet:
        this.addFacetComponent(question.createFacet({
          type: FacetType.ValueFacet,
          points: 0,
        }));
    }
  }

  protected readonly FacetType = FacetType;

  protected readonly FunctionChainFacetComponent = FunctionChainFacetComponent;
}
