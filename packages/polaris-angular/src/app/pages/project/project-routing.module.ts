import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProjectComponent } from "./project.component";
import { AddProjectComponent } from "./add-project/add-project.component";
import { ListProjectComponent } from "./list-project/list-project.component";

const routes: Routes = [
  {
    path: "",
    component: ProjectComponent,
    children: [
      {
        path: "",
        component: ListProjectComponent,
      },
      {
        path: "add",
        component: AddProjectComponent,
      },
      {
        path: "edit/:projectId",
        component: AddProjectComponent,
      },
      {
        path: "view/:projectId",
        component: AddProjectComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
