import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-bank-details-form",
  templateUrl: "./bank-details-form.component.html",
  styleUrls: ["./bank-details-form.component.scss"],
})
export class BankDetailsFormComponent implements OnInit {
  @Input() bankDetailForm: FormGroup;
  constructor() {}

  ngOnInit(): void {}
}
