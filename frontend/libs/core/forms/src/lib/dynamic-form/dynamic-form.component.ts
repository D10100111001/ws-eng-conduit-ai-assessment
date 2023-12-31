import { Field } from "../+state/forms.interfaces";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { combineLatest, Observable } from "rxjs";
import { debounceTime, filter, map, tap } from "rxjs/operators";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { CommonModule } from "@angular/common";
import { DynamicFieldDirective } from "./dynamic-field.directive";

@UntilDestroy()
@Component({
  selector: "cdt-dynamic-form",
  standalone: true,
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.css"],
  imports: [CommonModule, ReactiveFormsModule, DynamicFieldDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent implements OnInit {
  @Input()
  structure$!: Observable<Field[]>;
  @Input()
  data$!: Observable<any>;
  @Input()
  touchedForm$!: Observable<boolean>;
  @Output()
  updateForm: EventEmitter<any> = new EventEmitter();
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.structure$
      .pipe(
        map(this.formBuilder),
        tap((f) => (this.form = f)),
        tap((f) => this.listenFormChanges(f)),
        (f$) => combineLatest([f$, this.data$]),
        untilDestroyed(this),
      )
      .subscribe(this.patchValue);

    if (this.touchedForm$) {
      this.touchedForm$
        .pipe(
          filter((t) => !t && !!this.form),
          untilDestroyed(this),
        )
        .subscribe(() => this.form.reset());
    }
  }

  private formBuilder = (structure: Field[]): FormGroup => {
    const group = this.fb.group({});
    structure.forEach((field) =>
      group.addControl(field.name, this.control(field))
    );
    return group;
  };

  private control = (field: Field): FormControl => {
    return this.fb.control("", field.validator);
  };

  private patchValue = ([form, data]: [FormGroup, any]) => {
    data
      ? form.patchValue(data, { emitEvent: false })
      : form.patchValue({}, { emitEvent: false });
  };

  private listenFormChanges(form: FormGroup) {
    combineLatest([
      form.valueChanges.pipe(debounceTime(100)),
      this.structure$,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([changes, structure]) => {
        const transformedChanges = structure.reduce((acc, field) => {
          if (field.transformer && changes[field.name] !== undefined) {
            acc[field.name] = field.transformer(changes[field.name]);
          } else {
            acc[field.name] = changes[field.name];
          }
          return acc;
        }, {} as any);

        this.updateForm.emit(transformedChanges);
      });
  }
}
