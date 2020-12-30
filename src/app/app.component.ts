import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { merge, Observable, of } from "rxjs";
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  mapTo,
  mergeMap,
  share,
  startWith,
  switchAll,
  tap
} from "rxjs/operators";

@Component({
  selector: "my-app",
  template: `
    <div class="container">
      <div>Digite sua nota:</div>
      <textarea [formControl]="note" class="note-input"></textarea>
      <div class="save-indicator">{{ saveIndicator$ | async }}</div>
    </div>
  `,
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  note = new FormControl("");
  saveIndicator$: Observable<string>;
  saveCount = 0;

  ngOnInit() {
    const inputToSave$ = this.note.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      share()
    );

    const savesInProgress$ = inputToSave$.pipe(
      mapTo(of("Salvando...")),
      tap(() => this.saveCount++)
    );

    const savesCompleted$ = inputToSave$.pipe(
      mergeMap(value => this.saveChanges(value)),
      tap(() => this.saveCount--),
      filter(() => !this.saveCount),
      mapTo(of("Salvo!"))
    );

    this.saveIndicator$ = merge(savesInProgress$, savesCompleted$).pipe(
      startWith("Todas as mudanças foram salvas"),
      switchAll()
    );

    inputToSave$.subscribe(console.log);
  }

  saveChanges(value: string) {
    return of(value).pipe(delay(1500));
  }
}
