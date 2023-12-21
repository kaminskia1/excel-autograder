import {FancyWorkbook} from '../workbook/workbook';
import {Facet} from '../question/facet/facet';

export const ExportSubmissionColumns: { [key: string]: string } = {
  fileName: 'File Name',
  points: 'Points',
  maxPoints: 'Max Points',
  score: 'Score',
  creator: 'Creator',
  company: 'Company',
  lastModifiedBy: 'Last Modified By',
  lastModified: 'Last Modified',
  created: 'Created',
  lastPrinted: 'Last Printed',
  manager: 'Manager',
  title: 'Title',
  subject: 'Subject',
  description: 'Description',
  keywords: 'Keywords',
  category: 'Category',
};

export interface ISubmissionPartial {
  file: File,
  workbook: FancyWorkbook,
  score: number,
  maxScore: number,
  responses: Map<Facet, number>
  reviewed?: boolean
}

export interface ISubmission extends ISubmissionPartial {
  getUnreviewed(): Array<Facet>
}

export class Submission implements ISubmission {
  file: File;

  workbook: FancyWorkbook;

  score: number;

  maxScore: number;

  responses: Map<Facet, number>;

  reviewed?: boolean = false;

  constructor(submission: ISubmissionPartial) {
    this.file = submission.file;
    this.workbook = submission.workbook;
    this.score = submission.score;
    this.maxScore = submission.maxScore;
    this.responses = submission.responses;
    this.reviewed = submission.reviewed;
  }

  getUnreviewed(): Array<Facet> {
    return [];
  }
}
