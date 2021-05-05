import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, Validators } from "@angular/forms";
import { EMAIL_REGEX } from "@app/utils/constants";
import { CustomerComponent } from "./customer.component";

describe("CustomerComponent", () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerComponent],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    component.customerDetailForm = formBuilder.group({
      type: [null, Validators.required],
      govtIdType: [null, Validators.required],
      govtId: [null, Validators.required],
      fullName: [null, Validators.required],
      guardianName: [null, Validators.required],
      relationType: [null, Validators.required],
      nationality: [null, Validators.required],
      passportNumber: [null, [Validators.minLength(9), Validators.maxLength(9)]],
      gender: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      address: [null, Validators.required],
      country: [null],
      province: [null],
      city: [null, Validators.required],
      email: [
        null,
        [Validators.required.bind(this), Validators.email, Validators.pattern(EMAIL_REGEX)],
      ],
      primaryContactNumber: [null, Validators.required],
      secondaryContactNumber: [null, Validators.required],
      customerAttachments: formBuilder.array([]),
      jointCustomers: formBuilder.array([]),
      nominees: formBuilder.array([]),
      company: formBuilder.group({}),
    });

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should upload agreement attachments", () => {
    const mockFile = new File([""], "idCard.png", { type: "png" });
    component.onFileUpload([mockFile], "ID_FRONT");
    expect(component.attachments.controls.length).toBeGreaterThan(0);
  });

  it("should cancel uploaded agreement attachment", () => {
    const callUpdateAttachments = spyOn(component, "updateAttachments").and.callThrough();

    component.onCancelFile("ID_FRONT");
    expect(callUpdateAttachments).toHaveBeenCalled();
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
    it(`should validate uploaded profile  file - ${fileType}`, () => {
      const mockReader: FileReader = jasmine.createSpyObj("FileReader", [
        "readAsDataURL",
        "addEventListener",
      ]);
      spyOn(window as any, "FileReader").and.returnValue(mockReader);
      const mockFile = new File([""], filename, { type: fileType });
      const mockEvt = { target: { files: [mockFile] } };
      component.onProfileImageUpload(mockEvt as any);
      expect(component.isInvalidFileFormat).toEqual(expected);
    });
  });

  it("should fetch the states for the country", () => {
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
    expect(component.states.length).toBeGreaterThan(0);
  });

  it("should fetch the cities for the state", () => {
    const state = {
      countryCode: "AL",
      isoCode: "BR",
      latitude: "40.70863770",
      longitude: "19.94373140",
      name: "Berat District",
    };
    component.onStateChange({ isUserInput: true }, state);
    expect(component.cities.length).toBeGreaterThan(0);
  });

  it("should update govtId type", () => {
    component.govtIdTypeChange("cnic");
    expect(component.cnicMask).toEqual("00000-0000000-0");
  });
});
