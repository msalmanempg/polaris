import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { AlertTypes } from "@app/types/alert.type";
@Injectable({
  providedIn: "root",
})
export class AlertService {
  public defaultErrorMessage = "Internal server error.";

  public snakbarConfig: MatSnackBarConfig = {
    duration: 5000,
    verticalPosition: "top",
    horizontalPosition: "right",
  };
  private alertTypeClass = {
    [AlertTypes.success]: "alert-success",
    [AlertTypes.danger]: "alert-danger",
  };

  constructor(private snackBar: MatSnackBar) {}

  showAlert(message: string, type: AlertTypes) {
    this.snakbarConfig.panelClass = [this.alertTypeClass[type]];
    const messageText = message ? message : this.defaultErrorMessage;
    const snackBar = this.snackBar.open(messageText, null, this.snakbarConfig);
    snackBar.onAction().subscribe(() => {
      snackBar.dismiss();
    });
  }
}
