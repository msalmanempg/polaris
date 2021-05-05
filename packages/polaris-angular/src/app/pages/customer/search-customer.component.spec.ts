import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { CustomerService } from "@app/services/customer/customer.service";
import { of, throwError } from "rxjs";
import { SearchCustomerComponent } from "./search-customer.component";
class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true),
    };
  }

  closeAll() {}
}

describe("SearchCustomerComponent", () => {
  let component: SearchCustomerComponent;
  let fixture: ComponentFixture<SearchCustomerComponent>;
  let customerService: CustomerService;

  const customersData: any[] = [
    {
      id: 1,
      govtId: "23145-893053893-9",
      fullName: "fake",
      agreementsCount: 0,
      totalAmount: 0,
      paidAmount: 0,
      outstandingAmount: 0,
    },
  ];

  beforeEach(async () => {
    customerService = jasmine.createSpyObj("CustomerService", ["getCustomers", "deleteCustomer"]);
    (customerService.getCustomers as jasmine.Spy).and.returnValue(of(customersData));

    await TestBed.configureTestingModule({
      declarations: [SearchCustomerComponent],
      providers: [
        FormBuilder,
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: CustomerService, useValue: customerService },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should populate datatable for customers ", () => {
    component.fetchCustomers();
    expect(component.customers).toBeTruthy();
    expect(component.customers).toEqual(customersData);
  });

  it("should open edit dialog", () => {
    spyOn(component.dialog, "open").and.callThrough();
    component.onUpdateCustomer(customersData[0]);
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it("should delete customer", () => {
    (customerService.deleteCustomer as jasmine.Spy).and.returnValue(of({}));
    component.onDelete(customersData[0]);
    expect(customerService.deleteCustomer).toHaveBeenCalled();
  });

  it("should throw error while deleting customer", () => {
    (customerService.deleteCustomer as jasmine.Spy).and.returnValue(throwError("error"));
    component.onDelete(customersData[0]);
    expect(customerService.deleteCustomer).toHaveBeenCalled();
    expect(component.errorMessage).toEqual("Something went wrong while deleting customer");
  });

  it("should throw error while fetching customer", () => {
    (customerService.getCustomers as jasmine.Spy).and.returnValue(throwError("error"));
    component.fetchCustomers();
    expect(customerService.getCustomers).toHaveBeenCalled();
    expect(component.errorMessage).toEqual("Something went wrong while loading customer");
  });
});
