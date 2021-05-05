/* eslint-disable @typescript-eslint/ban-types */
import { Component, forwardRef, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { PaginatedProject, Project } from "@app/interfaces";
import { ProjectService } from "@app/services/project/project.service";
import { createManagedRxSubscriptions } from "@app/utils/rx-subscription-manager";
import { noop } from "rxjs";

@Component({
  selector: "app-select-project",
  templateUrl: "./select-project.component.html",
  styleUrls: ["./select-project.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectProjectComponent),
      multi: true,
    },
  ],
})
export class SelectProjectComponent implements OnInit, ControlValueAccessor {
  @Input()
  public includeAllOption = false;

  @Input() required = false;

  public projects: { key: number; value: string }[] = [];

  public selectedProjectIds: number | number[] | null = null;

  public selectProjectLabel = "Select Project";

  public onChange: Function = noop;

  public onTouched: Function = noop;

  private allOption: { key: number; value: string } = { key: null, value: "All" };

  private subscriptions = createManagedRxSubscriptions({
    getProjects: null,
  });

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  public get value(): number | number[] {
    return this.selectedProjectIds;
  }

  public set value(newSelectedProjectIds: number | number[]) {
    this.selectedProjectIds = newSelectedProjectIds;
    this.onChange(newSelectedProjectIds);
  }

  public registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  public writeValue(value: number | number[]): void {
    this.value = value;
  }

  private getProjects(): void {
    this.subscriptions.getProjects.manage(
      this.projectService.all().subscribe((projects: Project[] | PaginatedProject) => {
        this.projects = [
          ...(this.includeAllOption ? [this.allOption] : []),
          ...(projects as Project[]).map((project: any) => ({
            key: project.id,
            value: project.name,
          })),
        ];
      })
    );
  }
}
