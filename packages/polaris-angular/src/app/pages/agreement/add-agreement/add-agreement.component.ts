import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { AgreementFormDetail } from "@app/interfaces/agreement.interface";
import { Company, Customer, Nominee } from "@app/interfaces/customer.interface";
import { AgreementService } from "@app/services/agreement/agreement.service";
import { AlertService } from "@app/services/alert/alertservice.service";
import { AgreementStatus } from "@app/types/agreement.type";
import { AlertTypes } from "@app/types/alert.type";
import { createManagedRxSubscriptions } from "@app/utils";

const AGREEMENT_STATUS_TYPE = {
  [AgreementStatus.Draft]: "secondary",
  [AgreementStatus.Active]: "warning",
  [AgreementStatus.Transferred]: "success",
  [AgreementStatus.Terminated]: "warning",
};
@Component({
  selector: "app-add-agreement",
  templateUrl: "./add-agreement.component.html",
  styleUrls: ["./add-agreement.component.scss"],
})
export class AddAgreementComponent implements OnInit {
  public agreementFormDetails: AgreementFormDetail = {};

  public customerDetails = {};
  public agreementDetails = {};
  public agreementForm: FormGroup;

  public subscriptions = createManagedRxSubscriptions({
    saveAgreement: null,
  });

  constructor(
    private formBuilder: FormBuilder,
    public agreementService: AgreementService,
    public alertService: AlertService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.setAgreementForm();
    this.setAgreementStatus(AgreementStatus.Draft);
  }

  setAgreementForm(): void {
    this.agreementForm = this.formBuilder.group({
      agreementDetail: this.formBuilder.group({}),
      customerDetail: this.formBuilder.group({}),
      paymentPlanDetail: this.formBuilder.group({}),
    });
  }

  public onAgreementDetailFormSet(childForm: FormGroup): void {
    this.agreementForm.setControl("agreementDetail", childForm);
  }

  public onCustomerDetailFormSet(childForm: FormGroup): void {
    this.agreementForm.setControl("customerDetail", childForm);
  }

  public onPaymentPlanDetailFormSet(childForm: FormGroup): void {
    this.agreementForm.setControl("paymentPlanDetail", childForm);
  }

  setAgreementStatus(status: AgreementStatus): void {
    this.agreementFormDetails.status = status;
    this.agreementFormDetails.statusType = AGREEMENT_STATUS_TYPE[status];
  }

  public submitAgreementForm(): void {
    if (!this.agreementForm.valid) {
      return;
    }

    const agreementDetail = this.updateAgreementData();
    const customerDetail = this.updateCustomerData();
    const { paymentPlanDetail } = this.agreementForm.value;

    const customer: Customer = {
      ...customerDetail.customer,
    };

    const customersList = customerDetail.jointCustomers
      ? [customer, ...customerDetail.jointCustomers]
      : [customer];

    const agreementData: AgreementFormDetail = {
      ...agreementDetail,
      ...paymentPlanDetail,
      status: paymentPlanDetail.status || AgreementStatus.Draft,
      ...(paymentPlanDetail.installmentStartDate && {
        installmentStartDate: new Date(paymentPlanDetail.installmentStartDate)
          .toISOString()
          .toString(),
      }),
      ...(paymentPlanDetail.installmentEndDate && {
        installmentEndDate: new Date(paymentPlanDetail.installmentEndDate).toISOString().toString(),
      }),
      ...(paymentPlanDetail.agreementAttachments && {
        agreementAttachments: paymentPlanDetail.agreementAttachments,
      }),
      customers: customersList,
      ...(customerDetail.nominees && {
        nominees: customerDetail.nominees,
      }),
      ...(customerDetail.company && {
        company: customerDetail.company,
      }),
    };

    this.subscriptions.saveAgreement.manage(
      this.agreementService.saveAgreement(agreementData).subscribe(
        (response) => {
          this.alertService.showAlert("Agreement Successfully added", AlertTypes.success);
          this.router.navigate(["/agreements"]);
        },
        (errorResponse) => {
          console.log("error", errorResponse);
          this.alertService.showAlert("Something went Wrong!!!", AlertTypes.danger);
        }
      )
    );
  }

  public onCancel(): void {
    this.router.navigate(["/agreements"]);
  }

  public onStepperChange(event?: StepperSelectionEvent): void {
    switch (event.previouslySelectedIndex) {
      case 0: {
        this.updateAgreementData();
        break;
      }
      case 1: {
        this.updateCustomerData();
        break;
      }
      default: {
        break;
      }
    }
  }

  updateAgreementData(): AgreementFormDetail {
    const agreementDetailForm = this.agreementForm.controls.agreementDetail as FormGroup;
    let agreementInfo = {};
    if (agreementDetailForm.controls.agreementBooking) {
      const {
        agreementDate,
        bookingDate,
        notarisedDate,
        publishedPrice,
        bookingPrice,
      } = agreementDetailForm.controls.agreementBooking.value;
      let { discountValue, posessionValue } = agreementDetailForm.controls.agreementBooking.value;

      discountValue = this.formatWithPercentageAmountValue(discountValue);
      posessionValue = this.formatWithPercentageAmountValue(posessionValue);

      agreementInfo = {
        ...(agreementDetailForm.controls.leadId.valid && {
          leadId: agreementDetailForm.value.leadId,
        }),
        ...(agreementDetailForm.controls.agreementNumber.valid && {
          agreementNumber: agreementDetailForm.value.agreementNumber,
        }),
        ...(agreementDetailForm.controls.unitId.valid && {
          unitId: agreementDetailForm.value.unitId,
        }),
        ...(publishedPrice && {
          publishedPrice,
        }),
        ...(bookingPrice && {
          bookingPrice,
        }),
        ...(discountValue && {
          discountValue,
        }),
        ...(bookingDate && {
          bookingDate: new Date(bookingDate).toISOString().toString(),
        }),
        ...(posessionValue && {
          posessionValue,
        }),
        ...(agreementDate && {
          notarisedDate: new Date(agreementDate).toISOString().toString(),
        }),
        ...(agreementDate && {
          agreementDate: new Date(agreementDate).toISOString().toString(),
        }),
        ...(agreementDetailForm.controls.salePersons.valid && {
          salePersons: agreementDetailForm.value.salePersons,
        }),
      };
    }
    return agreementInfo;
  }

  updateCustomerData(): any {
    const customerDetailForm = this.agreementForm.controls.customerDetail as FormGroup;

    const nominees = this.updateNomineeData(customerDetailForm.controls.nominees as FormArray);
    const jointCustomers = this.updateJointCustomerData(
      customerDetailForm.controls.jointCustomers as FormArray
    );
    const company = this.getCompanyData(customerDetailForm.controls.company as FormGroup);

    const customersInfo = {
      customer: {
        ...(customerDetailForm.controls.type.valid && { type: customerDetailForm.value.type }),
        ...this.getCustomerData(customerDetailForm),
      },
      ...(nominees.length && { nominees }),
      ...(jointCustomers.length && { jointCustomers }),
      ...(Object.keys(company).length > 0 && { company }),
    };
    return customersInfo;
  }

  updateNomineeData(formArray: FormArray): Array<Nominee> {
    const customerNominees: Array<Nominee> = [];
    formArray.controls.forEach((nomineeForm: AbstractControl) => {
      const nomineeFormGroup = nomineeForm as FormGroup;
      const customerNominee = {
        ...(nomineeFormGroup.controls.govtIdType.valid &&
          nomineeFormGroup.value.govtIdType && { govtIdType: nomineeFormGroup.value.govtIdType }),
        ...(nomineeFormGroup.controls.govtId.valid && { govtId: nomineeFormGroup.value.govtId }),
        ...(nomineeFormGroup.controls.fullName.valid && {
          fullName: nomineeFormGroup.value.fullName,
        }),
        ...(nomineeFormGroup.controls.contactNumber.valid && {
          contactNumber: nomineeFormGroup.value.contactNumber,
        }),
        ...(nomineeFormGroup.controls.email.valid && { email: nomineeFormGroup.value.email }),
        ...(nomineeFormGroup.controls.nomineeFor.valid && {
          nomineeFor: nomineeFormGroup.value.nomineeFor,
        }),
        ...(nomineeFormGroup.controls.relationship.valid &&
          nomineeFormGroup.value.relationship && {
            relationship: nomineeFormGroup.value.relationship,
          }),
        ...(nomineeFormGroup.controls.nomineeAttachments.valid && {
          nomineeAttachments: nomineeFormGroup.value.nomineeAttachments,
        }),
      };

      if (Object.keys(customerNominee).length > 0) {
        customerNominees.push(customerNominee);
      }
    });
    return customerNominees;
  }

  updateJointCustomerData(formArray: FormArray): Array<Customer> {
    const jointCustomers: Array<Customer> = [];
    formArray.controls.forEach((jointCustomerForm: AbstractControl) => {
      const jointCustomerFormGroup = jointCustomerForm as FormGroup;
      const jointCustomer = {
        ...this.getCustomerData(jointCustomerFormGroup, 0),
      };

      if (Object.keys(jointCustomer).length > 0) {
        jointCustomers.push(jointCustomer);
      }
    });
    return jointCustomers;
  }

  getCustomerData(formGroup: FormGroup, isPrimary = 1): Customer {
    const customer: Customer = {
      ...(formGroup.controls.govtIdType.valid && { govtIdType: formGroup.value.govtIdType }),
      ...(formGroup.controls.govtId.valid && { govtId: formGroup.value.govtId }),
      ...(formGroup.controls.fullName.valid && { fullName: formGroup.value.fullName }),
      ...(formGroup.controls.gender.valid && { gender: formGroup.value.gender }),
      ...(formGroup.controls.guardianName.valid && { guardianName: formGroup.value.guardianName }),
      ...(formGroup.controls.relationType.valid && { relationType: formGroup.value.relationType }),
      ...(formGroup.controls.nationality.valid && { nationality: formGroup.value.nationality }),
      ...(formGroup.controls.passportNumber.valid && {
        passportNumber: formGroup.value.passportNumber,
      }),
      ...(formGroup.controls.dateOfBirth.valid && {
        dateOfBirth: new Date(formGroup.value.dateOfBirth).toISOString().toString(),
      }),
      ...(formGroup.controls.address.valid && { address: formGroup.value.address }),
      ...(formGroup.controls.city.valid && { city: formGroup.value.city }),
      ...(formGroup.controls.email.valid && { email: formGroup.value.email }),
      ...(formGroup.controls.primaryContactNumber.valid && {
        primaryContactNumber: formGroup.value.primaryContactNumber,
      }),
      ...(formGroup.controls.secondaryContactNumber.valid && {
        secondaryContactNumber: formGroup.value.secondaryContactNumber,
      }),
      ...(formGroup.controls.customerAttachments.valid && {
        customerAttachments: formGroup.value.customerAttachments,
      }),
    };

    if (Object.keys(customer).length > 0) {
      customer.isPrimary = isPrimary;
    }
    return customer;
  }

  getCompanyData(formGroup: FormGroup): Company {
    let company = {};
    if (Object.keys(formGroup.controls).length > 0) {
      company = {
        ...(formGroup.controls.address.valid && { address: formGroup.value.address }),
        ...(formGroup.controls.city.valid && { city: formGroup.value.city }),
        ...(formGroup.controls.contactNumber.valid && {
          contactNumber: formGroup.value.contactNumber,
        }),
        ...(formGroup.controls.email.valid && { email: formGroup.value.email }),
        ...(formGroup.controls.name.valid && { name: formGroup.value.name }),
        ...(formGroup.controls.ntn.valid && { ntn: formGroup.value.ntn }),
        ...(formGroup.controls.registrationNumber.valid && {
          registrationNumber: formGroup.value.registrationNumber,
        }),
      };
    }

    return company;
  }

  formatWithPercentageAmountValue(value: string): string {
    if (value) {
      const digitsRegex = /\d+/g;
      const numberValue = value ? value.split(" ") : undefined;
      const [formatedValue] = numberValue
        ? numberValue[1].replace(/,/g, "").match(digitsRegex)
        : value;
      return formatedValue;
    }
    return value;
  }

  saveDraftAgreement(): void {}
}
