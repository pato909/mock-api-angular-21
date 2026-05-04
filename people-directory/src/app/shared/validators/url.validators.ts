// validators/date.validators.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function avatarUrlValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const trimmedValue = String(value).trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    const url = new URL(trimmedValue);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { invalidUrl: true };
    }

    return null;
  } catch {
    return { invalidUrl: true };
  }
}
