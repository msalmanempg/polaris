import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Column, Customer, PageInfo } from "@app/interfaces";
import { CustomerService } from "@app/services";
import { ColumnAlign, ColumnType } from "@app/types/datatable-columnType";
import { createManagedRxSubscriptions } from "@app/utils/rx-subscription-manager";
import { AddCustomerComponent } from "./add-customer";

@Component({
  selector: "app-search-customer",
  templateUrl: "./search-customer.component.html",
  styleUrls: ["./search-customer.component.scss"],
})
export class SearchCustomerComponent implements OnInit, OnDestroy {
  public pageOffset = 0;
  public pageLimit = 20;
  public customers: any[] = [];
  public columns: Column[];
  public errorMessage = "";
  public subscriptions = createManagedRxSubscriptions({
    getCustomers: null,
    updateCustomerDialogClosed: null,
    deleteCustomer: null,
  });

  constructor(private customerService: CustomerService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.columns = this.getColumnConfiguration();
    this.fetchCustomers();
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
    this.subscriptions.disposeAll();
  }

  onUpdateCustomer(customer: Customer): void {
    const dialogRef = this.dialog.open(AddCustomerComponent, {
      panelClass: "pf-custom-dialog",
      data: customer,
    });
    this.subscriptions.updateCustomerDialogClosed.manage(
      dialogRef.afterClosed().subscribe((isCustomerUpdated) => {
        if (isCustomerUpdated) {
          this.fetchCustomers();
        }
      })
    );
  }

  fetchCustomers(): void {
    this.subscriptions.getCustomers.manage(
      this.customerService.getCustomers(this.pageLimit, this.pageOffset).subscribe(
        (response: Customer[]) => {
          this.customers = response.map((customer) => ({
            ...customer,
            agreementsCount: 0,
            totalAmount: 0,
            paidAmount: 0,
            outstandingAmount: 0,
          }));
        },
        () => {
          this.errorMessage = "Something went wrong while loading customer";
        }
      )
    );
  }

  public onDelete(customer: Customer): void {
    this.subscriptions.deleteCustomer.manage(
      this.customerService.deleteCustomer(customer.id).subscribe(
        (response) => {
          this.fetchCustomers();
        },
        () => {
          this.errorMessage = "Something went wrong while deleting customer";
        }
      )
    );
  }

  public get totalCount(): number {
    return this.customers ? this.customers.length : 0;
  }

  public onPageChange(pageInfo: PageInfo): void {}

  public onLimitChange(newLimit: number): void {}

  public getColumnConfiguration(): Column[] {
    return [
      {
        key: "fullName",
        value: "NAME",
        columnType: ColumnType.TEXT,
      },
      {
        key: "govtId",
        value: "GOVERNMENT ID",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "agreementsCount",
        value: "AGREEMENTS",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "totalAmount",
        value: "TOTAL AMOUNT",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "paidAmount",
        value: "PAID AMOUNT",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "outstandingAmount",
        value: "OUTSTANDING AMOUNT",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
    ];
  }
}
