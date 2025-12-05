import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service to manage subscription cleanup in components.
 * 
 * Usage:
 * 1. Add DestroyService to component's providers array
 * 2. Inject in constructor
 * 3. Use with takeUntil() operator on subscriptions
 * 
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-example',
 *   providers: [DestroyService],
 *   // ...
 * })
 * export class ExampleComponent {
 *   constructor(private destroy$: DestroyService) {}
 * 
 *   ngOnInit() {
 *     this.someObservable$
 *       .pipe(takeUntil(this.destroy$))
 *       .subscribe(value => { ... });
 *   }
 * }
 * ```
 */
@Injectable()
export class DestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}

