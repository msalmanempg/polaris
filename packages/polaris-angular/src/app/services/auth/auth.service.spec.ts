import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { of } from "rxjs";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get token", () => {
    service.generateAuthToken("xyz", "123").subscribe((response) => {
      expect(response).toEqual({});
    });
    const requestHandler = httpMock.expectOne((request) => request.url.includes("/api/auth/login"));
    expect(requestHandler.request.method).toBe("POST");
    requestHandler.flush({});
    httpMock.verify();
  });
});
