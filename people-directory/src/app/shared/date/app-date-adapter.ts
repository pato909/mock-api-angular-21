import { NativeDateAdapter } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
  override parse(value: unknown): Date | null {
    if (typeof value !== 'string') {
      return super.parse(value);
    }

    const dateValue = value.trim();

    if (!dateValue) {
      return null;
    }

    const europeanDate = dateValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (europeanDate) {
      return createValidDate(
        Number(europeanDate[3]),
        Number(europeanDate[2]),
        Number(europeanDate[1]),
      );
    }

    const isoDate = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (isoDate) {
      return createValidDate(Number(isoDate[1]), Number(isoDate[2]), Number(isoDate[3]));
    }

    return super.parse(value);
  }
}

function createValidDate(year: number, month: number, day: number): Date | null {
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}
