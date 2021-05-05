import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { NavigationItem } from "@app/interfaces/navigation.interface";
import { Router } from "@angular/router";

@Component({
  selector: "app-menu-list-item",
  templateUrl: "./menu-list-item.component.html",
  styleUrls: ["./menu-list-item.component.scss"],
})
export class MenuListItemComponent implements OnInit {
  @Input() item: NavigationItem;
  @Input() depth: number;
  expanded = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  onItemSelected(item: NavigationItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }
}
