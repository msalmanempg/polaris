import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Project, PaginatedProject } from "@app/interfaces/project.interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  all(pageOffset?: number, pageSize?: number): Observable<Project[] | PaginatedProject> {
    let params = new HttpParams();
    params = params.append("pageSize", pageSize?.toString());
    params = params.append("pageOffset", pageOffset?.toString());
    return this.http.get<PaginatedProject>("/api/project", { params });
  }

  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`/api/project/detail/${projectId}`);
  }

  add(projectInfo: Project): Observable<any> {
    const formData = new FormData();
    Object.entries(projectInfo).forEach(([key, value]) => formData.append(key, value));
    formData.set("completionDate", new Date(projectInfo.completionDate).toISOString().toString());
    formData.set("bankDetails", JSON.stringify(projectInfo.bankDetails));
    return this.http.post("/api/project/add", formData);
  }

  update(projectId: number, projectInfo: Project): Observable<any> {
    const formData = new FormData();
    Object.entries(projectInfo).forEach(([key, value]) => formData.append(key, value));
    formData.set("completionDate", new Date(projectInfo.completionDate).toISOString().toString());
    formData.set("bankDetails", JSON.stringify(projectInfo.bankDetails));
    return this.http.put(`/api/project/update/${projectId}`, formData);
  }
}
