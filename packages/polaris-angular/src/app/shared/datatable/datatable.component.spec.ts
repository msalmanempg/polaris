import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ColumnType } from "@app/types/datatable-columnType";
import { DatatableComponent } from "./datatable.component";
import { Component, ViewChild, Input, Directive } from "@angular/core";

@Directive(
  // eslint-disable-next-line @angular-eslint/directive-selector
  { selector: "app-datatable-pager" }
)
// eslint-disable-next-line @angular-eslint/directive-class-suffix
class DatatablePagerComponent {
  @Input()
  length: number;

  @Input()
  pageSize: number;

  @Input()
  pageIndex: boolean;

  @Input()
  pageSizeOptions: number[];

  showFirstLastButtons = true;
}

@Component({
  template: `
    <app-datatable
      [rows]="rows"
      [columns]="columns"
      [selectable]="true"
      [length]="rows.length"
      [limit]="pageSize"
    ></app-datatable>
  `,
})
class TestHostComponent {
  @ViewChild(DatatableComponent)
  tableComponent: DatatableComponent;
  columns: any[] = [
    {
      key: "id",
      value: "Id",
      columnType: ColumnType.TEXT,
    },
  ];
  rows: any[] = [
    {
      id: 37,
      name: "projname",
      city: "Catabola",
      completionDate: "11, March 2021",
    },
  ];
  pageSize = 5;
}

describe("DatatableComponent", () => {
  let component: DatatableComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatatableComponent, TestHostComponent, DatatablePagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance.tableComponent;
    fixture.detectChanges();
  });

  it("should create", () => {
    component = fixture.componentInstance.tableComponent;
    expect(component).toBeTruthy();
  });

  it("should columns verified", () => {
    component = fixture.componentInstance.tableComponent;
    expect(component.getColumnKeys).toEqual(["id"]);
  });

  it("should select all row", () => {
    fixture.componentInstance.tableComponent.masterToggle();
    expect(fixture.componentInstance.tableComponent.selection.selected.length).toEqual(1);
  });
});
