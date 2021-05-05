import { TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AgreementAttachment } from "@app/interfaces/agreement.interface";
import { AgreementAttachmentType, AgreementStatus } from "@app/types/agreement.type";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-payment-plan-detail-form",
  templateUrl: "./payment-plan-detail-form.component.html",
  styleUrls: ["./payment-plan-detail-form.component.scss"],
})
export class PaymentPlanDetailFormComponent implements OnInit {
  @Output() paymentPlanDetailformSet = new EventEmitter<FormGroup>();
  paymentPlanForm: FormGroup;

  public agreementStatusTypeOptions = Object.entries(AgreementStatus).map(([value, key]) => ({
    value,
    key,
  }));

  constructor(private titlecase: TitleCasePipe, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.setPaymentPlanDetailForm();
    this.paymentPlanDetailformSet.emit(this.paymentPlanForm);
  }

  setPaymentPlanDetailForm(): void {
    this.paymentPlanForm = this.formBuilder.group({
      installmentStartDate: [null],
      installmentEndDate: [null],
      status: ["", Validators.required],
      agreementAttachments: this.formBuilder.array([]),
    });
  }

  get attachments(): FormArray {
    return this.paymentPlanForm.get("agreementAttachments") as FormArray;
  }

  public onFileUpload(files: FileList, type: string): void {
    const file = new File([files.item(0)], `${uuidv4()}_${files[0].name}`);

    const attachmentType = Object.entries(AgreementAttachmentType).find(
      ([value, key]) => value === type
    );

    const attachment: AgreementAttachment = {
      fileName: file.name,
      file,
      type: attachmentType[1],
    };

    this.updateAttachments(attachmentType);
    this.attachments.push(this.formBuilder.control(attachment));
  }

  onCancelFile(fileType: string): void {
    const attachmentType = Object.entries(AgreementAttachmentType).find(
      ([value, key]) => value === fileType
    );
    this.updateAttachments(attachmentType);
  }

  updateAttachments(attachmentType: string[]): void {
    this.attachments.controls.forEach((control, index) => {
      if (control.value.type === attachmentType[1]) {
        this.attachments.removeAt(index);
      }
    });
  }
}
