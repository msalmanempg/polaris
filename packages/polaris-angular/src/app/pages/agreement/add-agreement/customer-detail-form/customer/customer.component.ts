import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { CustomerAttachment } from "@app/interfaces/customer.interface";
import { LocationService } from "@app/services/location/location.service";
import { DropdownOption } from "@app/shared/dropdown/dropdown.component";
import {
  CustomerAttachmentType,
  CustomerType,
  GenderType,
  GovtIdType,
  RelationType,
} from "@app/types/customer.type";
import {
  ALLOWED_IMAGE_TYPES,
  GOVT_ID_MASK,
  USER_PROFILE_IMG_DIMENSIONS,
} from "@app/utils/constants";
import { ICity, ICountry, IState } from "country-state-city";
import { v4 as uuidv4 } from "uuid";
const DEFAULT_LOGO_IMAGE = "/assets/images/image-placeholder.jpg";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"],
})
export class CustomerComponent implements OnInit {
  @Input() isJointCustomerForm = false;
  @Input() customerDetailForm: FormGroup;

  @Output() customerTypeChange = new EventEmitter<any>();
  public allowedTypes = ALLOWED_IMAGE_TYPES;
  public profileImg = DEFAULT_LOGO_IMAGE;
  public customerTypeOptions = Object.entries(CustomerType).map(([value, key]) => ({ value, key }));
  public govtIdTypeOptions = Object.entries(GovtIdType).map(([value, key]) => ({ value, key }));
  public relationshipTypeOptions = Object.entries(RelationType).map(([value, key]) => ({
    value,
    key,
  }));
  public genderTypeOptions = Object.entries(GenderType).map(([value, key]) => ({
    value,
    key,
  }));
  public countryDropdownOptions: DropdownOption[];
  public isInvalidDimension: boolean;
  public isInvalidFileFormat: boolean;

  public countries: ICountry[];
  public states: IState[];
  public cities: ICity[];

  public cnicMask = GOVT_ID_MASK.cnicMask;

  constructor(private locationService: LocationService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.setCountries();
  }

  setCountries(): void {
    this.countries = this.locationService.getCountries();
    this.countryDropdownOptions = this.countries.map((item) => ({
      key: item.name,
      value: item.name,
    }));
  }

  public onCountryChange(event: any, selectedCountry: ICountry): void {
    if (event.isUserInput) {
      this.states = this.locationService.getStates(selectedCountry.isoCode);
    }
  }

  public onStateChange(event: any, selectedState: IState): void {
    if (event.isUserInput) {
      this.cities = this.locationService.getCities(
        selectedState.countryCode,
        selectedState.isoCode
      );
    }
  }

  onProfileImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    this.uploadFile(file);
  }

  validateFileExtension(fileName: string): boolean {
    const fileExtension = fileName.split(".").pop();
    const allowedExtArr = this.allowedTypes.split(",");
    return allowedExtArr.includes("." + fileExtension);
  }

  uploadFile(file: File): void {
    this.isInvalidDimension = false;
    this.isInvalidFileFormat = false;

    if (!this.validateFileExtension(file.name)) {
      this.isInvalidFileFormat = true;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener(
      "load",
      async (event: any): Promise<void> => {
        const isValidDimentions = await this.checkDimensions(event, this);
        if (isValidDimentions) {
          this.profileImg = event.target.result;
          this.onFileUpload([file], "PROFILE_PICTURE");
          this.isInvalidDimension = false;
          this.isInvalidFileFormat = false;
        } else {
          this.isInvalidDimension = true;
        }
      }
    );
  }

  checkDimensions(event: any, source: CustomerComponent): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = event.target.result;
      image.addEventListener("load", () => {
        resolve(
          image.width === USER_PROFILE_IMG_DIMENSIONS.width &&
            image.height === USER_PROFILE_IMG_DIMENSIONS.width
        );
      });
    });
  }

  get attachments(): FormArray {
    return this.customerDetailForm.get("customerAttachments") as FormArray;
  }

  public onFileUpload(files: any, type: string): void {
    const file = new File([files[0]], `${uuidv4()}_${files[0].name}`);

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
    this.customerDetailForm.get("govtId").setValue("");
  }
}
