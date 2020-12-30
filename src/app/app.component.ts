import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { of } from "rxjs";
import { debounceTime, delay,  distinctUntilChanged, mapTo,  mergeMap,    share, tap } from "rxjs/operators";

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
  saveIndicator$ = of("Todas as mudanças foram salvas");
  saveCount = 0;

  ngOnInit() {
    const inputToSave$ = this.note.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      share()
    );

    const savesInProgress$ = inputToSave$.pipe(
      mapTo(of("Saving")),
      tap(() => this.saveCount++),
    );

    const savesCompleted$ = inputToSave$.pipe(
      mergeMap(value => this.saveChanges(value)),
      tap(() => this.saveCount--),
    )

    inputToSave$.subscribe(console.log);
  }

  saveChanges(value: string) {
    return of(value).pipe(delay(1500));
  };
}
