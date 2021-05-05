import { TitleCasePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AgreementDTO } from "@app/interfaces";
import { AgreementRow, AgreementsDatatableComponent } from "./agreements-datatable.component";
import { AgreementStatus } from "@app/types/agreement.type";

describe("AgreementsDatatableComponent", () => {
  let component: AgreementsDatatableComponent;
  let fixture: ComponentFixture<AgreementsDatatableComponent>;

  const agreementDTOs: AgreementDTO[] = [
    {
      id: 1,
      agreementNumber: "AG-01",
      agreementDate: "2021-02-19T05:20:07.269Z",
      paymentPercentage: 10,
      noticesCount: 2,
      overduePayments: 3,
      status: AgreementStatus.Active,
      unit: {
        id: 1,
        unitNumber: "UNIT-01",
        project: {
          id: 1,
          name: "Project 1",
        },
      },
      customer: {
        id: 1,
        name: "Customer 1",
      },
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgreementsDatatableComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [TitleCasePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementsDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get column configuration", () => {
    const columns = component.getColumnConfiguration();

    expect(columns).toBeTruthy();
    expect(columns).toEqual(jasmine.any(Array));
  });

  it("should get mapped agreement rows", () => {
    const agreementRows: AgreementRow[] = [
      {
        id: 1,
        agreementNumber: "AG-01",
        customerName: "Customer 1",
        projectId: 1,
        projectName: "Project 1",
        agreementDate: "19, Feb 2021",
        unitNumber: "UNIT-01",
        paymentPercentage: "10%",
        noticesCount: 2,
        overduePayments: 3,
        status: "Active",
      },
    ];

    component.agreements = agreementDTOs;

    expect(component.rows).toEqual(agreementRows);
  });

  it("should route to edit agreement page", () => {
    const agreementId = 1;

    spyOn(component.router, "navigate");

    component.onClickEditAgreement(agreementId);

    expect(component.router.navigate).toHaveBeenCalledWith([`agreements/edit/${agreementId}`]);
  });
});
