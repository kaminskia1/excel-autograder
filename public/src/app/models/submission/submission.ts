import { FancyWorkbook } from '../workbook/workbook';
import { Facet } from '../question/facet/facet';

export type ExportValue = {
  val: string,
  fac?: Facet
}

export const ExportSubmissionColumns: Map<string,
  ExportValue> = new Map<string, ExportValue>();

// @TODO: Can this be simplified?
ExportSubmissionColumns.set('fileName', { val: 'File Name' });
ExportSubmissionColumns.set('points', { val: 'Points' });
ExportSubmissionColumns.set('maxPoints', { val: 'Max Points' });
ExportSubmissionColumns.set('score', { val: 'Score' });
ExportSubmissionColumns.set('creator', { val: 'Creator' });
ExportSubmissionColumns.set('company', { val: 'Company' });
ExportSubmissionColumns.set('lastModifiedBy', { val: 'Last Modified By' });
ExportSubmissionColumns.set('lastModified', { val: 'Last Modified' });
ExportSubmissionColumns.set('created', { val: 'Created' });
ExportSubmissionColumns.set('lastPrinted', { val: 'Last Printed' });
ExportSubmissionColumns.set('manager', { val: 'Manager' });
ExportSubmissionColumns.set('title', { val: 'Title' });
ExportSubmissionColumns.set('subject', { val: 'Subject' });
ExportSubmissionColumns.set('description', { val: 'Description' });
ExportSubmissionColumns.set('keywords', { val: 'Keywords' });
ExportSubmissionColumns.set('category', { val: 'Category' });

export interface SubmissionResponse {
  score: number,
  maxScore: number,
  providedValue: string | undefined
  expectedValue: string | undefined
}

export interface ISubmissionPartial {
  file: File,
  workbook: FancyWorkbook,
  score: number,
  maxScore: number,
  responses: Map<Facet, SubmissionResponse>
}

export interface ISubmission extends ISubmissionPartial {
  getUnreviewed(): Array<Facet>
}

export class Submission implements ISubmission {
  file: File;

  workbook: FancyWorkbook;

  score: number;

  maxScore: number;

  readonly responses: Map<Facet, SubmissionResponse>;

  unreviewed: Map<Facet, SubmissionResponse>;

  constructor(submission: ISubmissionPartial) {
    this.file = submission.file;
    this.workbook = submission.workbook;
    this.score = submission.score;
    this.maxScore = submission.maxScore;
    this.responses = submission.responses;
    this.unreviewed = new Map(submission.responses);
  }

  getUnreviewed(): Array<Facet> {
    return [];
  }

  isReviewed(): boolean {
    return !this.unreviewed.size;
  }
}
