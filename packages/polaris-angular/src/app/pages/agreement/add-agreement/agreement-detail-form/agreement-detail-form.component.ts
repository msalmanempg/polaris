import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";
import { EMAIL_REGEX } from "@app/utils/constants";
import { UnitService } from "@app/services/unit/unit.service";
import { createManagedRxSubscriptions } from "@app/utils";
import { Unit } from "@app/interfaces";
import { AgreementBookingComponent } from "./agreement-booking/agreement-booking.component";
@Component({
  selector: "app-agreement-detail-form",
  templateUrl: "./agreement-detail-form.component.html",
  styleUrls: ["./agreement-detail-form.component.scss"],
})
export class AgreementDetailFormComponent implements OnInit, OnDestroy {
  @ViewChild(AgreementBookingComponent) agreementBooking: AgreementBookingComponent;
  @Output()
  public agreementDetailformSet = new EventEmitter<FormGroup>();
  agreementForm: FormGroup;
  public selectedProjectId: number;

  private subscriptions = createManagedRxSubscriptions({
    getUnit: null,
  });
  constructor(private formBuilder: FormBuilder, private unitService: UnitService) {}

  ngOnInit(): void {
    this.setAgreementForm();
    this.addSalePerson();
    this.agreementDetailformSet.emit(this.agreementForm);

    this.agreementForm.get("unitId").valueChanges.subscribe((unitId) => {
      if (unitId) {
        this.subscriptions.getUnit.manage(
          this.unitService.getUnitById(unitId).subscribe(
            (response) => {
              this.setPublishedPriceValueForUnit(response);
            },
            (errorResponse) => {}
          )
        );
      }
    });
  }

  get salePersonForms() {
    return this.agreementForm.get("salePersons") as FormArray;
  }

  public setSalesPersonForm(): FormGroup {
    return this.formBuilder.group({
      designation: ["", Validators.required],
      fullName: ["", Validators.required],
      email: [
        null,
        [Validators.required.bind(this), Validators.email, Validators.pattern(EMAIL_REGEX)],
      ],
      contactNumber: ["", Validators.required],
    });
  }

  addSalePerson(): void {
    this.salePersonForms.push(this.setSalesPersonForm());
  }

  getFormGroupAt(i: number): FormGroup {
    return this.salePersonForms.at(i) as FormGroup;
  }

  setAgreementForm(): void {
    this.agreementForm = this.formBuilder.group({
      leadId: [null, Validators.required],
      agreementNumber: [null, Validators.required],
      unitId: [null, Validators.required],
      agreementBooking: new FormControl(""),
      salePersons: this.formBuilder.array([]),
    });
  }

  setPublishedPriceValueForUnit(unit: Unit): void {
    this.agreementBooking.setPossessionValue(unit.publishedPrice);
  }

  ngOnDestroy(): void {
    this.subscriptions.disposeAll();
  }
}
