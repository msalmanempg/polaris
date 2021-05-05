import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchCustomerComponent } from "./search-customer.component";
import { AddCustomerComponent } from "./add-customer/add-customer.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../material/material.module";
import { SharedComponentModule } from "@app/shared/share.component.module";
import { RouterModule } from "@angular/router";
import { CustomerPageRoutingModule } from "./customer.routing";

@NgModule({
  declarations: [SearchCustomerComponent, AddCustomerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    CustomerPageRoutingModule,
    SharedComponentModule,
  ],
})
export class CustomerModule {}
