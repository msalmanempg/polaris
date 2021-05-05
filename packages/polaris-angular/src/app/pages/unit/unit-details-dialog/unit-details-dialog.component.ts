import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-unit-details-dialog",
  templateUrl: "./unit-details-dialog.component.html",
  styleUrls: ["./unit-details-dialog.component.scss"],
})
export class UnitDetailsDialogComponent implements OnInit {
  public unit: { field: string; value: string }[];

  displayedColumns: string[] = ["field", "value"];

  public fields = {
    basePrice: "Base Price",
    bed: "Bed",
    completionDate: "Completion Date",
    grossArea: "Gross Area",
    location: "Location",
    netArea: "Net Area (sqft)",
    project: "Project",
    publishedPrice: "Published Price",
    status: "Status",
    type: "Type",
    unitNumber: "Unit No.",
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<UnitDetailsDialogComponent>
  ) {}

  public ngOnInit(): void {
    const { unitRow } = this.data;

    this.unit = Object.entries(unitRow).map((entry) => ({
      field: (this.fields as any)[entry[0]],
      value: entry[1] as string,
    }));
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
