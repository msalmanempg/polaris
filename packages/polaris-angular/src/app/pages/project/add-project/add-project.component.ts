import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { createManagedRxSubscriptions } from "@app/utils/rx-subscription-manager";
import { Project } from "@app/interfaces/project.interface";
import { ProjectService } from "@app/services/project/project.service";
import { LocationService } from "@app/services/location/location.service";
import { AlertService } from "@app/services/alert/alertservice.service";
import { RequestHelperService } from "@app/services/request-helper.service";
import { ICountry, IState, ICity } from "country-state-city";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import {
  EMAIL_REGEX,
  PROJECT_LOGO_IMG_DIMENSIONS,
  ALLOWED_IMAGE_TYPES,
  ALPHANUMERIC_REGEX,
  NUMERIC_REGEX,
} from "@app/utils/constants";
import { AlertTypes } from "@app/types/alert.type";

const DEFAULT_LOGO_IMAGE = "/assets/images/image-placeholder.jpg";
@Component({
  selector: "app-add-project",
  templateUrl: "./add-project.component.html",
  styleUrls: ["./add-project.component.scss"],
})
export class AddProjectComponent implements OnInit, OnDestroy {
  public projectLogo = DEFAULT_LOGO_IMAGE;
  public allowedTypes = ALLOWED_IMAGE_TYPES;
  public addProjectForm: FormGroup;
  public countryDropdownOptions: ICountry[];
  public stateDropOptions: IState[];
  public citiesDropdownOptions: ICity[];
  public isEditMode = false;
  public projectId: number;
  public projectDetail: Project;
  public isInvalidDimension: boolean;
  public isInvalidFileFormat: boolean;
  public baseUrl: string;
  public isFormInEditableMode = false;
  public minDate = new Date();
  private subscriptions = createManagedRxSubscriptions({
    addProject: null,
    updateProject: null,
    getProject: null,
  });

  constructor(
    private formBuilder: FormBuilder,
    public projectService: ProjectService,
    public locationService: LocationService,
    public router: Router,
    private route: ActivatedRoute,
    private requestHelperService: RequestHelperService,
    private alertService: AlertService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes("/projects/edit/")) {
          this.isFormInEditableMode = true;
        }
      }
    });

    route.params.subscribe((params) => (this.projectId = params.projectId));
    this.baseUrl = this.requestHelperService.getCurrentLocationUrl();
  }

  ngOnInit(): void {
    this.isEditMode = !!this.projectId;
    this.setProjectForm();
    if (this.isEditMode) {
      this.fetchProjectDetails(this.projectId);
      if (!this.isFormInEditableMode) {
        this.addProjectForm.disable();
      }
    }

    this.countryDropdownOptions = this.locationService.getCountries();
  }

  getStatesCities(): void {
    if (this.addProjectForm.controls.country.value) {
      const selectedCountry = this.countryDropdownOptions.find(
        (item) => item.name === this.addProjectForm.controls.country.value
      );
      this.stateDropOptions = this.locationService.getStates(selectedCountry.isoCode);
      const selectedState = this.stateDropOptions.find(
        (item) => item.name === this.addProjectForm.controls.province.value
      );
      this.citiesDropdownOptions = this.locationService.getCities(
        selectedState.countryCode,
        selectedState.isoCode
      );
    }
  }

  setProjectForm(): void {
    this.addProjectForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.pattern(ALPHANUMERIC_REGEX)]],
      address: ["", Validators.required],
      country: ["", Validators.required],
      province: ["", Validators.required],
      city: ["", Validators.required],
      longitude: [""],
      latitude: [""],
      email: [null, [Validators.required, Validators.email, Validators.pattern(EMAIL_REGEX)]],
      phone: ["", Validators.required],
      url: ["", Validators.required],
      completionDate: ["", Validators.required],
      logo: ["", Validators.required],
      bankDetailForm: this.formBuilder.group({
        bankName: ["", [Validators.required.bind(this), Validators.pattern(ALPHANUMERIC_REGEX)]],
        accountTitle: ["", Validators.required],
        accountNumber: [
          "",
          [
            Validators.required.bind(this),
            Validators.minLength(10),
            Validators.maxLength(14),
            Validators.pattern(NUMERIC_REGEX),
          ],
        ],
        iban: [
          "",
          [
            Validators.required.bind(this),
            Validators.minLength(24),
            Validators.maxLength(24),
            Validators.pattern(ALPHANUMERIC_REGEX),
          ],
        ],
        swiftCode: [
          "",
          [
            Validators.required.bind(this),
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(ALPHANUMERIC_REGEX),
          ],
        ],
        branchAddress: ["", Validators.required],
        branchCode: [
          "",
          [
            Validators.required.bind(this),
            Validators.minLength(4),
            Validators.maxLength(4),
            Validators.maxLength(14),
            Validators.pattern(NUMERIC_REGEX),
          ],
        ],
      }),
    });
  }

  public get bankDetailForm(): FormGroup {
    return this.addProjectForm.get("bankDetailForm") as FormGroup;
  }

  public fetchProjectDetails(projectId: number): void {
    this.subscriptions.getProject.manage(
      this.projectService.getProjectById(projectId).subscribe(
        (response) => {
          this.projectDetail = {
            ...response,
          };
          const [bankDetail] = this.projectDetail.bankDetails;
          this.addProjectForm.patchValue({
            ...this.projectDetail,
            bankDetailForm: bankDetail,
          });

          this.getStatesCities();
          this.projectLogo = this.projectDetail.logo;
        },
        (errorResponse) => {
          console.log("error response:", errorResponse);
        }
      )
    );
  }

  public onEditProjectClick(): void {
    this.addProjectForm.enable();
  }

  public onCancel(): void {
    this.router.navigate(["/projects"]);
  }

  public onCountryChange(event: any, selectedCountry: ICountry): void {
    if (event.isUserInput) {
      this.stateDropOptions = this.locationService.getStates(selectedCountry.isoCode);
    }
  }

  public onStateChange(event: any, selectedState: IState): void {
    if (event.isUserInput) {
      this.citiesDropdownOptions = this.locationService.getCities(
        selectedState.countryCode,
        selectedState.isoCode
      );
    }
  }

  public onCityChange(selectedCity: ICity): void {
    this.addProjectForm.controls.city.setValue(selectedCity.name);
  }

  ngOnDestroy(): void {
    this.subscriptions.disposeAll();
  }

  public async onLogoUpload(event: Event): Promise<void> {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    this.uploadFile(file);
  }

  public submitProjectForm(): void {
    if (!this.addProjectForm.valid) {
      return;
    }
    const {
      name,
      address,
      country,
      province,
      city,
      longitude,
      latitude,
      email,
      phone,
      url,
      logo,
      completionDate,
      bankDetailForm,
    } = this.addProjectForm.value;

    const projectInfo: Project = {
      name,
      address,
      country,
      province,
      city,
      longitude,
      latitude,
      email,
      phone,
      url,
      logo,
      completionDate,
      bankDetails: [{ ...bankDetailForm }],
    };

    if (this.isEditMode) {
      const [bankDetail] = this.projectDetail.bankDetails;
      projectInfo.bankDetails = [{ ...bankDetailForm, ...(bankDetail && { id: bankDetail.id }) }];
      this.subscriptions.updateProject.manage(
        this.projectService.update(this.projectId, projectInfo).subscribe(
          (response) => {
            this.alertService.showAlert("Project Successfully Updated", AlertTypes.success);
            this.router.navigate(["/projects"]);
          },
          (errorResponse) => {
            this.alertService.showAlert("Something went Wrong!!!", AlertTypes.danger);
          }
        )
      );
    } else {
      this.subscriptions.addProject.manage(
        this.projectService.add(projectInfo).subscribe(
          (response) => {
            this.alertService.showAlert("Project Successfully added", AlertTypes.success);
            this.router.navigate(["/projects"]);
          },
          (errorResponse) => {
            this.alertService.showAlert("Something went Wrong!!!", AlertTypes.danger);
          }
        )
      );
    }
  }

  validateFileExtension(fileName: string): boolean {
    const fileExtension = fileName.split(".").pop();
    const allowedExtArr = this.allowedTypes.split(",");
    return allowedExtArr.includes("." + fileExtension);
  }

  uploadFile(file: File): void {
    this.isInvalidDimension = false;
    this.isInvalidFileFormat = false;

    // validate file type
    if (!this.validateFileExtension(file.name)) {
      this.isInvalidFileFormat = true;
      return;
    }

    // validate file dimension
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener(
      "load",
      async (event: any): Promise<void> => {
        const isValidDimentions = await this.checkDimensions(event, this);
        if (isValidDimentions) {
          this.projectLogo = event.target.result;
          this.addProjectForm.patchValue({
            logo: file,
          });
          this.isInvalidDimension = false;
          this.isInvalidFileFormat = false;
        } else {
          this.isInvalidDimension = true;
        }
      }
    );
  }

  checkDimensions(event: any, source: AddProjectComponent): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = event.target.result;
      image.addEventListener("load", () => {
        resolve(
          image.width === PROJECT_LOGO_IMG_DIMENSIONS.width &&
            image.height === PROJECT_LOGO_IMG_DIMENSIONS.width
        );
      });
    });
  }
}
