import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PercentPipe } from "@angular/common";
import { CustomCurrencyPipe } from "@app/pipes";
import { AgreementBookingComponent } from "./agreement-booking.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("AgreementBookingComponent", () => {
  let component: AgreementBookingComponent;
  let fixture: ComponentFixture<AgreementBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgreementBookingComponent, CustomCurrencyPipe],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [PercentPipe, { provide: CustomCurrencyPipe, useClass: CustomCurrencyPipe }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should format amount value ", () => {
    const controlName = "publishedPrice";

    component.agreementDetailForm.get(controlName).setValue("1200000");
    fixture.detectChanges();

    component.agreementDetailForm.get("bookingPrice").setValue("12000");
    fixture.detectChanges();

    component.formatAmountValue(controlName);
    fixture.detectChanges();

    expect(component.agreementDetailForm.controls.discountValue.value).toEqual(
      "PKR 1,188,000.00 (99.00%)"
    );
  });

  it("should format amount value on updating possession value ", () => {
    component.agreementDetailForm.get("publishedPrice").setValue("1200000");
    fixture.detectChanges();

    component.agreementDetailForm.get("bookingPrice").setValue("12000");
    fixture.detectChanges();

    component.agreementDetailForm.get("posessionValue").setValue("10000");
    fixture.detectChanges();

    component.formatAmountValue("posessionValue");
    fixture.detectChanges();

    expect(component.agreementDetailForm.controls.posessionValue.value).toEqual(
      "PKR 10,000.00 (83.33%)"
    );
  });

  it("should update minimum data for agreement date", () => {
    component.agreementDetailForm.get("bookingDate").setValue(new Date());
    fixture.detectChanges();
    component.onBookingDateChange();
    expect(component.minDate.getDate()).toBeGreaterThan(new Date().getDate());
  });
});
