import { Directive, Input } from "@angular/core";
import { Column } from "@app/interfaces";

// eslint-disable-next-line @angular-eslint/directive-selector
@Directive({ selector: "app-datatable" })
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DatatableComponentMock {
  @Input() rows: any[];

  @Input() columns: Column[];

  @Input() length: number;

  @Input() limit: number;

  @Input() selectable: boolean;
}
