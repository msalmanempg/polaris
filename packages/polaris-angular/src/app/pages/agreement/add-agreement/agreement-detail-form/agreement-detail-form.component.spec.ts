import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Unit } from "@app/interfaces";
import { UnitService } from "@app/services/unit/unit.service";
import { of } from "rxjs";
import { AgreementDetailFormComponent } from "./agreement-detail-form.component";
import { AgreementBookingComponent } from "./agreement-booking/agreement-booking.component";
import { CustomCurrencyPipe } from "@app/pipes";
import { PercentPipe } from "@angular/common";

describe("AgreementDetailFormComponent", () => {
  let component: AgreementDetailFormComponent;
  let fixture: ComponentFixture<AgreementDetailFormComponent>;
  let unitServiceMock: jasmine.SpyObj<UnitService>;
  const unitData: Unit = {
    unitNumber: "unit-123",
    location: "Block A, Street 5",
    type: "residential",
    bed: 3,
    basePrice: 5000000,
    publishedPrice: 5500000,
    netArea: 1250,
    grossArea: 1250,
    status: "available",
    projectId: 1,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Project: {
      name: "project",
    },
    completionDate: new Date("2021-02-19T05:20:07.269Z"),
  };

  beforeEach(async () => {
    unitServiceMock = jasmine.createSpyObj("UnitService", ["getUnitById"]);
    (unitServiceMock.getUnitById as jasmine.Spy).and.returnValue(of({ unitData }));

    await TestBed.configureTestingModule({
      declarations: [AgreementDetailFormComponent, AgreementBookingComponent, CustomCurrencyPipe],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        PercentPipe,
        { provide: UnitService, useValue: unitServiceMock },
        { provide: CustomCurrencyPipe, useClass: CustomCurrencyPipe },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should update possession value on unit select", () => {
    spyOn(component.agreementBooking, "setPossessionValue");

    component.agreementForm.get("unitId").setValue(1);
    expect(component.agreementBooking.setPossessionValue).toHaveBeenCalled();
  });
});
