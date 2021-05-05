import { RouterModule, Routes } from "@angular/router";
import { AuthenticationComponent } from "./authentication.component";
import { LoginComponent } from "./login";
import { NgModule } from "@angular/core";
export const routes: Routes = [
  {
    path: "",
    component: AuthenticationComponent,
    children: [
      {
        path: "",
        component: LoginComponent,
        data: {
          pageTitle: "Login",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
