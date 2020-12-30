import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { of } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

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

  ngOnInit() {
    const inputToSave$ = this.note.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    );

    inputToSave$.subscribe(console.log);
  }
}
