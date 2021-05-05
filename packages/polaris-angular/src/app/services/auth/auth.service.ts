import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthTokenResponse } from "@app/interfaces";
import { Observable } from "rxjs";
import { JwtHelperService } from "@auth0/angular-jwt/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  generateAuthToken(userName: string, password: string): Observable<any> {
    return this.http.post("/api/auth/login", { login: userName, password });
  }

  public getToken(): AuthTokenResponse {
    return JSON.parse(localStorage.getItem("token"));
  }

  public setToken(token: AuthTokenResponse): void {
    localStorage.setItem("token", JSON.stringify(token));
  }

  public clearToken(): void {
    localStorage.clear();
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!(token && this.jwtHelper.isTokenExpired(token.accessToken) === false);
  }
}
