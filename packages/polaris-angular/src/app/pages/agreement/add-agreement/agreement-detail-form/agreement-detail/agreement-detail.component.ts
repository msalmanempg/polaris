import { Component, Input, OnInit, EventEmitter, forwardRef, Output } from "@angular/core";
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-agreement-detail",
  templateUrl: "./agreement-detail.component.html",
  styleUrls: ["./agreement-detail.component.scss"],
})
export class AgreementDetailComponent implements OnInit {
  @Input() selectedProjectId: number;
  @Input() agreementDetailForm: FormGroup;
  constructor() {}

  ngOnInit(): void {}
}
