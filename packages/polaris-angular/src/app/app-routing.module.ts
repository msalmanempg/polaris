import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { NavigationComponent } from "@app/pages";

const routes: Routes = [
  {
    path: "login",
    loadChildren: () =>
      import("./pages/authentication/authentication.module").then(
        (module) => module.AuthenticationModule
      ),
  },
  {
    path: "",
    component: NavigationComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "customers",
        loadChildren: () =>
          import("./pages/customer/customer.module").then((m) => m.CustomerModule),
      },
      {
        path: "projects",
        loadChildren: () => import("./pages/project/project.module").then((m) => m.ProjectModule),
      },
      {
        path: "units",
        loadChildren: () => import("./pages/unit/unit.module").then((m) => m.UnitModule),
      },
      {
        path: "agreements",
        loadChildren: () =>
          import("./pages/agreement/agreement.module").then((m) => m.AgreementModule),
      },

      {
        path: "settings",
        loadChildren: () => import("./pages/setting/setting.module").then((m) => m.SettingModule),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "settings",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
