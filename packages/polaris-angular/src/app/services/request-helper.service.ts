import { Injectable } from "@angular/core";
import { Inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class RequestHelperService {
  constructor(@Inject(Window) private window: Window) {}

  public getCurrentLocationUrl() {
    return `${window.location.protocol}//${window.location.host}`;
  }
}
