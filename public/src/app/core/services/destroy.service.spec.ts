import { Component, OnInit } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from './destroy.service';

// Test component that uses DestroyService
@Component({
  selector: 'app-test',
  template: '',
  providers: [DestroyService],
})
class TestComponent implements OnInit {
  callCount = 0;

  constructor(private destroy$: DestroyService) {}

  ngOnInit(): void {
    interval(10)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.callCount++;
      });
  }
}

describe('DestroyService', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be created', () => {
    const service = new DestroyService();
    expect(service).toBeTruthy();
  });

  it('should emit and complete on ngOnDestroy', () => {
    const service = new DestroyService();
    let nextCalled = false;
    let completeCalled = false;

    service.subscribe({
      next: () => { nextCalled = true; },
      complete: () => { completeCalled = true; },
    });

    service.ngOnDestroy();

    expect(nextCalled).toBeTrue();
    expect(completeCalled).toBeTrue();
  });

  it('should stop subscriptions when component is destroyed', (done) => {
    fixture.detectChanges(); // Trigger ngOnInit

    // Let the interval emit a few times
    setTimeout(() => {
      const countBeforeDestroy = component.callCount;
      expect(countBeforeDestroy).toBeGreaterThan(0);

      // Destroy the component
      fixture.destroy();

      // Wait and verify no more emissions
      setTimeout(() => {
        expect(component.callCount).toBe(countBeforeDestroy);
        done();
      }, 50);
    }, 50);
  });

  it('should work with multiple subscriptions', () => {
    const service = new DestroyService();

    const sub1 = interval(10)
      .pipe(takeUntil(service))
      .subscribe();

    const sub2 = interval(10)
      .pipe(takeUntil(service))
      .subscribe();

    // Destroy service
    service.ngOnDestroy();

    // Verify both subscriptions are closed
    expect(sub1.closed).toBeTrue();
    expect(sub2.closed).toBeTrue();
  });
});
