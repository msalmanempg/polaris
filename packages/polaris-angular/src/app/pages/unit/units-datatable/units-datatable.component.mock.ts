import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { Unit } from "@app/interfaces/unit.interface";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "app-units-datatable",
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class UnitsDatatableComponentMock {
  @Input()
  public set units(units: Unit[]) {}

  @Input()
  public count: number;

  @Input()
  public pageSize: number;

  @Output()
  public pageChange: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public limitChange = new EventEmitter<number>();
}
