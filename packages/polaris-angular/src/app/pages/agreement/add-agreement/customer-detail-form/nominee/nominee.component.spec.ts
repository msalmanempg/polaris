import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, Validators } from "@angular/forms";
import { EMAIL_REGEX } from "@app/utils/constants";
import { NomineeComponent } from "./nominee.component";

describe("NomineeComponent", () => {
  let component: NomineeComponent;
  let fixture: ComponentFixture<NomineeComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const mockFile = new File([""], "idCard.png", { type: "png" });
  const mockFileList: FileList = {
    length: [mockFile].length,
    item: (index: number): File => [mockFile][index],
    [0]: mockFile,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NomineeComponent],
      providers: [{ provide: FormBuilder, useValue: formBuilder }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NomineeComponent);
    component = fixture.componentInstance;

    component.nominee = formBuilder.group({
      govtIdType: [null, Validators.required],
      govtId: [null, Validators.required],
      fullName: [null],
      relationship: [null],
      nomineeFor: [null],
      email: [
        null,
        [Validators.required.bind(this), Validators.email, Validators.pattern(EMAIL_REGEX)],
      ],
      contactNumber: [null],
      nomineeAttachments: formBuilder.array([]),
    });

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should upload agreement attachment", () => {
    component.onFileUpload(mockFileList, "ID_FRONT");
    expect(component.attachments.controls.length).toBeGreaterThan(0);
  });

  it("should cancel uploaded nominee attachment", () => {
    component.onFileUpload(mockFileList, "ID_FRONT");
    component.onCancelFile("ID_FRONT");
    expect(component.attachments.controls.length).toEqual(0);
  });

  [
    {
      govtIdType: "cnic",
      expected: "00000-0000000-0",
    },
    {
      govtIdType: "nicop",
      expected: "000000-0000000-0",
    },
  ].forEach(({ govtIdType, expected }) => {
    it(`should update mask for govtId type - ${govtIdType}`, () => {
      component.govtIdTypeChange(govtIdType);
      expect(component.cnicMask).toEqual(expected);
    });
  });
});
