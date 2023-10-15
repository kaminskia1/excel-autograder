import { Observable, of, shareReplay } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { IQuestion, Question } from '../question/question';
import { QuestionFactory } from '../question/question.factory';
import { IUser } from '../user/auth';
import { AssignmentService } from './assignment.service';
import { IApiModel } from '../model';

export interface IAssignmentPartial {
  readonly uuid: string;
  readonly created_at: string;
  readonly updated_at: string;
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
  setFile(file: Blob|undefined): void;
  getKey(): string|undefined;
  setKey(key: string|undefined): void;
}

export class Assignment implements IAssignment {
  specialTypes: Array<string> = ['file', 'questions'];

  readonly uuid: string;

  readonly created_at: string;

  readonly updated_at: string;

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
    this.created_at = assignment.created_at;
    this.updated_at = assignment.updated_at;
    this.owner = assignment.owner;
    this.name = assignment.name;
    this.file = assignment.file;
    this.encrypted = assignment.encrypted;
    this.questions = assignment.questions.map(
      (question) => this.questionFactory.createQuestion(question),
    );
  }

  public getSerializable(): IAssignmentPartial {
    return {
      uuid: this.uuid,
      created_at: this.created_at,
      updated_at: this.updated_at,
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
  public save(): Observable<Assignment> {
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
      const obs = (this.assignmentService.put(`assignments/${this.uuid}/`, form) as Observable<Assignment>).pipe(shareReplay(1));
      obs.subscribe(() => { });
      return obs;
    }
    // new, @TODO: change file: Blob to file: File
    if (this.cache.file) form.append('file', this.cache.file, this.cache.file.name);
    const obs: Observable<Assignment> = (this.assignmentService.post('assignments/', form) as Observable<Assignment>).pipe(shareReplay(1));
    obs.subscribe(() => { });
    return obs;
  }

  /**
   * Delete an assignment. Auto-resolves
   */
  public destroy(): Observable<boolean> {
    const obs = (this.assignmentService.delete(`assignments/${this.uuid}/`, this) as Observable<boolean>).pipe(shareReplay(1));
    obs.subscribe(() => { });
    return obs;
  }

  getQuestions(): Array<Question> {
    return this.questions;
  }

  setQuestions(questions: Array<Question>) {
    this.questions = questions;
  }

  getFile(): Observable<Blob> {
    if (this.cache.file) return of(this.cache.file);
    const obs = (this.assignmentService.get(`files/${this.file.split('/').pop()}`, { responseType: 'blob' } as Partial<HttpHeaders>) as Observable<Blob>).pipe(shareReplay(1));
    obs.subscribe((file) => { this.cache.file = file; });
    return obs;
  }

  getCachedFile(): Blob|undefined {
    return this.cache.file;
  }

  setFile(file: Blob) {
    this.cache.file = file;
    this.file = file.name;
  }

  getKey(): string|undefined {
    return this.cache.key;
  }

  setKey(key: string|undefined) {
    this.cache.key = key;
  }
}
