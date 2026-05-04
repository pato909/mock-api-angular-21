import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { PersonFormPayload } from '../../model/person-form.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { notFutureDateValidator } from '../../../../shared/validators/date.validators';
import { required } from '@angular/forms/signals';
import { avatarUrlValidator } from '../../../../shared/validators/url.validators';

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
  ],
  template: `
    <form class="person-form" [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>Prenom</mat-label>
        <input matInput formControlName="firstName" />

        @if (form.controls.firstName.hasError('required') && form.controls.firstName.touched) {
          <mat-error>Le prenom est obligatoire.</mat-error>
        }

        @if (form.controls.firstName.hasError('maxlength') && form.controls.firstName.touched) {
          <mat-error>Le prenom ne peut pas depasser 30 caracteres.</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>Nom de famille</mat-label>
        <input matInput formControlName="lastName" />

        @if (form.controls.lastName.hasError('required') && form.controls.lastName.touched) {
          <mat-error>Le nom de famille est obligatoire.</mat-error>
        }

        @if (form.controls.lastName.hasError('maxlength') && form.controls.lastName.touched) {
          <mat-error>Le nom de famille ne peut pas depasser 30 caracteres.</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>Phone</mat-label>
        <input matInput formControlName="phone" />
        <mat-hint>Exemple : +32 477 12 34 56</mat-hint>

        @if (form.controls.phone.hasError('required') && form.controls.phone.touched) {
          <mat-error>Le numéro de télephone est obligatoire.</mat-error>
        }

        @if (form.controls.phone.hasError('maxlength') && form.controls.phone.touched) {
          <mat-error>Le numéro de télephone ne peut pas depasser 30 caracteres.</mat-error>
        }
        @if (form.controls.phone.hasError('pattern') && form.controls.phone.touched) {
          <mat-error>Le format du telephone n'est pas valide.</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" />
        <mat-hint>aa.bb&#64;cc.com</mat-hint>

        @if (form.controls.email.hasError('required') && form.controls.email.touched) {
          <mat-error>L'email est obligatoire.</mat-error>
        }

        @if (form.controls.email.hasError('maxlength') && form.controls.email.touched) {
          <mat-error>L'email ne peut pas depasser 60 caracteres.</mat-error>
        }
        @if (form.controls.email.hasError('email') && form.controls.email.touched) {
          <mat-error>L'email n'est pas valide.</mat-error>
        }
      </mat-form-field>
      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>Date de naissance</mat-label>

        <input
          matInput
          [matDatepicker]="birthDatePicker"
          formControlName="birthDate"
          [max]="today"
        />

        <mat-datepicker-toggle matSuffix [for]="birthDatePicker"></mat-datepicker-toggle>

        <mat-datepicker #birthDatePicker></mat-datepicker>

        @if (form.controls.birthDate.hasError('required') && form.controls.birthDate.touched) {
          <mat-error>La date de naissance est obligatoire.</mat-error>
        }
        @if (form.controls.birthDate.hasError('futureDate') && form.controls.birthDate.touched) {
          <mat-error>La date ne peut pas être dans le futur </mat-error>
        }
        @if (
          form.controls.birthDate.hasError('matDatepickerParse') && form.controls.birthDate.touched
        ) {
          <mat-error>La date saisie n'est pas valide.</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="person-form__field">
        <mat-label>Avatar</mat-label>
        <input matInput formControlName="avatar" />
        <mat-hint>url de la photo</mat-hint>

        @if (form.controls.avatar.hasError('required') && form.controls.avatar.touched) {
          <mat-error>Avatar obligatoire.</mat-error>
        }
        @if (form.controls.avatar.hasError('invalidUrl') && form.controls.avatar.touched) {
          <mat-error>L'URL doit être valide.</mat-error>
        }
      </mat-form-field>

      <div class="person-form__actions">
        <button mat-flat-button type="submit" [disabled]="form.invalid || isSubmitting()">
          Creer la personne
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
  private readonly phonePattern = /^\+?[0-9][0-9\s().-]{6,29}$/;
  readonly today = new Date();

  readonly isSubmitting = input.required<boolean>();

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
      // F06 only required `required + maxLength(30)`, but we intentionally keep
      // a stricter phone format check here to avoid obviously invalid values.
      validators: [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(this.phonePattern),
      ],
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

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.emit({
      firstName: this.form.controls.firstName.value.trim(),
      lastName: this.form.controls.lastName.value.trim(),
      phone: this.form.controls.phone.value.trim(),
      email: this.form.controls.email.value.trim(),
      birthDate: formatDateOnly(this.form.controls.birthDate.value),
      avatar: this.form.controls.avatar.value.trim(),
    });
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
