import { DatatableComponent } from "./datatable/datatable.component";
import { DatatablePagerComponent } from "./datatable/datatable-pager/datatable-pager.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../material/material.module";
import { RouterModule } from "@angular/router";
import { DropdownComponent } from "./dropdown/dropdown.component";
import { StatusBadgeComponent } from "./status-badge/status-badge.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { MulticellInputComponent } from "./multicell-input/multicell-input.component";

@NgModule({
  declarations: [
    DatatableComponent,
    DatatablePagerComponent,
    DropdownComponent,
    StatusBadgeComponent,
    FileUploadComponent,
    MulticellInputComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, RouterModule],
  exports: [
    DatatableComponent,
    DatatablePagerComponent,
    DropdownComponent,
    StatusBadgeComponent,
    FileUploadComponent,
    MulticellInputComponent,
    CommonModule,
    FormsModule,
  ],
  entryComponents: [DatatableComponent],
})
export class SharedComponentModule {}
