import { Component, OnInit, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { LocationService } from "@app/services/location/location.service";
import { ICountry, IState, ICity } from "country-state-city";

@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["../customer/customer.component.scss"],
})
export class CompanyComponent implements OnInit {
  @Input() company: FormGroup;

  public countries: ICountry[];
  public states: IState[];
  public cities: ICity[];
  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.setCountries();
  }

  setCountries(): void {
    this.countries = this.locationService.getCountries();
  }

  public onCountryChange(event: any, selectedCountry: ICountry): void {
    if (event.isUserInput) {
      this.states = this.locationService.getStates(selectedCountry.isoCode);
    }
  }

  public onStateChange(event: any, selectedState: IState): void {
    if (event.isUserInput) {
      this.cities = this.locationService.getCities(
        selectedState.countryCode,
        selectedState.isoCode
      );
    }
  }
}
