import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Unit } from "@app/interfaces/unit.interface";
import { UnitService } from "@app/services/unit/unit.service";
import { ALLOWED_EXCEL_TYPES } from "@app/utils/constants";
import { createManagedRxSubscriptions } from "@app/utils/rx-subscription-manager";
import * as FileSaver from "file-saver";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-import-update-unit-dialog",
  templateUrl: "./import-update-unit-dialog.component.html",
  styleUrls: ["./import-update-unit-dialog.component.scss"],
})
export class ImportUpdateUnitDialogComponent implements OnInit {
  public allowedTypes = ALLOWED_EXCEL_TYPES;
  public downloadedInventoryfile: File | null = null;
  public importedInventoryFile: File | null = null;
  public selectedProjectId: number | null = null;
  public isImportCompleted: boolean;
  public errorMessage: string;
  public rowsCreated = 0;
  public rowsUpdated = 0;
  public rowsRejected = 0;
  public errorInfo: { [key: number]: string };
  public isLoading = false;
  private subscriptions = createManagedRxSubscriptions({
    saveUnits: null,
    exportUnits: null,
    successDialogClosed: null,
  });

  constructor(
    public dialogRef: MatDialogRef<ImportUpdateUnitDialogComponent>,
    public dialog: MatDialog,
    public unitService: UnitService
  ) {}

  ngOnInit(): void {}

  public get isUploadDisabled(): boolean {
    return !this.selectedProjectId || !this.importedInventoryFile;
  }

  public async onUpload(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    this.importedInventoryFile = target.files[0];

    target.value = null; // allow selecting the same file again
  }

  public onSaveUnits(): void {
    if (!this.selectedProjectId || !this.importedInventoryFile) {
      return;
    }

    this.subscriptions.saveUnits.manage(
      this.unitService
        .saveUnits({ projectId: this.selectedProjectId, file: this.importedInventoryFile })
        .subscribe(
          (response) => {
            this.isImportCompleted = true;
            this.getRowsCountStats(response);
          },
          (error) => {
            this.errorMessage = error.error.errors
              ? this.onError(error.error.errors)
              : error.error.error;
            this.isImportCompleted = true;
          }
        )
    );
  }

  public downloadInventory(): void {
    if (!this.selectedProjectId) {
      return;
    }
    this.isLoading = true;
    this.subscriptions.exportUnits.manage(
      this.unitService
        .exportUnits(this.selectedProjectId)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(
          (response) => {
            this.isLoading = false;
            FileSaver.saveAs(response);
          },
          (error) => {
            this.isLoading = false;
          }
        )
    );
  }

  closeDialog(): void {
    this.dialogRef.close(this.isImportCompleted);
  }

  private onError(errorMessages: any): void {
    this.errorInfo = {};
    for (const error of errorMessages) {
      const columnName = error.param.split(".")[1];
      const rowId = error.param.match(/\d+/);

      if (!this.errorInfo[rowId]) {
        this.errorInfo[rowId] = "Row: " + rowId + ", " + columnName + ": " + error.message;
      } else if (!this.errorInfo[rowId].includes(columnName)) {
        this.errorInfo[rowId] += ", " + columnName + ": " + error.message;
      }
    }

    this.rowsRejected = Object.keys(this.errorInfo).length;
  }

  private getRowsCountStats(units: Unit[]): void {
    this.rowsUpdated = 0;
    this.rowsCreated = 0;
    units.forEach((unit) => {
      if (
        unit.createdAt.toLocaleString().slice(0, -3) ===
        unit.updatedAt.toLocaleString().slice(0, -3)
      ) {
        this.rowsCreated += 1;
      } else {
        this.rowsUpdated += 1;
      }
    });
  }
}
