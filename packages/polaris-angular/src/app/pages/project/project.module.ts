import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedComponentModule } from "@app/shared/share.component.module";
import { WidgetsModule } from "@app/widgets";
import { MaterialModule } from "./../../material/material.module";
import { AddProjectComponent } from "./add-project/add-project.component";
import { BankDetailsFormComponent } from "./add-project/bank-details-form/bank-details-form.component";
import { ListProjectComponent } from "./list-project/list-project.component";
import { ProjectRoutingModule } from "./project-routing.module";
import { ProjectComponent } from "./project.component";
import { CUSTOM_DATE_FORMATS } from "@app/utils/constants";
import { CustomDateAdapter } from "@app/utils/customDateAdapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
@NgModule({
  declarations: [
    ProjectComponent,
    AddProjectComponent,
    ListProjectComponent,
    BankDetailsFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectRoutingModule,
    SharedComponentModule,
    MaterialModule,
    WidgetsModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
})
export class ProjectModule {}
