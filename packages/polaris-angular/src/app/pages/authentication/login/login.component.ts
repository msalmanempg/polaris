import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "@app/services";
import { AuthTokenResponse } from "@app/interfaces";
import { format } from "date-fns";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  datefnsYearOnlyNumber = "yyyy";
  public currentYear: string = format(new Date(), this.datefnsYearOnlyNumber);
  public loginForm: FormGroup;
  public hide = true;
  public errors = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  public onForgottenPassword(): void {}

  public login(): void {
    this.errors = "";
    if (this.loginForm.invalid) {
      return;
    }
    const formValues: Record<string, any> = this.loginForm.value;
    this.authService.generateAuthToken(formValues.email, formValues.password).subscribe(
      (response) => {
        if (response.access_token) {
          const tokenReponse: AuthTokenResponse = {
            accessToken: response.access_token,
            expiresIn: response.expires_in,
            "not-before-policy": response["not-before-policy"],
            refreshToken: response.refresh_token,
            refreshExpiresIn: response.refresh_expires_in,
            tokenType: response.token_type,
            scope: response.scope,
            sessionState: response.session_state,
          };
          this.authService.setToken(tokenReponse);
          this.router.navigate(["customers"]);
        }
      },
      (errorResponse) => {
        this.errors = "Error: Invalid Credentials";
      }
    );
  }
}
