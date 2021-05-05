import { NativeDateAdapter } from "@angular/material/core";
import { format } from "date-fns";
import { FORMAT_DATE } from "@app/utils/constants";

export class CustomDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: string): string {
    return format(new Date(date), FORMAT_DATE.fullDateFormate);
  }
  parse(value: string): any {
    const parts = value.split("/");
    if (parts.length === 3) {
      return new Date(+parts[2], +parts[1] - 1, +parts[0]);
    }
  }
}
