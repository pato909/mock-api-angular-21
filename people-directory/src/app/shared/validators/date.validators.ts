// validators/date.validators.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(control.value);

  if (inputDate > today) {
    return { futureDate: true };
  }

  return null;
}
