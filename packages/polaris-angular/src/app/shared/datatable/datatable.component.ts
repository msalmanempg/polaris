/* eslint-disable no-underscore-dangle */
import { SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActionsColumn, AnchorColumn, Column, PageInfo } from "@app/interfaces";
import { ColumnType } from "@app/types/datatable-columnType";

@Component({
  selector: "app-datatable",
  templateUrl: "./datatable.component.html",
  styleUrls: ["./datatable.component.scss"],
})
export class DatatableComponent implements OnInit {
  @Input() length: number;
  @Input() limit: number;
  @Output()
  pageChange = new EventEmitter<PageInfo>();

  @Output()
  limitChange = new EventEmitter<number>();

  public selection: any;

  private _selectableColumns = false;
  private _columns: any[];
  private _rows: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.selection = new SelectionModel(true, []);
  }

  @Input() set rows(values: any[]) {
    if (values) {
      this._rows = values;
    }
  }

  get rows() {
    return this._rows;
  }

  @Input() set columns(values: any[]) {
    if (values && values.length > 0) {
      this._columns = values.map((column) => ({
        ...(column.columnType === ColumnType.ACTION
          ? (column as ActionsColumn)
          : column.columnType === ColumnType.ANCHOR
          ? (column as AnchorColumn)
          : (column as Column)),
      }));
    }
  }

  get columns() {
    return this._columns;
  }

  public get getColumnKeys(): string[] | [] {
    return this.columns ? this.columns?.map((column) => column.key) : [];
  }

  @Input()
  set selectable(value: boolean) {
    this._selectableColumns = value;
  }

  get selectable(): boolean {
    return this._selectableColumns;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.rows.forEach((row: any) => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.rows.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.id + 1}`;
  }
}
