import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { EMAIL_REGEX, CNIC_REGEX } from "@app/utils/constants";
import { CustomerType } from "@app/types/customer.type";

@Component({
  selector: "app-customer-detail-form",
  templateUrl: "./customer-detail-form.component.html",
  styleUrls: ["./customer-detail-form.component.scss"],
})
export class CustomerDetailFormComponent implements OnInit {
  @Output() customerDetailformSet = new EventEmitter<FormGroup>();
  customerForm: FormGroup;
  individualCustomerType = true;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.setCustomerDetailForm();
    this.addNominee();
    this.customerDetailformSet.emit(this.customerForm);
  }

  public showJointCustomerForm(addJointCustomer: boolean): void {
    if (addJointCustomer) {
      this.addJoinCustomer();
    }
  }

  get joinCustomerForms() {
    return this.customerForm.get("jointCustomers") as FormArray;
  }

  get nomineeForms() {
    return this.customerForm.get("nominees") as FormArray;
  }

  get companyForm(): FormGroup {
    return this.customerForm.get("company") as FormGroup;
  }

  public setJointCustomerForm(): FormGroup {
    return this.formBuilder.group({
      type: [null],
      govtIdType: [null, Validators.required],
      govtId: [null, Validators.required],
      fullName: [null],
      guardianName: [null],
      relativeFullName: [null],
      relationType: [null],
      nationality: [null],
      passportNumber: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      gender: [null],
      dateOfBirth: [null],
      address: [null],
      country: [null],
      province: [null],
      city: [null],
      email: [
        null,
        [Validators.required.bind(this), Validators.email, Validators.pattern(EMAIL_REGEX)],
      ],
      primaryContactNumber: [null],
      secondaryContactNumber: [null],
      customerAttachments: this.formBuilder.array([]),
    });
  }

  setNomineeForm(): FormGroup {
    return this.formBuilder.group({
      govtIdType: [null, Validators.required],
      govtId: [null, Validators.required],
      fullName: [null],
      relationship: [null],
      nomineeFor: [null],
      email: [
        null,
        [Validators.required.bind(this), Validators.email, Validators.pattern(EMAIL_REGEX)],
      ],
      contactNumber: [null],
      nomineeAttachments: this.formBuilder.array([]),
    });
  }

  addJoinCustomer(): void {
    this.joinCustomerForms.push(this.setJointCustomerForm());
  }

  addNominee(): void {
    this.nomineeForms.push(this.setNomineeForm());
  }

  getJoinCustomerFormGroupAt(i: number): FormGroup {
    return this.joinCustomerForms.at(i) as FormGroup;
  }

  getNomineeFormGroupAt(i: number): FormGroup {
    return this.nomineeForms.at(i) as FormGroup;
  }

  public setCustomerDetailForm(): void {
    this.customerForm = this.formBuilder.group({
      type: [null, Validators.required],
      govtIdType: [null, Validators.required],
      govtId: [null, Validators.required],
      fullName: [null, Validators.required],
      guardianName: [null, Validators.required],
      relationType: [null, Validators.required],
      nationality: [null, Validators.required],
      passportNumber: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      gender: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      address: [null, Validators.required],
      country: [null],
      province: [null],
      city: [null, Validators.required],
      email: [
        null,
        [Validators.required.bind(this), Validators.email, Validators.pattern(EMAIL_REGEX)],
      ],
      primaryContactNumber: [null, Validators.required],
      secondaryContactNumber: [null, Validators.required],
      customerAttachments: this.formBuilder.array([]),
      jointCustomers: this.formBuilder.array([]),
      nominees: this.formBuilder.array([]),
      company: this.formBuilder.group({}),
    });
  }

  public setCompanyForm(): FormGroup {
    return this.formBuilder.group({
      name: [null],
      ntn: [null, Validators.required],
      registrationNumber: [null],
      address: [null],
      country: [null],
      province: [null],
      city: [null],
      contactNumber: [null],
      email: [
        null,
        [Validators.required.bind(this), Validators.email, Validators.pattern(EMAIL_REGEX)],
      ],
    });
  }

  addCompanyForm(): void {
    this.customerForm.setControl("company", this.setCompanyForm());
  }

  public onCustomerTypeChange(customerType: string): void {
    this.individualCustomerType = !(customerType === CustomerType.Company);
    if (!this.individualCustomerType) {
      this.addCompanyForm();
    }
  }
}
