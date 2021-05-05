import { InjectionToken, Injector, Provider, Type } from "injection-js";
import { CustomerService } from "./customer";
import { ProjectService } from "./project";
import { UnitService } from "./unit";
import {
  AgreementService,
  AgreementCustomerService,
  NomineeService,
  DraftAgreementService,
  AgreementCompanyService,
} from "./agreement";

export interface DomainInjector extends Omit<Injector, "get"> {
  get<T>(token: Type<T> | InjectionToken<T>): T;
}

export const getDomainProviders = (): Provider[] => [
  AgreementService,
  CustomerService,
  ProjectService,
  UnitService,
  AgreementCustomerService,
  AgreementCompanyService,
  NomineeService,
  DraftAgreementService,
];
