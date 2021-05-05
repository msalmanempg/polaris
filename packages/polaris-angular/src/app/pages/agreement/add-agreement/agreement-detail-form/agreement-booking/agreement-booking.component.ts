import { Component, OnInit, forwardRef } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  AbstractControl,
  ControlValueAccessor,
  Validator,
} from "@angular/forms";
import { PercentPipe } from "@angular/common";
import { addDays } from "date-fns";
import { CustomCurrencyPipe } from "@app/pipes";

const digitsRegex = /\d+/g;
@Component({
  selector: "app-agreement-booking",
  templateUrl: "./agreement-booking.component.html",
  styleUrls: ["../agreement-detail/agreement-detail.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgreementBookingComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AgreementBookingComponent),
      multi: true,
    },
  ],
})
export class AgreementBookingComponent implements OnInit, ControlValueAccessor, Validator {
  agreementDetailForm: FormGroup;
  public currencyCode = "PKR";
  public minDate: Date;
  constructor(
    private currencyPipe: CustomCurrencyPipe,
    public percentPipe: PercentPipe,
    private formBuilder: FormBuilder
  ) {
    this.setAgreementForm();
  }

  ngOnInit(): void {}

  public formatAmountValue(formControlName: string) {
    let controlValue = this.agreementDetailForm.controls[formControlName].value;
    if (controlValue) {
      [controlValue] = controlValue.toString().replace(/,/g, "").match(digitsRegex);

      if (
        controlValue.toString() !== this.agreementDetailForm.get(formControlName).value.toString()
      ) {
        this.agreementDetailForm.get(formControlName).setValue(controlValue);
      }

      if (formControlName === "publishedPrice" || formControlName === "bookingPrice") {
        if (
          this.agreementDetailForm.controls.bookingPrice.value &&
          this.agreementDetailForm.controls.publishedPrice.value
        ) {
          const discountedValue =
            this.agreementDetailForm.controls.publishedPrice.value -
            this.agreementDetailForm.controls.bookingPrice.value;

          if (discountedValue > 0) {
            const discountedPercentageValue =
              discountedValue / this.agreementDetailForm.controls.publishedPrice.value;
            const transformedPercentageValue = discountedPercentageValue
              ? this.percentPipe.transform(discountedPercentageValue, "1.2-2")
              : controlValue;
            const transformedCurrencyValue = this.currencyPipe
              .transform(discountedValue.toString(), this.currencyCode)
              .toString();
            const transformedValue = transformedCurrencyValue + ` (${transformedPercentageValue})`;
            this.agreementDetailForm.get("discountValue").setValue(transformedValue);
            return;
          }
          this.agreementDetailForm.get("discountValue").setValue(0);
        }
      }

      if (
        formControlName === "posessionValue" &&
        this.agreementDetailForm.controls.bookingPrice.value
      ) {
        const bookingPrice = this.agreementDetailForm.controls.bookingPrice.value;

        const downPaymentPercentageValue = controlValue / bookingPrice;
        const transformedPercentageValue = downPaymentPercentageValue
          ? this.percentPipe.transform(downPaymentPercentageValue, "1.2-2")
          : controlValue;

        const transformedCurrencyValue = this.currencyPipe
          .transform(controlValue, this.currencyCode)
          .toString();

        const transformedValue = transformedCurrencyValue + ` (${transformedPercentageValue})`;

        this.agreementDetailForm.get(formControlName).setValue(transformedValue);
      }
    }
  }

  setAgreementForm(): void {
    this.agreementDetailForm = this.formBuilder.group({
      publishedPrice: [null, { validators: Validators.required, updateOn: "blur" }],
      bookingPrice: [null, { validators: Validators.required, updateOn: "blur" }],
      discountValue: [null, Validators.required],
      bookingDate: [null, Validators.required],
      posessionValue: [null, { validators: Validators.required, updateOn: "blur" }],
      agreementDate: [null, Validators.required],
    });
  }

  onBookingDateChange(): void {
    this.minDate = this.agreementDetailForm.get("bookingDate").value
      ? addDays(new Date(this.agreementDetailForm.get("bookingDate").value), 1)
      : undefined;
  }

  setPossessionValue(publishedPrice: number): void {
    this.agreementDetailForm.get("publishedPrice").setValue(publishedPrice);
  }

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    if (val) {
      this.agreementDetailForm.setValue(val, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.agreementDetailForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.agreementDetailForm.disable();
    } else {
      this.agreementDetailForm.enable();
    }
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.agreementDetailForm.valid
      ? null
      : { invalidForm: { valid: false, message: "booking form fields are invalid" } };
  }
}
