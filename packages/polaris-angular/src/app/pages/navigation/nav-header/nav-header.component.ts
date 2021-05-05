import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthService } from "@app/services";
import { Router } from "@angular/router";
@Component({
  selector: "app-nav-header",
  templateUrl: "./nav-header.component.html",
  styleUrls: ["./nav-header.component.scss"],
})
export class NavHeaderComponent implements OnInit {
  public userName = "";
  constructor(private authService: AuthService, public router: Router) {}

  ngOnInit(): void {}

  public logOut = () => {
    this.authService.clearToken();
    this.router.navigate(["login"]);
  };
}
