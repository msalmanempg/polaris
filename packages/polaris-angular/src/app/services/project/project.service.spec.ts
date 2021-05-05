import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ProjectService } from "./project.service";
import { Project } from "@app/interfaces/project.interface";

describe("ProjectService", () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;
  let projectsMock: Project[];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
    projectsMock = [
      {
        address: "h$90",
        bankDetails: [
          {
            accountNumber: "343",
            accountTitle: "434",
            bankName: "e3",
            createdAt: "2021-03-08T08:04:47.634Z",
            iban: "343",
            swiftCode: "0932",
            branchAddress: "mm alam",
            branchCode: "00722",
            id: 3,
            projectId: 37,
            updatedAt: "2021-03-08T08:04:47.636Z",
          },
        ],
        city: "Catabola",
        completionDate: new Date("2021-03-11"),
        country: "Angola",
        createdAt: "2021-03-08",
        email: "angola@gmail.com",
        id: 37,
        latitude: 343,
        logo: "url",
        longitude: 343,
        name: "projname",
        phone: "903420",
        province: "Bié Province",
        updatedAt: "2021-03-08T08:04:47.635Z",
        url: "y@gmail.com",
      },
    ];
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch projects", () => {
    const expectedResult = {
      count: 1,
      pageSize: 20,
      pageOffset: 0,
      results: projectsMock,
    };
    service.all(0, 20).subscribe((response) => {
      expect(response).toEqual(expectedResult);
    });

    const requestHandler = httpMock.expectOne((request) => request.url.includes("/api/project"));
    expect(requestHandler.request.method).toBe("GET");
    requestHandler.flush(expectedResult);
    httpMock.verify();
  });

  it("should update project", () => {
    service.update(projectsMock[0].id, projectsMock[0]).subscribe((response) => {
      expect(response).toEqual(projectsMock[0]);
    });
    const requestHandler = httpMock.expectOne((request) =>
      request.url.includes(`/api/project/update/${projectsMock[0].id}`)
    );
    expect(requestHandler.request.method).toBe("PUT");
    requestHandler.flush(projectsMock[0]);
    httpMock.verify();
  });

  it("should fetch project", () => {
    service.getProjectById(37).subscribe((response) => {
      expect(response).toEqual(projectsMock[0]);
    });

    const requestHandler = httpMock.expectOne((request) =>
      request.url.includes(`/api/project/detail/${projectsMock[0].id}`)
    );
    expect(requestHandler.request.method).toBe("GET");
    requestHandler.flush(projectsMock[0]);
    httpMock.verify();
  });

  it("should add project", () => {
    service.add(projectsMock[0]).subscribe((response) => {
      expect(response).toEqual({});
    });
    const requestHandler = httpMock.expectOne((request) =>
      request.url.includes("/api/project/add")
    );
    expect(requestHandler.request.method).toBe("POST");
    requestHandler.flush({});
    httpMock.verify();
  });
});
