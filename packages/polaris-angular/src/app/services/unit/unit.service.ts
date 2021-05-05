import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaginatedUnit, Unit, UnitStatusAll } from "@app/interfaces/unit.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UnitService {
  constructor(private http: HttpClient) {}

  getAllUnits(parameters: {
    pageOffset?: number;
    pageSize?: number;
    projectId?: number;
    status?: UnitStatusAll;
    includeStats?: boolean;
  }): Observable<Unit[] | PaginatedUnit> {
    let params = new HttpParams();
    if (parameters.pageOffset) {
      params = params.append("pageOffset", parameters.pageOffset?.toString());
    }

    if (parameters.pageSize) {
      params = params.append("pageSize", parameters.pageSize?.toString());
    }

    if (parameters.projectId) {
      params = params.append("projectId", parameters.projectId?.toString());
    }

    if (parameters.status) {
      params = params.append("status", parameters.status?.toString());
    }

    if (parameters.includeStats) {
      params = params.append("includeStats", "true");
    }

    return this.http.get<PaginatedUnit>("/api/unit", { params });
  }

  public saveUnits(params: { projectId: number; file: File }): Observable<any> {
    const formData = new FormData();
    formData.append("projectId", params.projectId.toString());
    formData.append("units", params.file);
    return this.http.post("/api/unit/import/", formData);
  }

  public exportUnits(projectId?: number): Observable<any> {
    return this.http.get(`/api/unit/export/${projectId}`);
  }

  getUnitById(unitId: number): Observable<Unit> {
    return this.http.get<Unit>(`/api/unit/detail/${unitId}`);
  }
}
