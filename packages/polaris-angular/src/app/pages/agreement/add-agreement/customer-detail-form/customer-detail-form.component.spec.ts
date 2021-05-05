import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomerDetailFormComponent } from "./customer-detail-form.component";

describe("CustomerDetailFormComponent", () => {
  let component: CustomerDetailFormComponent;
  let fixture: ComponentFixture<CustomerDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerDetailFormComponent],
      imports: [FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call show joint customer form", () => {
    component.showJointCustomerForm(true);
    fixture.detectChanges();
    expect(component.joinCustomerForms.controls.length).toBeGreaterThan(0);
  });
});
