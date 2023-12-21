import { Injectable } from '@angular/core';
import { FancyWorkbook } from './workbook';

@Injectable({
  providedIn: 'root',
})
export class WorkbookFactory {
  create(): FancyWorkbook {
    return new FancyWorkbook();
  }

  load(file: Blob): Promise<FancyWorkbook> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target === null || e.target.result === null
          || !(e.target.result instanceof ArrayBuffer)) {
          reject(Error('Invalid file format'));
          return;
        }
        const arrayBuffer = e.target.result;
        const workbook = new FancyWorkbook();
        workbook.xlsx.load(arrayBuffer)
          .then(() => {
            resolve(workbook);
          })
          .catch((error) => {
            reject(error);
          });
      };
      fileReader.readAsArrayBuffer(file);
    });
  }
}
