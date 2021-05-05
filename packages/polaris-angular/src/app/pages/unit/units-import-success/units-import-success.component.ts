import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "app-units-import-success",
  templateUrl: "./units-import-success.component.html",
  styleUrls: ["./units-import-success.component.scss"],
})
export class UnitsImportSuccessComponent implements OnInit {
  @Output()
  public closeClicked = new EventEmitter<void>();
  @Input()
  public errorInfo: { [key: number]: string } = {};
  @Input()
  public alternateErrorMessage: string;
  @Input()
  rowsCreated = 0;
  @Input()
  rowsUpdated = 0;
  @Input()
  rowsRejected = 0;
  constructor() {}

  ngOnInit(): void {}
}
