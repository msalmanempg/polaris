import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DESIGNATIONS } from "./designations";
@Component({
  selector: "app-sales-person",
  templateUrl: "./sales-person.component.html",
  styleUrls: ["../agreement-detail/agreement-detail.component.scss"],
})
export class SalesPersonComponent implements OnInit {
  @Input() salePersonForm: FormGroup;

  public designationOptions = DESIGNATIONS;

  constructor() {}

  ngOnInit(): void {}
}
