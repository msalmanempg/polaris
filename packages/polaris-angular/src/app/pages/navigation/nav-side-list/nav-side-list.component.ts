import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { navigationItems } from "@app/utils/navigation-items";
@Component({
  selector: "app-nav-side-list",
  templateUrl: "./nav-side-list.component.html",
  styleUrls: ["./nav-side-list.component.scss"],
})
export class NavSideListComponent implements OnInit {
  navItems = navigationItems;
  constructor() {}
  ngOnInit() {}
}
