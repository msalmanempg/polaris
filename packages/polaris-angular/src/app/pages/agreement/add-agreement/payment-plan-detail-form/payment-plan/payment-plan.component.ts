import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-payment-plan",
  templateUrl: "./payment-plan.component.html",
  styleUrls: ["./payment-plan.component.scss"],
})
export class PaymentPlanComponent implements OnInit {
  @Input() paymentPlanForm: FormGroup;
  constructor() {}

  ngOnInit(): void {}
}
