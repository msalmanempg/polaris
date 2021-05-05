import { Pipe, PipeTransform } from "@angular/core";
const CONSTANTS = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FIXED_DECIMAL_POINT: 2,
};

@Pipe({
  name: "currencyPipe",
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: string, currency: string): string {
    return value && parseInt(value, 10)
      ? `${currency} ${this.currencyFormatter(value)}`
      : `${currency} ${parseInt("0", 10).toFixed(CONSTANTS.FIXED_DECIMAL_POINT)}`;
  }

  currencyFormatter(amount: string): string {
    return `${Number(parseInt(amount, 10)).toLocaleString("en", {
      minimumFractionDigits: CONSTANTS.FIXED_DECIMAL_POINT,
    })}`;
  }
}
