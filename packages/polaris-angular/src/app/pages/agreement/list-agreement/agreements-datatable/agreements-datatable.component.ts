import { TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ActionsColumn, AnchorColumn, Column } from "@app/interfaces";
import { AgreementDTO } from "@app/interfaces/agreement.interface";
import { ColumnAlign, ColumnType } from "@app/types/datatable-columnType";
import { FORMAT_DATE } from "@app/utils/constants";
import { format } from "date-fns";

export interface AgreementRow {
  id: number;
  agreementNumber: string;
  customerName: string;
  projectId: number;
  projectName: string;
  agreementDate: string;
  unitNumber: string;
  paymentPercentage: string;
  noticesCount: number;
  overduePayments: number;
  status: string;
}

@Component({
  selector: "app-agreements-datatable",
  templateUrl: "./agreements-datatable.component.html",
  styleUrls: ["./agreements-datatable.component.scss"],
})
export class AgreementsDatatableComponent implements OnInit {
  @Input()
  public set agreements(agreements: AgreementDTO[]) {
    this.rows = agreements.map(this.mapAgreementDTOToAgreementRow.bind(this));
  }

  @Input()
  public count: number;

  @Input()
  public pageSize: number;

  @Output()
  public pageOffsetChange = new EventEmitter<{ offset: number; pageSize: number }>();

  @Output()
  public pageSizeChange = new EventEmitter<number>();

  public rows: AgreementRow[] = [];

  public columns: Column[];

  constructor(private titlecase: TitleCasePipe, public router: Router) {}

  ngOnInit(): void {
    this.columns = this.getColumnConfiguration();
  }

  getColumnConfiguration(): Column[] {
    const projectUrl = "projects/view/:id";

    return [
      {
        key: "agreementNumber",
        value: "AGMT NO.",
        columnType: ColumnType.ACTION,
        actions: [
          {
            onClick: (row: AgreementRow) => {},
          },
        ],
      } as ActionsColumn,
      { key: "customerName", value: "CUSTOMER", columnType: ColumnType.TEXT },
      {
        key: "projectName",
        value: "PROJECT",
        columnType: ColumnType.ANCHOR,
        getUrl: (row: AgreementRow): string =>
          `/${projectUrl.replace(":id", row.projectId.toString())}`,
      } as AnchorColumn,
      { key: "unitNumber", value: "UNIT", columnType: ColumnType.TEXT },
      {
        key: "agreementDate",
        value: "AGMT DATE",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "paymentPercentage",
        value: "PAYMENT",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "noticesCount",
        value: "NOTICES",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      {
        key: "overduePayments",
        value: "PAYMENT OVERDUE",
        columnType: ColumnType.TEXT,
        align: ColumnAlign.RIGHT,
      },
      { key: "status", value: "STATUS", columnType: ColumnType.TEXT },
      {
        key: "actions",
        value: "ACTIONS",
        columnType: ColumnType.ACTION,
        actions: [
          {
            icon: "edit",
            onClick: (row: AgreementRow): void => this.onClickEditAgreement(row.id),
          },
        ],
      } as ActionsColumn,
    ];
  }

  onClickEditAgreement(agreementId: number) {
    this.router.navigate([`agreements/edit/${agreementId}`]);
  }

  private mapAgreementDTOToAgreementRow(agreement: AgreementDTO): AgreementRow {
    return {
      id: agreement.id,
      agreementNumber: agreement.agreementNumber,
      customerName: agreement.customer?.name,
      projectId: agreement.unit.project.id,
      projectName: agreement.unit.project.name,
      agreementDate: format(new Date(agreement.agreementDate), FORMAT_DATE.fullDateFormate),
      unitNumber: agreement.unit.unitNumber,
      paymentPercentage: `${agreement.paymentPercentage}%`,
      noticesCount: agreement.noticesCount,
      overduePayments: agreement.overduePayments,
      status: this.titlecase.transform(agreement.status),
    };
  }
}
