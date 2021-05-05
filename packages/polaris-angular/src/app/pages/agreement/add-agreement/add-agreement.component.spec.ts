import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddAgreementComponent } from "./add-agreement.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AgreementService } from "@app/services/agreement/agreement.service";
import { AlertService } from "@app/services/alert/alertservice.service";
import { of, throwError } from "rxjs";
import { AgreementAttachment } from "@app/interfaces/agreement.interface";
import { CustomerAttachment } from "@app/interfaces/customer.interface";
import { AgreementStatus } from "@app/types/agreement.type";
import { AlertTypes } from "@app/types/alert.type";

describe("AddAgreementComponent", () => {
  let component: AddAgreementComponent;
  let fixture: ComponentFixture<AddAgreementComponent>;
  let agreementServiceMock: jasmine.SpyObj<AgreementService>;
  let alertServiceMock: jasmine.SpyObj<AlertService>;
  const formBuilder = new FormBuilder();
  const agreementDetailsMock = formBuilder.group({
    leadId: 1234,
    agreementNumber: "UI1243",
    unitId: 1,
    agreementBooking: {
      agreementDate: new Date(),
      bookingDate: new Date(),
      publishedPrice: 1200000,
      bookingPrice: 12000,
      discountValue: "PKR 1,188,000.00 (99.00%)",
      posessionValue: "PKR 10,000.00 (83.33%)",
    },
    salePersons: formBuilder.array([
      {
        designation: "Director",
        fullName: "Saad",
        email: "saad@gmail.com",
        contactNumber: "+92 3337867543",
      },
    ]),
  });

  const customerDetailsMock = formBuilder.group({
    type: "company",
    govtIdType: "cnic",
    govtId: "00000-0000000-0",
    fullName: "hira",
    gender: "femail",
    guardianName: "junaid",
    relationType: "father",
    nationality: "Pakistan",
    passportNumber: "8297867t6",
    dateOfBirth: new Date("2022-02-15T00:03:58.000Z"),
    address: "lhr",
    city: "lahore",
    email: "hira@gmail.com",
    primaryContactNumber: "+92 3416787654",
    secondaryContactNumber: "+92 3146787654",
    customerAttachments: [] as CustomerAttachment[],
    company: formBuilder.group({
      address: "lhr",
      city: "lahore",
      contactNumber: "+92 3157676567",
      email: "green@gmail.com",
      name: "green.co",
      ntn: "79699",
      registrationNumber: "7770i",
    }),
    nominees: formBuilder.array([
      formBuilder.group({
        govtIdType: "cnic",
        govtId: "00000-0000000-0",
        fullName: "maria",
        contactNumber: "+92 3337867543",
        email: "xyz@outlook.com",
        nomineeFor: "abc",
        relationship: "sister",
        nomineeAttachments: [] as CustomerAttachment[],
      }),
    ]),
    jointCustomers: formBuilder.array([
      formBuilder.group({
        govtIdType: "cnic",
        govtId: "00000-0000000-0",
        fullName: "hira",
        gender: "femail",
        guardianName: "junaid",
        relationType: "father",
        nationality: "Pakistan",
        passportNumber: "8297867t6",
        dateOfBirth: new Date("2022-02-15T00:03:58.000Z"),
        address: "lhr",
        city: "lahore",
        email: "hira@gmail.com",
        primaryContactNumber: "+92 3416787654",
        secondaryContactNumber: "+92 3146787654",
        customerAttachments: [] as CustomerAttachment[],
      }),
    ]),
  });

  const paymentPlanDetailsMock = formBuilder.group({
    installmentStartDate: new Date("2022-02-15T00:03:58.000Z"),
    installmentEndDate: new Date("2022-03-15T00:03:58.000Z"),
    agreementAttachments: [] as AgreementAttachment,
    status: AgreementStatus.Draft,
  });

  beforeEach(async () => {
    agreementServiceMock = jasmine.createSpyObj("AgreementService", ["saveAgreement"]);
    (agreementServiceMock.saveAgreement as jasmine.Spy).and.returnValue(of({}));

    alertServiceMock = jasmine.createSpyObj("AlertService", ["showAlert"]);
    alertServiceMock.showAlert as jasmine.Spy;

    await TestBed.configureTestingModule({
      declarations: [AddAgreementComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AgreementService, useValue: agreementServiceMock },
        { provide: AlertService, useValue: alertServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should route on cancel", () => {
    spyOn(component.router, "navigate");
    component.onCancel();
    expect(component.router.navigate).toHaveBeenCalledWith(["/agreements"]);
  });

  it("should save agreement information on form submit", () => {
    spyOn(component.router, "navigate");

    component.onAgreementDetailFormSet(agreementDetailsMock);
    component.onCustomerDetailFormSet(customerDetailsMock);
    component.onPaymentPlanDetailFormSet(paymentPlanDetailsMock);

    fixture.detectChanges();

    component.submitAgreementForm();

    expect(agreementServiceMock.saveAgreement).toHaveBeenCalled();
  });

  it("should show error alert on error from end point", () => {
    agreementServiceMock.saveAgreement.and.returnValue(throwError("Error"));

    spyOn(component.router, "navigate");

    component.onAgreementDetailFormSet(agreementDetailsMock);
    component.onCustomerDetailFormSet(customerDetailsMock);
    component.onPaymentPlanDetailFormSet(paymentPlanDetailsMock);

    fixture.detectChanges();

    component.submitAgreementForm();

    expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
      "Something went Wrong!!!",
      AlertTypes.danger
    );
  });
});
