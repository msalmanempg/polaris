import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthenticationComponent } from "./authentication.component";
import { LoginComponent } from "./login";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../material/material.module";
import { LoginPageRoutingModule } from "./authentication.routing";
import { AuthService } from "@app/services/auth/auth.service";
@NgModule({
  declarations: [AuthenticationComponent, LoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, LoginPageRoutingModule],
  providers: [AuthService],
})
export class AuthenticationModule {}
