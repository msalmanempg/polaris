import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import {
  AgreementDTO,
  AgreementAttachment,
  SalePerson,
  AgreementFormDetail,
  AgreementStatusAll,
} from "@app/interfaces/agreement.interface";
import { AgreementStatus } from "@app/types/agreement.type";
import { Customer, Nominee } from "@app/interfaces/customer.interface";
import { AgreementService } from "./agreement.service";

describe("UnitService", () => {
  let service: AgreementService;
  let httpMock: HttpTestingController;
  const agreementMock: AgreementFormDetail = {
    leadId: 1,
    agreementNumber: "PWD6478",
    status: AgreementStatus.Draft,
    unitId: 1,
    publishedPrice: "120000",
    bookingPrice: 100000,
    discountValue: 20000,
    bookingDate: "2021-03-08T08:04:47.634Z",
    posessionValue: 20000,
    notarisedDate: "2021-03-08T08:04:47.634Z",
    agreementDate: "2021-03-08T08:04:47.634Z",
    installmentStartDate: new Date("2021-03-08T08:04:47.634Z"),
    installmentEndDate: new Date("2021-03-08T08:04:47.634Z"),
    agreementAttachments: [] as AgreementAttachment[],
    salePersons: [] as SalePerson[],
    customers: [] as Customer[],
    nominees: [] as Nominee[],
    company: {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AgreementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get all agreements", () => {
    const expectedResult = {
      count: 0,
      pageSize: 20,
      pageOffset: 0,
      agreements: [] as AgreementDTO[],
    };

    service.getAllAgreements(0, 20, 1, 1, "00000-0000000-0", "all", true).subscribe((response) => {
      expect(response).toEqual(expectedResult);
    });

    const requestHandler = httpMock.expectOne((request) => request.url.includes("/api/agreement"));
    expect(requestHandler.request.method).toBe("GET");
    requestHandler.flush(expectedResult);
    httpMock.verify();
  });

  it("should create agreement", () => {
    service.saveAgreement(agreementMock).subscribe((response) => {
      expect(response).toEqual({});
    });
    const requestHandler = httpMock.expectOne((request) =>
      request.url.includes("/api/agreement/add")
    );
    expect(requestHandler.request.method).toBe("POST");
    requestHandler.flush({});
    httpMock.verify();
  });
});
