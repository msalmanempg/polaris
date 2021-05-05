import { ColumnAlign, ColumnType } from "@app/types/datatable-columnType";

export interface Column {
  key: string;
  value: string;
  order?: number | 0;
  canSort?: boolean;
  columnType: ColumnType;
  align?: ColumnAlign;
}

export interface ActionData {
  cssClass?: string;

  name?: string;

  onClick: (data: any) => any;

  icon?: string;
}

export interface ActionsColumn extends Column {
  actions: ActionData[];
}

export interface AnchorColumn extends Column {
  getUrl?: (id: any) => string;
  onClick?: (id: any, row: any) => void;
}

export interface PageInfo {
  pageSize: number;
  offset: number;
}
