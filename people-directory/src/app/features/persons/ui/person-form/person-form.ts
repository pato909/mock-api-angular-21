import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { PersonFormPayload } from '../../model/person-form.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { notFutureDateValidator } from '../../../../shared/validators/date.validators';
import { avatarUrlValidator } from '../../../../shared/validators/url.validators';
import { Person } from '../../model/person.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-person-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    MatHint,
    MatSuffix,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslatePipe,
  ],
  template: `
    <form
      class="person-form"
      [formGroup]="form"
      [attr.aria-busy]="isSubmitting()"
      novalidate
      (ngSubmit)="submit()"
    >
      @if (showValidationSummary()) {
        <p class="person-form__validation-summary" role="alert">
          {{ 'persons.form.validationSummary' | translate }}
        </p>
      }

      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>{{ 'common.firstName' | translate }}</mat-label>
        <input matInput formControlName="firstName" autocomplete="given-name" />

        @if (form.controls.firstName.hasError('required') && form.controls.firstName.touched) {
          <mat-error>{{ 'persons.form.firstNameRequired' | translate }}</mat-error>
        }

        @if (form.controls.firstName.hasError('maxlength') && form.controls.firstName.touched) {
          <mat-error>{{ 'persons.form.firstNameMaxLength' | translate }}</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>{{ 'common.lastName' | translate }}</mat-label>
        <input matInput formControlName="lastName" autocomplete="family-name" />

        @if (form.controls.lastName.hasError('required') && form.controls.lastName.touched) {
          <mat-error>{{ 'persons.form.lastNameRequired' | translate }}</mat-error>
        }

        @if (form.controls.lastName.hasError('maxlength') && form.controls.lastName.touched) {
          <mat-error>{{ 'persons.form.lastNameMaxLength' | translate }}</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>{{ 'common.phone' | translate }}</mat-label>
        <input matInput formControlName="phone" autocomplete="tel" />
        <mat-hint>{{ 'persons.form.phoneHint' | translate }}</mat-hint>

        @if (form.controls.phone.hasError('required') && form.controls.phone.touched) {
          <mat-error>{{ 'persons.form.phoneRequired' | translate }}</mat-error>
        }

        @if (form.controls.phone.hasError('maxlength') && form.controls.phone.touched) {
          <mat-error>{{ 'persons.form.phoneMaxLength' | translate }}</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" autocomplete="email" />
        <mat-hint>aa.bb&#64;cc.com</mat-hint>

        @if (form.controls.email.hasError('required') && form.controls.email.touched) {
          <mat-error>{{ 'persons.form.emailRequired' | translate }}</mat-error>
        }

        @if (form.controls.email.hasError('maxlength') && form.controls.email.touched) {
          <mat-error>{{ 'persons.form.emailMaxLength' | translate }}</mat-error>
        }
        @if (form.controls.email.hasError('email') && form.controls.email.touched) {
          <mat-error>{{ 'persons.form.emailInvalid' | translate }}</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>{{ 'persons.fields.birthDate' | translate }}</mat-label>

        <input
          matInput
          [matDatepicker]="birthDatePicker"
          formControlName="birthDate"
          [max]="today"
        />

        <mat-datepicker-toggle matSuffix [for]="birthDatePicker"></mat-datepicker-toggle>

        <mat-datepicker #birthDatePicker></mat-datepicker>

        @if (form.controls.birthDate.hasError('required') && form.controls.birthDate.touched) {
          <mat-error>{{ 'persons.form.birthDateRequired' | translate }}</mat-error>
        }
        @if (form.controls.birthDate.hasError('futureDate') && form.controls.birthDate.touched) {
          <mat-error>{{ 'persons.form.birthDateFuture' | translate }}</mat-error>
        }
        @if (
          form.controls.birthDate.hasError('matDatepickerParse') && form.controls.birthDate.touched
        ) {
          <mat-error>{{ 'persons.form.birthDateInvalid' | translate }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>Avatar</mat-label>
        <input matInput formControlName="avatar" type="url" autocomplete="url" />
        <mat-hint>{{ 'persons.fields.avatarUrl' | translate }}</mat-hint>

        @if (form.controls.avatar.hasError('required') && form.controls.avatar.touched) {
          <mat-error>{{ 'persons.form.avatarRequired' | translate }}</mat-error>
        }
        @if (form.controls.avatar.hasError('invalidUrl') && form.controls.avatar.touched) {
          <mat-error>{{ 'persons.form.avatarInvalidUrl' | translate }}</mat-error>
        }
      </mat-form-field>

      <div class="person-form__actions">
        <button mat-flat-button type="submit" [disabled]="isSubmitting()">
          {{
            (isSubmitting()
              ? 'persons.form.saving'
              : isEditMode()
                ? 'persons.form.editSubmit'
                : 'persons.form.createSubmit'
            ) | translate
          }}
        </button>
      </div>
    </form>
  `,
  styles: `
    .person-form {
      display: grid;
      gap: var(--space-4);
      max-width: 42rem;
    }

    .person-form__field {
      width: 100%;
    }

    .person-form__validation-summary {
      padding: var(--space-3) var(--space-4);
      border: 1px solid color-mix(in srgb, var(--mat-sys-error) 42%, white);
      border-radius: var(--radius-sm);
      background: color-mix(in srgb, var(--mat-sys-error-container) 68%, white);
      color: var(--mat-sys-on-error-container);
      font: var(--mat-sys-body-medium);
    }

    .person-form__actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonForm {
  readonly submitted = output<PersonFormPayload>();
  private initializedPersonId: string | null = null;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly today = new Date();

  readonly isSubmitting = input.required<boolean>();
  readonly person = input<Person | undefined>(undefined);

  readonly isEditMode = computed(() => !!this.person());
  readonly form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(60), Validators.email],
    }),
    birthDate: new FormControl<Date | null>(null, {
      validators: [Validators.required, notFutureDateValidator],
    }),
    avatar: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(256), avatarUrlValidator],
    }),
  });

  readonly showValidationSummary = signal(false);

  constructor() {
    effect(() => {
      const person = this.person();

      if (!person) {
        return;
      }

      if (person.id === this.initializedPersonId) {
        return;
      }

      this.initializedPersonId = person.id;

      this.form.reset({
        firstName: person.firstName,
        lastName: person.lastName,
        phone: person.phone,
        email: person.email,
        birthDate: person.birthDate ? new Date(person.birthDate) : null,
        avatar: person.avatar,
      });
    });
  }

  submit(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showValidationSummary.set(true);
      queueMicrotask(() => this.focusFirstInvalidControl());
      return;
    }

    this.showValidationSummary.set(false);

    this.submitted.emit({
      firstName: this.form.controls.firstName.value.trim(),
      lastName: this.form.controls.lastName.value.trim(),
      phone: this.form.controls.phone.value.trim(),
      email: this.form.controls.email.value.trim(),
      birthDate: formatDateOnly(this.form.controls.birthDate.value),
      avatar: this.form.controls.avatar.value.trim(),
    });
  }

  private focusFirstInvalidControl(): void {
    const firstInvalidControl = this.host.nativeElement.querySelector<HTMLElement>(
      '.ng-invalid[formControlName]',
    );

    firstInvalidControl?.focus();
  }
}

function formatDateOnly(date: Date | null): string {
  if (!date) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
