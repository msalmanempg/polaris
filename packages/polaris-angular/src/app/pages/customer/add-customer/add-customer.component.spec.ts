import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { AddCustomerComponent } from "./add-customer.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Customer } from "@app/interfaces";

describe("AddCustomerComponent", () => {
  let component: AddCustomerComponent;
  let fixture: ComponentFixture<AddCustomerComponent>;
  let data: Customer;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCustomerComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: jasmine.createSpy("MatDialog") },
        { provide: MatDialogRef, useValue: jasmine.createSpy("MatDialogRef") },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
