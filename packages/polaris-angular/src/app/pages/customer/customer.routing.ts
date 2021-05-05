import { RouterModule, Routes } from "@angular/router";
import { SearchCustomerComponent } from "./search-customer.component";
import { AddCustomerComponent } from "./add-customer";
import { NgModule } from "@angular/core";
export const routes: Routes = [
  {
    path: "",
    component: SearchCustomerComponent,
    children: [
      {
        path: "add",
        component: AddCustomerComponent,
        data: {
          pageTitle: "Add Customer",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPageRoutingModule {}
