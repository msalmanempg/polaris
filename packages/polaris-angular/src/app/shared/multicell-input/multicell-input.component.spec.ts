import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";

import { MulticellInputComponent } from "./multicell-input.component";

describe("MulticellInputComponent", () => {
  let component: MulticellInputComponent;
  let fixture: ComponentFixture<MulticellInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MulticellInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MulticellInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch the sample number for the country code", fakeAsync(() => {
    const country = {
      currency: "AFN",
      flag: "🇦🇫",
      isoCode: "AF",
      latitude: "33.00000000",
      longitude: "65.00000000",
      name: "Afghanistan",
      phonecode: "93",
    };

    component.onCountryChange({ isUserInput: true }, country);
    expect(component.placeHolder).toEqual("234567890");
    expect(component.selectedCountry).toBeDefined();
  }));

  [
    {
      phoneNumber: "234567890",
      isValid: true,
    },
    {
      phoneNumber: "237890",
      isValid: false,
    },
  ].forEach(({ phoneNumber, isValid }) => {
    it(`should validate the entered phone number - ${phoneNumber}`, () => {
      const country = {
        currency: "AFN",
        flag: "🇦🇫",
        isoCode: "AF",
        latitude: "33.00000000",
        longitude: "65.00000000",
        name: "Afghanistan",
        phonecode: "93",
      };

      component.selectedCountry = country;
      component.phoneNumber = phoneNumber;
      component.onPhoneNumberChange();
      fixture.detectChanges();

      expect(component.isValid).toEqual(isValid);
    });
  });

  it("should set value and call onChange", () => {
    spyOn(component, "onChange");

    const newValue = "+92 234567890";
    component.value = newValue;

    expect(component.value).toEqual(newValue);
    expect(component.onChange).toHaveBeenCalledWith(newValue);
  });

  it("should register onChange function", () => {
    const fn = () => "+92 234567890";
    component.registerOnChange(fn);
    expect(component.onChange).toEqual(fn);
  });

  it("should register onTouched function", () => {
    const fn = () => "+92 234567890";
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  it("should write value", () => {
    const value = "+92 234567890";
    component.writeValue(value);
    expect(component.value).toEqual(value);
  });
});
