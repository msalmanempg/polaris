import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { LoginComponent } from "./login.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { AuthService } from "@app/services";
import { of, throwError, Observable } from "rxjs";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj("AuthService", ["generateAuthToken"]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
        { provide: AuthService, useValue: authServiceMock },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call generate token of authservice", async () => {
    const response = {
      accessToken: "abc",
      expiresIn: 5000,
      "not-before-policy": 0,
      refreshToken: "ag",
      refreshExpiresIn: "dacf",
      tokenType: "Bearer",
      scope: "profile email",
      sessionState: "xyz",
    };
    authServiceMock.generateAuthToken.and.returnValue(of(response));
    component.loginForm.controls.email.setValue("test@test.com");
    component.loginForm.controls.password.setValue("test123");

    fixture.detectChanges();
    component.login();
    await fixture.whenStable();

    expect(authServiceMock.generateAuthToken).toHaveBeenCalled();
  });

  it("should call generate token of authservice", async () => {
    authServiceMock.generateAuthToken.and.returnValue(of());
    fixture.detectChanges();
    component.login();
    await fixture.whenStable();

    expect(authServiceMock.generateAuthToken).not.toHaveBeenCalled();
  });

  it("should give error on the login method of authservice", async () => {
    authServiceMock.generateAuthToken.and.returnValue(throwError({ status: 400 }));
    component.loginForm.controls.email.setValue("test@test.com");
    component.loginForm.controls.password.setValue("test123");

    fixture.detectChanges();
    component.login();

    expect(authServiceMock.generateAuthToken).toHaveBeenCalledWith("test@test.com", "test123");
    expect(component.errors).toEqual("Error: Invalid Credentials");
  });
});
