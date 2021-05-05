import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Unit } from "@app/interfaces/unit.interface";
import { UnitService } from "./unit.service";

describe("UnitService", () => {
  let service: UnitService;
  let httpMock: HttpTestingController;
  const unitMock: Unit = {
    id: 1,
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
      name: "Zameel Opal",
    },
    completionDate: new Date("2021-02-19T05:20:07.269Z"),
    createdAt: new Date("2021-02-19T05:20:07.269Z"),
    updatedAt: new Date("2021-02-19T05:20:07.269Z"),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UnitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch units", () => {
    const expectedResult = {
      count: 0,
      pageSize: 20,
      pageOffset: 0,
      results: [] as Unit[],
    };
    service
      .getAllUnits({ pageOffset: 0, pageSize: 20, projectId: 1, status: null, includeStats: true })
      .subscribe((response) => {
        expect(response).toEqual(expectedResult);
      });

    const requestHandler = httpMock.expectOne((request) => request.url.includes("/api/unit"));
    expect(requestHandler.request.method).toBe("GET");
    requestHandler.flush(expectedResult);
    httpMock.verify();
  });

  it("should create unit", () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const mockFile = new File([""], "Zameen Opal - SMS Plan Site Event.xlsx", { type: fileType });
    service.saveUnits({ projectId: 1, file: mockFile }).subscribe((response) => {
      expect(response).toEqual({});
    });
    const requestHandler = httpMock.expectOne((request) =>
      request.url.includes("/api/unit/import/")
    );
    expect(requestHandler.request.method).toBe("POST");
    requestHandler.flush({});
    httpMock.verify();
  });

  it("should export unit", () => {
    const projectId = 1;
    const expectedResponse =
      "https://polaris-public.s3.amazonaws.com/41ebdce59f15aaddcca6cf4f692a41a6.xlsx";
    service.exportUnits(1).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const requestHandler = httpMock.expectOne((request) =>
      request.url.includes(`/api/unit/export/${projectId}`)
    );
    expect(requestHandler.request.method).toBe("GET");
    requestHandler.flush(expectedResponse);
    httpMock.verify();
  });

  it("should fetch unit by id", () => {
    service.getUnitById(1).subscribe((response) => {
      expect(response).toEqual(unitMock);
    });

    const requestHandler = httpMock.expectOne((request) =>
      request.url.includes(`/api/unit/detail/${unitMock.id}`)
    );
    expect(requestHandler.request.method).toBe("GET");
    requestHandler.flush(unitMock);
    httpMock.verify();
  });
});
