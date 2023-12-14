import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDialogComponent } from './export-dialog.component';

describe('ExportComponent', () => {
  let component: ExportDialogComponent;
  let fixture: ComponentFixture<ExportDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportDialogComponent],
    });
    fixture = TestBed.createComponent(ExportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
