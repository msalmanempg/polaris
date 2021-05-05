/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/dot-notation */
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { LocationService } from "@app/services/location/location.service";
import { ICountry } from "country-state-city";
import { PhoneNumberUtil } from "google-libphonenumber";
import { noop } from "rxjs";

@Component({
  selector: "app-multicell-input",
  templateUrl: "./multicell-input.component.html",
  styleUrls: ["./multicell-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MulticellInputComponent),
      multi: true,
    },
  ],
})
export class MulticellInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() phoneLabel = "Contact";
  public countryDropdownOptions: ICountry[];
  public selectedCountry: ICountry;
  public placeHolder = "Phone Number";
  public isValid = true;
  public phoneNumber = "";
  public phoneValue = "";
  onChange: Function = noop;

  onTouched: Function = noop;

  constructor(public locationService: LocationService) {}

  ngOnInit(): void {
    this.countryDropdownOptions = this.locationService.getCountries();
    this.orderPrefferedCountry();
  }

  public onCountryChange(event: any, selectedCountry: ICountry): void {
    if (event.isUserInput) {
      this.selectedCountry = selectedCountry;
      const phoneUtil = PhoneNumberUtil.getInstance();
      const placholderSample = phoneUtil.getExampleNumber(
        selectedCountry.isoCode.toUpperCase()
      ) as any;
      if (placholderSample) {
        this.placeHolder = placholderSample["values_"][2].toString();
        this.phoneNumber = "";
      }
    }
  }

  public onPhoneNumberChange(): void {
    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      const contactNumber = phoneUtil.parse(
        this.phoneNumber.toString(),
        this.selectedCountry.isoCode
      ) as any;
      this.phoneNumber = contactNumber["values_"][2];
      this.isValid = phoneUtil.isValidNumber(contactNumber);
      this.value = `+${this.selectedCountry.phonecode} ${this.phoneNumber}`;
      this.valueChange.emit(this.value);
    } catch (e) {
      this.isValid = false;
      this.valueChange.emit("");
    }
  }

  public onInputKeyPress(event: any): void {
    if (event.key === "Backspace") {
      return;
    }

    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public orderPrefferedCountry(): void {
    const countryIsoCode = "PK";
    let topCountry: ICountry;

    this.countryDropdownOptions.forEach((country, index) => {
      if (country.isoCode === countryIsoCode) {
        topCountry = country;
        this.countryDropdownOptions.splice(index, 1);
      }
    });
    this.countryDropdownOptions.unshift(topCountry);
  }

  set value(newValue: string) {
    this.phoneNumber = newValue;
    this.phoneValue = newValue;
    this.onChange(newValue);
  }

  get value(): string {
    return this.phoneValue;
  }

  ngOnDestroy(): void {}

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }
}
