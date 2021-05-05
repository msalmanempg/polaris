import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AgreementDTO,
  AgreementStatusAll,
  PaginatedAgreement,
} from "@app/interfaces/agreement.interface";
import { buildFormData } from "@app/utils";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AgreementService {
  constructor(private http: HttpClient) {}

  getAllAgreements(
    pageOffset?: number,
    pageSize?: number,
    projectId?: number,
    unitId?: number,
    customerGovtId?: string,
    status?: AgreementStatusAll,
    includeStats?: boolean
  ): Observable<AgreementDTO[] | PaginatedAgreement> {
    let params = new HttpParams();
    params = params.append("pageOffset", pageOffset?.toString());
    params = params.append("pageSize", pageSize?.toString());

    if (projectId) {
      params = params.append("projectId", projectId?.toString());
    }

    if (unitId) {
      params = params.append("unitId", unitId?.toString());
    }

    if (customerGovtId) {
      params = params.append("customerGovtId", customerGovtId);
    }

    if (status) {
      params = params.append("status", status?.toString());
    }

    if (includeStats) {
      params = params.append("includeStats", "true");
    }

    return this.http.get<PaginatedAgreement>("/api/agreement", { params });
  }

  saveAgreement(agreementData: any): Observable<any> {
    const formData = new FormData();

    buildFormData(formData, agreementData, undefined);

    return this.http.post("/api/agreement/add", formData);
  }
}
