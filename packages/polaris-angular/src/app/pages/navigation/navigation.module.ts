import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationComponent } from "./navigation.component";
import { NavHeaderComponent } from "./nav-header/nav-header.component";
import { NavSideListComponent } from "./nav-side-list/nav-side-list.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../material/material.module";
import { RouterModule } from "@angular/router";
import { MenuListItemComponent } from "./nav-side-list/menu-list-item/menu-list-item.component";

@NgModule({
  declarations: [
    NavigationComponent,
    NavHeaderComponent,
    NavSideListComponent,
    MenuListItemComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, RouterModule],
})
export class NavigationModule {}
