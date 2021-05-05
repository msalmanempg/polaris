import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIcon } from "@angular/material/icon";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { RouterTestingModule } from "@angular/router/testing";
import { AgreementDTO, PaginatedAgreement } from "@app/interfaces";
import { AgreementService } from "@app/services/agreement/agreement.service";
import { AgreementStatus } from "@app/types/agreement.type";
import { of, throwError } from "rxjs";
import { AgreementsDatatableComponentMock } from "./agreements-datatable/agreements-datatable.component.mock";
import { ListAgreementComponent } from "./list-agreement.component";

describe("ListAgreementComponent", () => {
  let component: ListAgreementComponent;
  let fixture: ComponentFixture<ListAgreementComponent>;
  let agreementServiceMock: jasmine.SpyObj<AgreementService>;

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
    agreementServiceMock = jasmine.createSpyObj("AgreementService", ["getAllAgreements"]);
    (agreementServiceMock.getAllAgreements as jasmine.Spy).and.returnValue(
      of(({
        agreements: agreementDTOs,
        count: agreementDTOs.length,
        pageSize: 20,
        pageOffset: 0,
      } as unknown) as PaginatedAgreement)
    );

    await TestBed.configureTestingModule({
      declarations: [ListAgreementComponent, AgreementsDatatableComponentMock],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AgreementService, useValue: agreementServiceMock },
        { provide: MatIcon, useValue: jasmine.createSpy("MatIcon") },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get agreements on init", () => {
    component.ngOnInit();

    expect(component.agreements).toEqual(agreementDTOs);
    expect(component.count).toEqual(agreementDTOs.length);
  });

  it("should throw error while getting agreements", () => {
    (agreementServiceMock.getAllAgreements as jasmine.Spy).and.returnValue(throwError("error"));

    component.agreements = [];
    component.ngOnInit();

    expect(agreementServiceMock.getAllAgreements).toHaveBeenCalled();
    expect(component.agreements).toEqual([]);
  });

  it("should update page size and page offset on page change", () => {
    const pageSize = 50;
    const offset = 20;

    component.onPageOffsetChange({ offset, pageSize });

    expect(agreementServiceMock.getAllAgreements).toHaveBeenCalled();
    expect(agreementServiceMock.getAllAgreements).toHaveBeenCalledWith(
      offset,
      pageSize,
      null,
      null,
      null,
      null,
      true
    );
    expect(component.pageSize).toEqual(pageSize);
    expect(component.pageOffset).toEqual(offset);
  });

  it("should update page size on page size change", () => {
    const pageSize = 10;

    component.onPageSizeChange(pageSize);

    expect(agreementServiceMock.getAllAgreements).toHaveBeenCalled();
    expect(agreementServiceMock.getAllAgreements).toHaveBeenCalledWith(
      0,
      pageSize,
      null,
      null,
      null,
      null,
      true
    );
    expect(component.pageSize).toEqual(pageSize);
    expect(component.pageOffset).toEqual(0);
  });

  it("should route to add agreement page", () => {
    spyOn(component.router, "navigate");
    component.onClickAddAgreementButton();
    expect(component.router.navigate).toHaveBeenCalledWith(["/agreements/add"]);
  });

  it("should get agreements on filter change", () => {
    component.onFilterChange();

    expect(agreementServiceMock.getAllAgreements).toHaveBeenCalled();
  });

  it("should get units on status change", () => {
    const changeEvent = {
      index: 0,
    } as MatTabChangeEvent;

    component.onClickStatusTab(changeEvent);

    expect(component.status).toEqual("draft");
    expect(agreementServiceMock.getAllAgreements).toHaveBeenCalled();
  });

  it("should reset pagination", () => {
    component.pageOffset = 50;
    component.pageSize = 50;

    component.resetPagination();

    expect(component.pageOffset).toEqual(0);
    expect(component.pageSize).toEqual(20);
  });

  it("should have null status on all tab", () => {
    const changeEvent = {
      index: 4,
    } as MatTabChangeEvent;

    component.onClickStatusTab(changeEvent);

    expect(component.status).toEqual(null);
    expect(agreementServiceMock.getAllAgreements).toHaveBeenCalled();
  });
});
