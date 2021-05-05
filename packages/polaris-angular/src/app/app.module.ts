import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "@app/gaurds";
import { AuthenticationModule } from "@app/pages/authentication/authentication.module";
import { NavigationModule } from "@app/pages/navigation";
import { ProjectModule } from "@app/pages/project/project.module";
import { JwtHelperService, JWT_OPTIONS } from "@auth0/angular-jwt";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { MaterialModule } from "./material/material.module";
import { NgxMaskModule, IConfig } from "ngx-mask";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AuthenticationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    NavigationModule,
    ProjectModule,
    RouterModule,
  ],
  providers: [
    HttpClient,
    AuthGuard,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: Window, useValue: window },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
