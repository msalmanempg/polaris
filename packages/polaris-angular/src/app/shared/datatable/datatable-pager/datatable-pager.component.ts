/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { PageInfo } from "@app/interfaces/datatable.interface";
@Component({
  selector: "app-datatable-pager",
  templateUrl: "./datatable-pager.component.html",
  styleUrls: ["./datatable-pager.component.scss"],
})
export class DatatablePagerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() length: number;
  @Input() pageSize: number;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions: number[] = [20, 50, 100, 150, 300];
  @Input() showFirstLastButtons = false;
  /**
   * Emits a page info object when the page is changed @see {@link PageInfo}.
   * Used for server side paging to ask the parent to fetch the new page.
   */
  @Output()
  pageChange: EventEmitter<PageInfo> = new EventEmitter();

  /**
   * Emits an event containing the new selected number from @see limitOptions.
   */
  @Output()
  limitChange: EventEmitter<number> = new EventEmitter<number>();

  public handlePageEvent(event: PageEvent) {
    if (this.pageIndex !== event.pageIndex) {
      const offset = event.pageIndex * event.pageSize;
      const pageInfo = {
        pageSize: event.pageSize,
        offset,
      } as PageInfo;
      this.pageChange.emit(pageInfo);
      this.pageIndex = event.pageIndex;
    }
    if (this.pageSize !== event.pageSize) {
      this.pageSize = event.pageSize;
      this.limitChange.emit(this.pageSize);
    }
  }
}
