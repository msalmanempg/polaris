import { unitStatus } from ".prisma/client";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTabChangeEvent } from "@angular/material/tabs";
import {
  PaginatedUnit,
  Unit,
  UnitStatusAll,
  UnitStatusCount,
} from "@app/interfaces/unit.interface";
import { UnitService } from "@app/services/unit/unit.service";
import { createManagedRxSubscriptions } from "@app/utils";
import { ImportUpdateUnitDialogComponent } from "./import-update-unit-dialog/import-update-unit-dialog.component";

interface StatusTab {
  key: UnitStatusAll;
  name: string;
  count: number;
}

@Component({
  selector: "app-unit",
  templateUrl: "./unit.component.html",
  styleUrls: ["./unit.component.scss"],
})
export class UnitComponent implements OnInit {
  public units: Unit[] = [];

  public pageSize = 20;

  public pageOffset = 0;

  public count = 0;

  public includeStats = true;

  public selectedProjectId: number | null = null;

  public status: UnitStatusAll | null = null;

  public statusTabs: StatusTab[] = [
    { key: unitStatus.booked, name: "Booked", count: 0 },
    { key: unitStatus.sold, name: "Sold", count: 0 },
    { key: unitStatus.available, name: "Available", count: 0 },
    { key: "all", name: "All", count: 0 },
  ];

  public selectedstatusTabIndex: number = this.statusTabs.findIndex(
    (statusTab: StatusTab) => statusTab.key === "all"
  );

  public subscriptions = createManagedRxSubscriptions({
    getAllUnits: null,
    importUnitsDialogClosed: null,
  });

  constructor(public unitService: UnitService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllUnits();
  }

  getAllUnits(): void {
    const params = {
      pageOffset: this.pageOffset,
      pageSize: this.pageSize,
      projectId: this.selectedProjectId,
      status: this.status,
      includeStats: this.includeStats,
    };
    this.subscriptions.getAllUnits.manage(
      this.unitService.getAllUnits(params).subscribe(
        (response: PaginatedUnit | Unit[]) => {
          const unitsResult = response as PaginatedUnit;
          this.units = unitsResult.results;
          this.count = unitsResult.count;

          this.statusTabs.map((statusTab) => {
            const unitStatusCount: UnitStatusCount =
              unitsResult.stats &&
              unitsResult.stats.find(
                (unitStat: UnitStatusCount) => unitStat.status === statusTab.key
              );

            statusTab.count = unitStatusCount?.count || 0;
          });
        },
        (error: any) => {
          console.log(error);
        }
      )
    );
  }

  public onPageOffsetChange(pageInfo: { offset: number; pageSize: number }): void {
    this.pageOffset = pageInfo.offset;
    this.pageSize = pageInfo.pageSize;
    this.getAllUnits();
  }

  public onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.getAllUnits();
  }

  public onClickImportAndUpdateUnitsButton(): void {
    const dialogRef = this.dialog.open(ImportUpdateUnitDialogComponent, {
      width: "572px",
    });
    this.subscriptions.importUnitsDialogClosed.manage(
      dialogRef.afterClosed().subscribe((isImportCompleted) => {
        if (isImportCompleted) {
          this.getAllUnits();
        }
      })
    );
  }

  public onProjectIdChange(): void {
    this.resetPagination();
    this.getAllUnits();
  }

  public onClickStatusTab(changeEvent: MatTabChangeEvent) {
    this.status = this.statusTabs[changeEvent.index].key as UnitStatusAll;
    if (this.status === "all") {
      this.status = null;
    }
    this.resetPagination();
    this.getAllUnits();
  }

  public resetPagination(): void {
    this.pageSize = 20;
    this.pageOffset = 0;
  }
}
