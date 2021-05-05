import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { AddProjectComponent } from "./add-project.component";
import { FormBuilder } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { LocationService } from "@app/services/location/location.service";
import { ProjectService } from "@app/services/project/project.service";
import { AlertService } from "@app/services/alert/alertservice.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { of, throwError } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { Project } from "@app/interfaces/project.interface";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AlertTypes } from "@app/types/alert.type";
describe("AddProjectComponent", () => {
  let component: AddProjectComponent;
  let fixture: ComponentFixture<AddProjectComponent>;
  let alertServiceMock: jasmine.SpyObj<AlertService>;

  const mockProject: Project = {
    address: "h$90",
    bankDetails: [
      {
        accountNumber: "2124567845",
        accountTitle: "434",
        bankName: "e3",
        createdAt: "2021-03-08T08:04:47.634Z",
        iban: "97YHJUI65RFV679UUYYY6666",
        swiftCode: "YU789IKJHBN",
        branchAddress: "mm alam",
        branchCode: "8976",
        id: 3,
        projectId: 37,
        updatedAt: "2021-03-08T08:04:47.636Z",
      },
    ],
    city: "Catabola",
    completionDate: new Date("2021-03-11"),
    country: "Angola",
    createdAt: "2021-03-08",
    email: "angola@gmail.com",
    id: 37,
    latitude: 343,
    logo: "url",
    longitude: 343,
    name: "projname",
    phone: "903420",
    province: "Bié Province",
    updatedAt: "2021-03-08T08:04:47.635Z",
    url: "y@gmail.com",
  };

  const formMockValues = {
    name: "zameen opal",
    address: "lahore pakistan",
    country: "pakistan",
    province: "punjab",
    city: "lhr",
    longitude: 2324.0,
    latitude: 2343.1,
    email: "zameen@gmail.com",
    phone: "9347823892",
    url: "www.zameen.com",
    logo: {},
    completionDate: "any date",
    bankDetailForm: {
      bankName: "alflah",
      accountTitle: "admin",
      accountNumber: "2124567845",
      iban: "97YHJUI65RFV679UUYYY6666",
      swiftCode: "YU789IKJHBN",
      branchAddress: "mm alam",
      branchCode: "0072",
    },
  };
  beforeEach(async () => {
    alertServiceMock = jasmine.createSpyObj("AlertService", ["showAlert"]);
    alertServiceMock.showAlert as jasmine.Spy;
    await TestBed.configureTestingModule({
      declarations: [AddProjectComponent],
      providers: [
        FormBuilder,
        LocationService,
        ProjectService,
        LocationService,
        { provide: AlertService, useValue: alertServiceMock },
        { provide: Window, useValue: window },
      ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch the states for the country", fakeAsync(() => {
    const country = {
      currency: "AFN",
      flag: "🇦🇫",
      isoCode: "AF",
      latitude: "33.00000000",
      longitude: "65.00000000",
      name: "Afghanistan",
      phonecode: "93",
    };

    component.onCountryChange({ isUserInput: true }, country);
    expect(component.stateDropOptions.length).toBeGreaterThan(0);
  }));

  it("should fetch the cities for the state", fakeAsync(() => {
    const state = {
      countryCode: "AL",
      isoCode: "BR",
      latitude: "40.70863770",
      longitude: "19.94373140",
      name: "Berat District",
    };
    component.onStateChange({ isUserInput: true }, state);
    expect(component.citiesDropdownOptions.length).toBeGreaterThan(0);
  }));

  it("should disable form when in editMode", fakeAsync(() => {
    const fetchProjectSpy = spyOn(component, "fetchProjectDetails").and.callFake((f: number) => f);
    spyOn(component, "getStatesCities").and.callFake((f: void) => f);
    const setEditProjectFormSpy = spyOn(component, "setProjectForm").and.callThrough();
    component.projectId = 1;
    component.ngOnInit();

    expect(setEditProjectFormSpy).toHaveBeenCalled();
    expect(fetchProjectSpy).toHaveBeenCalled();
    expect(component.addProjectForm.valid).toEqual(false);
    expect(component.isEditMode).toEqual(true);
    expect(component.addProjectForm.enabled).toEqual(false);
  }));

  it("should load form when in editMode", fakeAsync(() => {
    spyOn(component.projectService, "getProjectById").and.returnValue(of(mockProject));
    component.projectId = 37;
    component.ngOnInit();
    expect(component.projectDetail).toEqual(mockProject);
    expect(component.stateDropOptions.length).toBeGreaterThan(0);
  }));

  it("should throw error while fetching project by id", () => {
    spyOn(component.projectService, "getProjectById").and.returnValue(throwError("error"));
    component.fetchProjectDetails(37);
    expect(component.projectService.getProjectById).toHaveBeenCalled();
    expect(component.projectDetail).toBeUndefined();
  });

  it("should add project on submit form", () => {
    spyOn(component.router, "navigate");

    spyOn(component.projectService, "add").and.returnValue(of({}));

    component.addProjectForm.setValue(formMockValues);

    component.submitProjectForm();
    fixture.detectChanges();

    expect(component.projectService.add).toHaveBeenCalled();
  });

  it("should invalid form call the service method", () => {
    spyOn(component.router, "navigate");

    spyOn(component.projectService, "add").and.returnValue(of({}));

    component.submitProjectForm();
    fixture.detectChanges();

    expect(component.projectService.add).not.toHaveBeenCalled();
  });

  it("should show error on creating the project", () => {
    spyOn(component.router, "navigate");

    spyOn(component.projectService, "add").and.returnValue(throwError("error"));

    component.addProjectForm.setValue(formMockValues);

    component.submitProjectForm();
    fixture.detectChanges();
    expect(component.projectService.add).toHaveBeenCalled();
    expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
      "Something went Wrong!!!",
      AlertTypes.danger
    );
  });

  it("should update project on submit form", () => {
    spyOn(component.router, "navigate");

    spyOn(component.projectService, "update").and.returnValue(of({}));
    spyOn(component.projectService, "getProjectById").and.returnValue(of(mockProject));
    component.projectId = 37;
    component.ngOnInit();
    fixture.detectChanges();
    component.onEditProjectClick();

    component.addProjectForm.setValue(formMockValues);

    component.submitProjectForm();
    fixture.detectChanges();
    expect(component.projectService.update).toHaveBeenCalled();
  });

  it("should show error on updating the project", () => {
    spyOn(component.router, "navigate");

    spyOn(component.projectService, "update").and.returnValue(throwError("error"));
    spyOn(component.projectService, "getProjectById").and.returnValue(of(mockProject));

    component.projectId = 37;
    component.ngOnInit();
    fixture.detectChanges();
    component.onEditProjectClick();

    component.addProjectForm.setValue(formMockValues);

    component.submitProjectForm();
    fixture.detectChanges();
    expect(component.projectService.update).toHaveBeenCalled();
    expect(alertServiceMock.showAlert).toHaveBeenCalledWith(
      "Something went Wrong!!!",
      AlertTypes.danger
    );
  });

  it("should route on cancel", () => {
    spyOn(component.router, "navigate");
    component.onCancel();
    expect(component.router.navigate).toHaveBeenCalledWith(["/projects"]);
  });

  [
    {
      filename: "xyz.png",
      fileType: "png",
      expected: false,
    },
    {
      filename: "xyz.word",
      fileType: "word",
      expected: true,
    },
  ].forEach(({ filename, fileType, expected }) => {
    it(`should validate uploaded file - ${fileType}`, () => {
      const mockReader: FileReader = jasmine.createSpyObj("FileReader", [
        "readAsDataURL",
        "addEventListener",
      ]);
      spyOn(window as any, "FileReader").and.returnValue(mockReader);
      const mockFile = new File([""], filename, { type: fileType });
      const mockEvt = { target: { files: [mockFile] } };
      component.onLogoUpload(mockEvt as any);
      expect(component.isInvalidFileFormat).toEqual(expected);
    });
  });
});
