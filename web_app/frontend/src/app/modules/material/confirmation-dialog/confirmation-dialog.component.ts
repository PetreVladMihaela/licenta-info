import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  title: string;
  message: string;
  acceptButton: string;
  cancelButton: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: ConfirmationDialogModel
  ) {
    this.title = dialogData.title;
    this.message = dialogData.message;
    this.acceptButton = dialogData.acceptButton;
    this.cancelButton = dialogData.cancelButton;
  }

  onAccept(): void {
    this.dialogRef.close(true);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}

export class ConfirmationDialogModel {
  constructor(
    public title: string,
    public message: string,
    public acceptButton: string = 'Yes',
    public cancelButton: string = 'No'
  ) {}
}
