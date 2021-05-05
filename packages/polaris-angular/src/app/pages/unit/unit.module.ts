import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MaterialModule } from "@app/material/material.module";
import { SharedComponentModule } from "@app/shared/share.component.module";
import { WidgetsModule } from "@app/widgets";
import { ProjectModule } from "../project/project.module";
import { ImportUpdateUnitDialogComponent } from "./import-update-unit-dialog/import-update-unit-dialog.component";
import { UnitRoutingModule } from "./unit-routing.module";
import { UnitComponent } from "./unit.component";
import { UnitsDatatableComponent } from "./units-datatable/units-datatable.component";
import { UnitsImportSuccessComponent } from "./units-import-success/units-import-success.component";
import { UnitDetailsDialogComponent } from "./unit-details-dialog/unit-details-dialog.component";

@NgModule({
  declarations: [
    UnitComponent,
    UnitsDatatableComponent,
    ImportUpdateUnitDialogComponent,
    UnitsImportSuccessComponent,
    UnitDetailsDialogComponent,
  ],
  imports: [
    CommonModule,
    UnitRoutingModule,
    ProjectModule,
    SharedComponentModule,
    MaterialModule,
    WidgetsModule,
  ],
})
export class UnitModule {}
