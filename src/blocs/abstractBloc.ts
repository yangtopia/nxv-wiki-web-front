import { Observable, BehaviorSubject } from 'rxjs';

export abstract class Bloc<T> {
  protected state$: BehaviorSubject<T>;

  readonly initialState: T;

  constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
    this.initialState = initialState;
  }

  reset(): void {
    this.state$.next(this.initialState);
  }

  get getState(): T {
    return this.state$.value;
  }

  get toObservable(): Observable<T> {
    return this.state$.asObservable();
  }
}
