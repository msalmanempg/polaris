import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Customer } from "@app/interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  createCustomer(customerData: Customer): Observable<any> {
    return this.http.post("/api/customer/add", customerData);
  }

  getCustomers(pageSize: number, pageOffset: number): Observable<Customer[]> {
    let params = new HttpParams();
    params = params.append("pageSize", pageSize.toString());
    params = params.append("pageOffset", pageOffset.toString());
    return this.http.get<Customer[]>("/api/customer", {
      params,
    });
  }

  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`/api/customer/delete/${customerId}`);
  }

  updateCustomer(customerId: number, customerData: Customer): Observable<any> {
    return this.http.put(`/api/customer/update/${customerId}`, customerData);
  }
}
