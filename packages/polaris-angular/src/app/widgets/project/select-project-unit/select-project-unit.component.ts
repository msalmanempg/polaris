/* eslint-disable @typescript-eslint/ban-types */
import { Component, forwardRef, Input, OnDestroy, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { PaginatedUnit, Unit, UnitStatusAll } from "@app/interfaces/unit.interface";
import { UnitService } from "@app/services/unit/unit.service";
import { createManagedRxSubscriptions } from "@app/utils/rx-subscription-manager";
import { noop } from "rxjs";

@Component({
  selector: "app-select-project-unit",
  templateUrl: "./select-project-unit.component.html",
  styleUrls: ["./select-project-unit.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectProjectUnitComponent),
      multi: true,
    },
  ],
})
export class SelectProjectUnitComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input()
  public includeAllOption = false;

  @Input()
  public set projectId(newProjectId: number) {
    if (this.activeProjectId !== newProjectId) {
      this.activeProjectId = newProjectId;
      this.getUnitsByProject();
    }
  }

  @Input() required = false;

  @Input() status: UnitStatusAll;

  public selectProjectUnitLabel = "Select Unit";
  public projectUnits: { key: number; value: string }[] = [];
  public selectedProjectUnitId: number | number[] | null = null;
  public onChange: Function = noop;
  public onTouched: Function = noop;

  private activeProjectId: number | null = null;

  private allOption: { key: number; value: string } = { key: null, value: "All" };

  private subscriptions = createManagedRxSubscriptions({
    getProjectUnits: null,
  });

  constructor(private unitService: UnitService) {}

  ngOnInit(): void {}

  getUnitsByProject(): void {
    if (this.activeProjectId) {
      this.subscriptions.getProjectUnits.manage(
        this.unitService
          .getAllUnits({ projectId: this.activeProjectId, status: this.status || null })
          .subscribe((projectUnits: Unit[] | PaginatedUnit) => {
            this.projectUnits = [
              ...(this.includeAllOption ? [this.allOption] : []),
              ...(projectUnits as Unit[]).map((unit) => ({
                key: unit.id,
                value: unit.unitNumber,
              })),
            ];
          })
      );
    }
  }

  public get value(): number | number[] {
    return this.selectedProjectUnitId;
  }

  public set value(newSelectedProjectUnitId: number | number[]) {
    this.selectedProjectUnitId = newSelectedProjectUnitId;
    this.onChange(newSelectedProjectUnitId);
  }

  public ngOnDestroy(): void {
    this.subscriptions.disposeAll();
  }

  public writeValue(value: number | number[]): void {
    this.value = value;
  }

  public registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }
}
