import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelectProjectComponent } from "./project";
import { MaterialModule } from "./../material/material.module";
import { SharedComponentModule } from "../shared/share.component.module";
import { SelectProjectUnitComponent } from "./project/select-project-unit/select-project-unit.component";
const WIDGET_COMPONENTS = [SelectProjectComponent, SelectProjectUnitComponent];

@NgModule({
  imports: [CommonModule, SharedComponentModule, MaterialModule],
  exports: [...WIDGET_COMPONENTS],
  declarations: [...WIDGET_COMPONENTS],
})
export class WidgetsModule {}
