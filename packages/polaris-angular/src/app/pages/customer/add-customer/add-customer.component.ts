import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Customer } from "@app/interfaces";
import { CustomerService } from "@app/services";
import { createManagedRxSubscriptions } from "@app/utils/rx-subscription-manager";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.scss"],
})
export class AddCustomerComponent implements OnInit, OnDestroy {
  public addCustomerForm: FormGroup;
  public subscriptions = createManagedRxSubscriptions({
    getCustomers: null,
    updateCustomer: null,
  });
  public errorMessage = "This field is mandatory.";
  private emailRegex = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  private cnicRegex = "^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$";

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    public dialogRef: MatDialogRef<AddCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Customer
  ) {}

  ngOnInit(): void {
    this.addCustomerForm = this.formBuilder.group({
      fullName: [null, Validators.required],
      cnic: [null, [Validators.required.bind(this), Validators.pattern(this.cnicRegex)]],
      email: [
        null,
        [Validators.required.bind(this), Validators.email, Validators.pattern(this.emailRegex)],
      ],
      cellNumber: [null, Validators.required],
      currentAddress: [null, Validators.required],
    });
    this.setEditForm();
  }

  setEditForm() {
    if (this.data) {
      this.addCustomerForm.setValue({
        fullName: this.data.fullName,
        cnic: this.data.govtId,
        email: this.data.email,
        cellNumber: this.data.primaryContactNumber,
        currentAddress: this.data.address,
      });
    }
  }

  submit() {
    if (!this.addCustomerForm.valid) {
      return;
    }
    const formValues: Record<string, any> = this.addCustomerForm.value;

    const { fullName, cnic, email, cellNumber, currentAddress, balance } = formValues;

    const customerData: Customer = {
      fullName,
      govtId: cnic,
      email,
      primaryContactNumber: cellNumber,
      address: currentAddress,
    };

    if (this.data) {
      this.subscriptions.updateCustomer.manage(
        this.customerService.updateCustomer(this.data.id, customerData).subscribe(
          () => this.dialogRef.close(true),
          (error) => {
            const { errors } = error.error;
          }
        )
      );
    } else {
      this.subscriptions.getCustomers.manage(
        this.customerService.createCustomer(customerData).subscribe(
          () => this.dialogRef.close(true),
          (error) => {
            const { errors } = error.error;
          }
        )
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.disposeAll();
  }
}
