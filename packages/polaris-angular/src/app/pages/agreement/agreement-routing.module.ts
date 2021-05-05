import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AgreementComponent } from "./agreement.component";
import { ListAgreementComponent } from "./list-agreement/list-agreement.component";
import { AddAgreementComponent } from "./add-agreement/add-agreement.component";

const routes: Routes = [
  {
    path: "",
    component: AgreementComponent,
    children: [
      {
        path: "",
        component: ListAgreementComponent,
      },
      {
        path: "add",
        component: AddAgreementComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementRoutingModule {}
