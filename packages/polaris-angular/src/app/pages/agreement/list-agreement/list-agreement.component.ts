import { Component, OnInit } from "@angular/core";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router } from "@angular/router";
import {
  AgreementDTO,
  AgreementStatusAll,
  AgreementStatusCount,
  PaginatedAgreement,
} from "@app/interfaces";
import { AgreementService } from "@app/services/agreement/agreement.service";
import { AgreementStatus } from "@app/types/agreement.type";
import { createManagedRxSubscriptions } from "@app/utils";

interface StatusTab {
  key: AgreementStatusAll;
  name: string;
  count: number;
}

@Component({
  selector: "app-list-agreement",
  templateUrl: "./list-agreement.component.html",
  styleUrls: ["./list-agreement.component.scss"],
})
export class ListAgreementComponent implements OnInit {
  public agreements: AgreementDTO[] = [];

  public pageSize = 20;

  public pageOffset = 0;

  public count = 0;

  public includeStats = true;

  public selectedProjectId: number | null = null;

  public selectedUnitId: number | null = null;

  public customerGovtId: string | null = null;

  public status: AgreementStatusAll | null = null;

  public statusTabs: StatusTab[] = [
    { key: AgreementStatus.Draft, name: "Draft", count: 0 },
    { key: AgreementStatus.Active, name: "Active", count: 0 },
    { key: AgreementStatus.Transferred, name: "Transferred", count: 0 },
    { key: AgreementStatus.Terminated, name: "Terminated", count: 0 },
    { key: "all", name: "All", count: 0 },
  ];

  public selectedstatusTabIndex: number = this.statusTabs.findIndex(
    (statusTab: StatusTab) => statusTab.key === "all"
  );

  public subscriptions = createManagedRxSubscriptions({
    getAllAgreements: null,
  });

  constructor(public agreementService: AgreementService, public router: Router) {}

  ngOnInit(): void {
    this.getAllAgreements();
  }

  getAllAgreements(): void {
    this.subscriptions.getAllAgreements.manage(
      this.agreementService
        .getAllAgreements(
          this.pageOffset,
          this.pageSize,
          this.selectedProjectId,
          this.selectedUnitId,
          this.customerGovtId,
          this.status,
          this.includeStats
        )
        .subscribe(
          (response: PaginatedAgreement | AgreementDTO[]) => {
            const agreementsResponse = response as PaginatedAgreement;
            this.agreements = agreementsResponse.agreements;
            this.count = agreementsResponse.count;
            this.statusTabs.map((statusTab) => {
              const agreementStatusCount: AgreementStatusCount =
                agreementsResponse.stats &&
                agreementsResponse.stats.find(
                  (agreementStat: AgreementStatusCount) => agreementStat.status === statusTab.key
                );
              statusTab.count = agreementStatusCount?.count || 0;
            });
          },
          (error: any) => {
            console.log(error);
          }
        )
    );
  }

  public onPageOffsetChange(pageInfo: { offset: number; pageSize: number }): void {
    this.pageOffset = pageInfo.offset;
    this.pageSize = pageInfo.pageSize;
    this.getAllAgreements();
  }

  public onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.getAllAgreements();
  }

  onClickAddAgreementButton(): void {
    this.router.navigate(["/agreements/add"]);
  }

  public onFilterChange(): void {
    this.resetPagination();
    this.getAllAgreements();
  }

  public onClickStatusTab(changeEvent: MatTabChangeEvent) {
    this.status = this.statusTabs[changeEvent.index].key as AgreementStatusAll;
    if (this.status === "all") {
      this.status = null;
    }
    this.resetPagination();
    this.getAllAgreements();
  }

  public resetPagination(): void {
    this.pageSize = 20;
    this.pageOffset = 0;
  }
}
