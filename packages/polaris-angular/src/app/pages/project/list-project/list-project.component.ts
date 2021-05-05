import { formatNumber } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActionsColumn, AnchorColumn, Column, PaginatedProject, Project } from "@app/interfaces";
import { ProjectService } from "@app/services/project/project.service";
import { ColumnAlign, ColumnType } from "@app/types/datatable-columnType";
import { FORMAT_DATE } from "@app/utils/constants";
import { createManagedRxSubscriptions } from "@app/utils/rx-subscription-manager";
import { format } from "date-fns";

export interface ProjectRow {
  id?: number;
  name: string;
  city: string;
  completionDate: string | Date;
  units: number | string;
  availableUnits: number | string;
  bookedUnits: number | string;
  soldUnits: number | string;
}

@Component({
  selector: "app-list-project",
  templateUrl: "./list-project.component.html",
  styleUrls: ["./list-project.component.scss"],
})
export class ListProjectComponent implements OnInit {
  public pageOffset = 0;
  public pageSize = 20;
  public dataColumns: Column[] = [];
  public projectRows: ProjectRow[] = [];
  public totalCount = 0;
  public subscriptions = createManagedRxSubscriptions({
    all: null,
  });
  constructor(public projectService: ProjectService, public router: Router) {}

  ngOnInit(): void {
    this.getColumnConfiguration();
    this.fetchAll();
  }

  fetchAll(): void {
    this.subscriptions.all.manage(
      this.projectService.all(this.pageOffset, this.pageSize).subscribe(
        (response: PaginatedProject | Project[]) => {
          const projectsResult = response as PaginatedProject;
          console.log(projectsResult);
          this.projectRows =
            projectsResult.results && projectsResult.results.length > 0
              ? projectsResult.results.map((project: Project) =>
                  this.mapProjectToProjectRow(project)
                )
              : [];
          this.totalCount = projectsResult.count;
        },
        (error: any) => {
          console.log(error);
        }
      )
    );
  }

  onUpdate(projectId: number) {
    this.router.navigate([`projects/edit/${projectId}`]);
  }

  getColumnConfiguration(): void {
    const projectEditUrl = "projects/view/:id";
    this.dataColumns = [
      {
        key: "name",
        value: "PROJECT",
        columnType: ColumnType.ANCHOR,
        getUrl: (row: Project): string => `/${projectEditUrl.replace(":id", row.id.toString())}`,
      } as AnchorColumn,
      { key: "city", value: "CITY", columnType: ColumnType.TEXT },
      {
        key: "completionDate",
        value: "COMPLETION DATE",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "units",
        value: "TOTAL UNITS",
        columnType: ColumnType.ANCHOR,
        align: ColumnAlign.RIGHT,
        getUrl: (row: Project): string => "/units",
      } as AnchorColumn,
      {
        key: "availableUnits",
        value: "AVAILABLE UNITS",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "bookedUnits",
        value: "UNITS BOOKED",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "soldUnits",
        value: "UNITS SOLD",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "actions",
        value: "ACTIONS",
        columnType: ColumnType.ACTION,
        actions: [
          {
            icon: "edit",
            onClick: (row: Project): void => this.onUpdate(row.id),
          },
        ],
      } as ActionsColumn,
    ];
  }

  public onPageChange(pageInfo: any): void {
    this.pageOffset = pageInfo.offset;
    this.pageSize = pageInfo.pageSize;
    this.fetchAll();
  }

  public onLimitChange(newLimit: any): void {
    this.pageSize = newLimit;
    this.fetchAll();
  }

  public onClickAddNewProject(): void {
    this.router.navigate(["/projects/add"]);
  }

  private mapProjectToProjectRow(project: Project): ProjectRow {
    return {
      id: project.id,
      name: project.name,
      city: project.city,
      completionDate: project.completionDate
        ? format(new Date(project.completionDate), FORMAT_DATE.fullDateFormate)
        : "-",
      units: project.units.length,
      availableUnits: formatNumber(
        project.units.reduce((count, unit) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          unit.status === "available" ? count++ : false;
          return count;
        }, 0),
        "en-US",
        ""
      ),
      bookedUnits: formatNumber(
        project.units.reduce((count, unit) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          unit.status === "booked" ? count++ : false;
          return count;
        }, 0),
        "en-US",
        ""
      ),
      soldUnits: formatNumber(
        project.units.reduce((count, unit) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          unit.status === "sold" ? count++ : false;
          return count;
        }, 0),
        "en-US",
        ""
      ),
    };
  }
}
