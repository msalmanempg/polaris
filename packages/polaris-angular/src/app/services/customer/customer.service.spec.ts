import { TestBed } from "@angular/core/testing";
import { Customer } from "@app/interfaces/customer.interface";
import { CustomerService } from "./customer.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe("CustomerService", () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;
  let customersMock: Customer[];
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
    customersMock = [
      {
        id: 1,
        email: "fake@gmail.com",
        govtId: "23145-893053893-9",
        fullName: "fake",
        primaryContactNumber: "564565",
        address: "cali",
      },
    ];
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should fetch customers", () => {
    service.getCustomers(20, 0).subscribe((response) => {
      expect(response).toEqual(customersMock);
    });
    const requestHandler = httpMock.expectOne((request) => request.url.includes("/api/customer"));
    expect(requestHandler.request.method).toBe("GET");
    requestHandler.flush(customersMock);
    httpMock.verify();
  });

  it("should update customer", () => {
    service.updateCustomer(customersMock[0].id, customersMock[0]).subscribe((response) => {
      expect(response).toEqual(customersMock[0]);
    });
    const requestHandler = httpMock.expectOne((request) =>
      request.url.includes(`/api/customer/update/${customersMock[0].id}`)
    );
    expect(requestHandler.request.method).toBe("PUT");
    requestHandler.flush(customersMock[0]);
    httpMock.verify();
  });
});
