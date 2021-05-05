import { Injectable } from "@angular/core";
import csc from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  constructor() {}

  public getCountries(): ICountry[] {
    return csc.getAllCountries();
  }

  public getStates(countryCode?: string): IState[] {
    return countryCode ? csc.getStatesOfCountry(countryCode) : csc.getAllStates();
  }

  public getCities(countryCode?: string, stateCode?: string): ICity[] {
    return countryCode && stateCode
      ? csc.getCitiesOfState(countryCode, stateCode)
      : countryCode && !stateCode
      ? csc.getCitiesOfCountry(countryCode)
      : csc.getAllCities();
  }
}
