import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { CustomerAttachment } from "@app/interfaces";
import {
  CustomerAttachmentType,
  CustomerType,
  GovtIdType,
  RelationType,
} from "@app/types/customer.type";
import { ALLOWED_IMAGE_TYPES, GOVT_ID_MASK } from "@app/utils/constants";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-nominee",
  templateUrl: "./nominee.component.html",
  styleUrls: ["../customer/customer.component.scss"],
})
export class NomineeComponent implements OnInit {
  @Input() nominee: FormGroup;
  public customerTypes: CustomerType;
  public allowedTypes = ALLOWED_IMAGE_TYPES;
  public govtIdTypeOptions = Object.entries(GovtIdType).map(([value, key]) => ({ value, key }));
  public relationshipTypeOptions = Object.entries(RelationType).map(([value, key]) => ({
    value,
    key,
  }));

  public cnicMask = GOVT_ID_MASK.cnicMask;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  get attachments(): FormArray {
    return this.nominee.get("nomineeAttachments") as FormArray;
  }

  public onFileUpload(files: FileList, type: string): void {
    const file = new File([files.item(0)], `${uuidv4()}_${files[0].name}`);

    const attachmentType = Object.entries(CustomerAttachmentType).find(
      ([value, key]) => value === type
    );
    const attachment: CustomerAttachment = {
      fileName: file.name,
      file,
      type: attachmentType[1],
    };

    this.updateAttachments(attachmentType);
    this.attachments.push(this.formBuilder.control(attachment));
  }

  onCancelFile(fileType: string): void {
    const attachmentType = Object.entries(CustomerAttachmentType).find(
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

  govtIdTypeChange(govtIdType: string): void {
    this.cnicMask = govtIdType === GovtIdType.CNIC ? GOVT_ID_MASK.cnicMask : GOVT_ID_MASK.nicopMask;
    this.nominee.get("govtId").setValue("");
  }
}
