import { TitleCasePipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaymentPlanDetailFormComponent } from "./payment-plan-detail-form.component";

describe("PaymentPlanDetailFormComponent", () => {
  let component: PaymentPlanDetailFormComponent;
  let fixture: ComponentFixture<PaymentPlanDetailFormComponent>;
  const mockFile = new File([""], "payment_plan.pdf", { type: "pdf" });
  const mockFileList: FileList = {
    length: [mockFile].length,
    item: (index: number): File => [mockFile][index],
    [0]: mockFile,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentPlanDetailFormComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [TitleCasePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPlanDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should upload agreement attachment", () => {
    component.onFileUpload(mockFileList, "PAYMENT_PLAN");
    expect(component.attachments.controls.length).toBeGreaterThan(0);
  });

  it("should cancel uploaded agreement attachment", () => {
    component.onFileUpload(mockFileList, "PAYMENT_PLAN");
    component.onCancelFile("PAYMENT_PLAN");
    expect(component.attachments.controls.length).toEqual(0);
  });
});
