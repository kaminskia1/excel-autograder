import {
  Observable, of, shareReplay, tap,
} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { IQuestion, Question } from '../question/question';
import { QuestionFactory } from '../question/question.factory';
import { IUser } from '../user/user';
import { AssignmentService } from './assignment.service';
import { IApiModel } from '../model';

export interface EncodedAssignment {
  name: string
  questions: Array<IQuestion>
  file: string
}
export interface IAssignmentPartial {
  readonly uuid: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: IUser;
  name: string;
  file: string;
  encrypted: boolean;
  questions: Array<IQuestion>
}

export interface IAssignment extends IAssignmentPartial, IApiModel<IAssignmentPartial> {
  getQuestions(): Array<IQuestion>;
  setQuestions(questions: Array<IQuestion>): void;
  getFile(): Observable<Blob>;
  getCachedFile(): Blob|undefined;
  setFile(file: Blob | File | undefined): void;
  getKey(): string|undefined;
  setKey(key: string|undefined): void;
}

export class Assignment implements IAssignment {
  specialTypes: Array<string> = ['file', 'questions'];

  readonly uuid: string;

  readonly createdAt: string;

  readonly updatedAt: string;

  readonly owner: IUser;

  name: string;

  file: string;

  encrypted: boolean;

  questions: Array<Question>;

  cache: {
    file?: Blob|File
    key?: string
  } = {};

  constructor(
    assignment: IAssignmentPartial,
    private questionFactory: QuestionFactory,
    private assignmentService: AssignmentService,
  ) {
    this.uuid = assignment.uuid;
    this.createdAt = assignment.createdAt;
    this.updatedAt = assignment.updatedAt;
    this.owner = assignment.owner;
    this.name = assignment.name;
    this.file = assignment.file;
    this.encrypted = assignment.encrypted;
    this.questions = assignment.questions?.map(
      (question) => this.questionFactory.create(question),
    ) ?? [];
  }

  public getSerializable(): IAssignmentPartial {
    return {
      uuid: this.uuid,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      owner: this.owner,
      name: this.name,
      file: this.file,
      encrypted: this.encrypted,
      questions: this.questions,
    };
  }

  /**
   * Save an assignment. Auto-resolves
   */
  public save(): Observable<IAssignment> {
    const form: FormData = new FormData();
    Object.entries(this).forEach(
      ([key, value]) => { if (!this.specialTypes.includes(key)) form.append(key, value); },
    );

    if (this.questions) {
      form.append('questions', JSON.stringify(this.questions.map((q: Question) => q.getSerializable())));
    }

    if (this.uuid) {
      // existing
      if (this.cache.file) form.append('file', this.cache.file, this.file.split('/').pop());
      return (this.assignmentService.put(`assignments/${this.uuid}/`, form) as Observable<Assignment>).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    // new
    if (this.cache.file) {
      const fileName = this.cache.file instanceof File ? this.cache.file.name : 'file.xlsx';
      form.append('file', this.cache.file, fileName);
    }
    return (this.assignmentService.post('assignments/', form) as Observable<Assignment>).pipe(
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  /**
   * Delete an assignment.
   */
  public destroy(): Observable<boolean> {
    return (this.assignmentService.delete(`assignments/${this.uuid}/`, this) as Observable<boolean>).pipe(
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  getQuestions(): Array<Question> {
    return this.questions;
  }

  setQuestions(questions: Array<Question>) {
    this.questions = questions;
  }

  addQuestion() {
    const questionNumber = this.questions.length + 1;
    const question: Question = this.questionFactory.create({
      name: `Problem ${questionNumber}`,
      facets: [],
    });
    this.questions.push(question);
  }

  getFile(): Observable<Blob> {
    if (this.cache.file) return of(this.cache.file);
    return (this.assignmentService.get(`files/${this.file.split('/').pop()}`, { responseType: 'blob' } as Partial<HttpHeaders>) as Observable<Blob>).pipe(
      tap((file) => { this.cache.file = file; }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
  }

  getCachedFile(): Blob|undefined {
    return this.cache.file;
  }

  setFile(file: Blob | File | undefined) {
    this.cache.file = file;
    this.file = file instanceof File ? file.name : file ? 'file.xlsx' : '';
  }

  getKey(): string|undefined {
    return this.cache.key;
  }

  setKey(key: string|undefined) {
    this.cache.key = key;
  }

  isQuestionsValid(): boolean {
    return this.getQuestions().length > 0;
  }

  getUuid(): string {
    return this.uuid;
  }
}
