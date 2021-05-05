import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { AuthService } from "@app/services";
import { Observable } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = this.injector.get(AuthService);
    const token = authService.getToken();
    let clonedAuthRequest;

    if (token) {
      clonedAuthRequest = request.clone({
        setHeaders: {
          authorization: `Bearer ${token.accessToken}`,
        },
      });
    }

    return clonedAuthRequest ? next.handle(clonedAuthRequest) : next.handle(request);
  }
}
