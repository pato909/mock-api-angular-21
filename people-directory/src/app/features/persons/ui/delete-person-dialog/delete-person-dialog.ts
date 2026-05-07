import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

type DeletePersonDialogData = {
  firstName: string;
  lastName: string;
};

@Component({
  selector: 'app-delete-person-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Supprimer cette personne ?</h2>

    <mat-dialog-content>
      Cette action supprimera definitivement {{ fullName(data) }}.
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Annuler</button>

      <button mat-flat-button color="warn" type="button" (click)="confirm()">Supprimer</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeletePersonDialog {
  private readonly dialogRef = inject(MatDialogRef<DeletePersonDialog, boolean>);
  protected readonly data = inject<DeletePersonDialogData>(MAT_DIALOG_DATA);

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected confirm(): void {
    this.dialogRef.close(true);
  }

  fullName(data : DeletePersonDialogData): string {
    return `${data.firstName} ${data.lastName}`;
  }
}
