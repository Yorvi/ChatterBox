import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface ReportDialogData {
  targetLabel: string;
}

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Report {{ data.targetLabel }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Why are you reporting this?</mat-label>
          <textarea matInput rows="3" formControlName="reason"></textarea>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-flat-button color="warn" type="submit" [disabled]="form.invalid">Submit report</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        min-width: 320px;
      }
    `,
  ],
})
export class ReportDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ReportDialogComponent>);
  readonly data = inject<ReportDialogData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  readonly form = this.fb.group({
    reason: ['', [Validators.required, Validators.minLength(3)]],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(this.form.getRawValue().reason ?? undefined);
  }
}
