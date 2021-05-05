import { CommonModule, CurrencyPipe, PercentPipe, TitleCasePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { MaterialModule } from "@app/material/material.module";
import { CustomCurrencyPipe } from "@app/pipes/custom-currency-pipe";
import { SharedComponentModule } from "@app/shared/share.component.module";
import { CUSTOM_DATE_FORMATS } from "@app/utils/constants";
import { CustomDateAdapter } from "@app/utils/customDateAdapter";
import { WidgetsModule } from "@app/widgets";
import { NgxMaskModule } from "ngx-mask";
import { AddAgreementComponent } from "./add-agreement/add-agreement.component";
import { AgreementBookingComponent } from "./add-agreement/agreement-detail-form/agreement-booking/agreement-booking.component";
import { AgreementDetailFormComponent } from "./add-agreement/agreement-detail-form/agreement-detail-form.component";
import { AgreementDetailComponent } from "./add-agreement/agreement-detail-form/agreement-detail/agreement-detail.component";
import { SalesPersonComponent } from "./add-agreement/agreement-detail-form/sales-person/sales-person.component";
import { CompanyComponent } from "./add-agreement/customer-detail-form/company/company.component";
import { CustomerDetailFormComponent } from "./add-agreement/customer-detail-form/customer-detail-form.component";
import { CustomerComponent } from "./add-agreement/customer-detail-form/customer/customer.component";
import { NomineeComponent } from "./add-agreement/customer-detail-form/nominee/nominee.component";
import { PaymentPlanDetailFormComponent } from "./add-agreement/payment-plan-detail-form/payment-plan-detail-form.component";
import { PaymentPlanComponent } from "./add-agreement/payment-plan-detail-form/payment-plan/payment-plan.component";
import { AgreementRoutingModule } from "./agreement-routing.module";
import { AgreementComponent } from "./agreement.component";
import { AgreementsDatatableComponent } from "./list-agreement/agreements-datatable/agreements-datatable.component";
import { ListAgreementComponent } from "./list-agreement/list-agreement.component";
@NgModule({
  declarations: [
    AgreementComponent,
    AddAgreementComponent,
    ListAgreementComponent,
    AgreementDetailFormComponent,
    CustomerDetailFormComponent,
    PaymentPlanDetailFormComponent,
    CustomerComponent,
    NomineeComponent,
    PaymentPlanComponent,
    SalesPersonComponent,
    AgreementDetailComponent,
    AgreementBookingComponent,
    AgreementsDatatableComponent,
    CompanyComponent,
    CustomCurrencyPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgreementRoutingModule,
    SharedComponentModule,
    MaterialModule,
    NgxMaskModule.forRoot(),
    WidgetsModule,
  ],
  providers: [
    CustomCurrencyPipe,
    TitleCasePipe,
    PercentPipe,
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
})
export class AgreementModule {}
