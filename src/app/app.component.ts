import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { concat, defer, empty, merge, Observable, of } from "rxjs";
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
import { format } from "date-fns";

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
      mapTo(
        concat(
          of("Salvo!"),
          empty().pipe(delay(2000)),
          defer(() =>
            of(`Última Atualização: ${format(Date.now(), "dd/MM/yyyy hh:mm")}`)
          )
        )
      )
    );

    this.saveIndicator$ = merge(savesInProgress$, savesCompleted$).pipe(
      switchAll(),
      startWith("Todas as mudanças foram salvas")
    );

    inputToSave$.subscribe(console.log);
  }

  saveChanges(value: string) {
    return of(value).pipe(delay(1500));
  }
}
