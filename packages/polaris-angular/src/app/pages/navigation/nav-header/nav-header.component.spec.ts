import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { NavHeaderComponent } from "./nav-header.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { MatMenuModule } from "@angular/material/menu";
import { AuthService } from "@app/services";

describe("NavHeaderComponent", () => {
  let component: NavHeaderComponent;
  let fixture: ComponentFixture<NavHeaderComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj("AuthService", ["clearToken"]);
    await TestBed.configureTestingModule({
      declarations: [NavHeaderComponent],
      providers: [
        FormBuilder,
        { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService,
        { provide: AuthService, useValue: authServiceMock },
      ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), MatMenuModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should logout the user", () => {
    spyOn(component.router, "navigate");
    component.logOut();
    expect(authServiceMock.clearToken).toHaveBeenCalled();
  });
});
