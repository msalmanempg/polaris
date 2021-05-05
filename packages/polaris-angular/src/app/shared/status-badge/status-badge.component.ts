import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-status-badge",
  templateUrl: "./status-badge.component.html",
  styleUrls: ["./status-badge.component.scss"],
})
export class StatusBadgeComponent implements OnInit {
  @Input() type: string;

  @Input() text: string;

  constructor() {}

  ngOnInit(): void {}
}
