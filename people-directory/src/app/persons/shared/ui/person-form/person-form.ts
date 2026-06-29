import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { PersonFormPayload } from '../../person-form.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { notFutureDateValidator } from '../../../../shared/validators/date.validators';
import { avatarUrlValidator } from '../../../../shared/validators/url.validators';
import { Person } from '../../person.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-person-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatHint,
    MatSuffix,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslatePipe,
  ],
  template: `
    <form
      [formGroup]="form"
      [attr.aria-busy]="isSubmitting()"
      novalidate
      (ngSubmit)="submit()"
      class="flex flex-col gap-5"
    >
      @if (showValidationSummary()) {
        <p
          role="alert"
          class="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3"
        >
          {{ 'persons.form.validationSummary' | translate }}
        </p>
      }

      <!-- First Name -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>{{ 'common.firstName' | translate }}</mat-label>
        <input matInput formControlName="firstName" autocomplete="given-name" />
        @if (form.controls.firstName.hasError('required') && form.controls.firstName.touched) {
          <mat-error>{{ 'persons.form.firstNameRequired' | translate }}</mat-error>
        }
        @if (form.controls.firstName.hasError('maxlength') && form.controls.firstName.touched) {
          <mat-error>{{ 'persons.form.firstNameMaxLength' | translate }}</mat-error>
        }
      </mat-form-field>

      <!-- Last Name -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>{{ 'common.lastName' | translate }}</mat-label>
        <input matInput formControlName="lastName" autocomplete="family-name" />
        @if (form.controls.lastName.hasError('required') && form.controls.lastName.touched) {
          <mat-error>{{ 'persons.form.lastNameRequired' | translate }}</mat-error>
        }
        @if (form.controls.lastName.hasError('maxlength') && form.controls.lastName.touched) {
          <mat-error>{{ 'persons.form.lastNameMaxLength' | translate }}</mat-error>
        }
      </mat-form-field>

      <!-- Phone -->
      <mat-form-field appearance="outline" class="w-full">
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

      <!-- Email -->
      <mat-form-field appearance="outline" class="w-full">
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

      <!-- Birth Date -->
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>{{ 'persons.fields.birthDate' | translate }}</mat-label>
        <input
          matInput
          [matDatepicker]="birthDatePicker"
          formControlName="birthDate"
          [max]="today"
        />
        <mat-datepicker-toggle matSuffix [for]="birthDatePicker" />
        <mat-datepicker #birthDatePicker />
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

      <!-- Avatar -->
      <mat-form-field appearance="outline" class="w-full">
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

      <!-- Actions -->
      <div class="flex justify-end pt-2">
        <button
          type="submit"
          [disabled]="isSubmitting()"
          class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
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
  styles: ``,
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
