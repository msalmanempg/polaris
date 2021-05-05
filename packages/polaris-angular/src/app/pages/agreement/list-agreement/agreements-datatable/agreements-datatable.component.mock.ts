import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { AgreementDTO } from "@app/interfaces";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "app-agreements-datatable",
})

// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class AgreementsDatatableComponentMock {
  @Input()
  public set agreements(agreements: AgreementDTO[]) {}

  @Input()
  public count: number;

  @Input()
  public pageSize: number;

  @Output()
  public pageChange: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public limitChange = new EventEmitter<number>();
}
