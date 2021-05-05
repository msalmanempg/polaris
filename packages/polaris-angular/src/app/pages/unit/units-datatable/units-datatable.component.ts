import { formatNumber, TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ActionsColumn, AnchorColumn, Column } from "@app/interfaces";
import { Unit } from "@app/interfaces/unit.interface";
import { ColumnAlign, ColumnType } from "@app/types/datatable-columnType";
import { FORMAT_DATE } from "@app/utils/constants";
import { format } from "date-fns";
import { UnitDetailsDialogComponent } from "../unit-details-dialog/unit-details-dialog.component";

export interface UnitRow {
  unitNumber: string;
  location: string;
  type: string;
  bed: number;
  basePrice: number | string;
  publishedPrice: number | string;
  netArea: number | string;
  grossArea: number | string;
  status: string;
  projectId: number;
  project: string;
  completionDate: Date | null | undefined | string;
}

@Component({
  selector: "app-units-datatable",
  templateUrl: "./units-datatable.component.html",
  styleUrls: ["./units-datatable.component.scss"],
})
export class UnitsDatatableComponent implements OnInit {
  @Input()
  public set units(units: Unit[]) {
    this.rows = units.map(this.mapUnitToUnitRow.bind(this));
  }

  @Input()
  public count: number;

  @Input()
  public pageSize: number;

  @Output()
  public pageOffsetChange = new EventEmitter<{ offset: number; pageSize: number }>();

  @Output()
  public pageSizeChange = new EventEmitter<number>();

  public rows: UnitRow[] = [];

  public columns: Column[];

  constructor(public router: Router, private titlecase: TitleCasePipe, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.columns = this.getColumnConfiguration();
  }

  getColumnConfiguration(): Column[] {
    const projectUrl = "projects/view/:id";

    return [
      {
        key: "unitNumber",
        value: "UNIT NO.",
        columnType: ColumnType.ACTION,
        actions: [
          {
            onClick: (row: any) => {
              const { projectId, ...unitRow } = row;

              this.dialog.open(UnitDetailsDialogComponent, {
                width: "572px",
                data: {
                  unitRow,
                },
              });
            },
          },
        ],
      } as ActionsColumn,
      { key: "type", value: "TYPE", columnType: ColumnType.TEXT },
      {
        key: "project",
        value: "PROJECT",
        columnType: ColumnType.ANCHOR,
        getUrl: (row: Unit): string => `/${projectUrl.replace(":id", row.projectId.toString())}`,
      } as AnchorColumn,
      {
        key: "grossArea",
        value: "GROSS AREA (sqft)",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "netArea",
        value: "NET AREA (sqft)",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "basePrice",
        value: "BASE PRICE (PKR)",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "publishedPrice",
        value: "PUBLISHED PRICE (PKR)",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "completionDate",
        value: "COMPLETION DATE",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      { key: "status", value: "STATUS", columnType: ColumnType.TEXT },
    ];
  }

  private mapUnitToUnitRow(unit: Unit): UnitRow {
    return {
      unitNumber: unit.unitNumber,
      location: unit.location,
      type: this.titlecase.transform(unit.type),
      bed: unit.bed,
      basePrice: formatNumber(unit.basePrice, "en-US", ""),
      publishedPrice: formatNumber(unit.publishedPrice, "en-US", ""),
      netArea: formatNumber(unit.netArea, "en-US", ""),
      grossArea: formatNumber(unit.grossArea, "en-US", ""),
      status: this.titlecase.transform(unit.status),
      projectId: unit.projectId,
      project: unit.Project.name,
      completionDate: unit.completionDate
        ? format(new Date(unit.completionDate), FORMAT_DATE.fullDateFormate)
        : "-",
    };
  }
}
