import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FileUploadComponent } from "./file-upload.component";

describe("FileUploadComponent", () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  const fileName = "id_Card.png";
  const mockFile = new File([""], fileName, { type: "png" });
  const mockEvt = { target: { files: [mockFile] } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should udpate file name on file change", () => {
    component.onFileChange(mockEvt as any);
    expect(component.value).toEqual(fileName);
  });

  it("should cancel uplaoded file", () => {
    component.onFileChange(mockEvt as any);
    component.onCancelClick();
    expect(component.value).toEqual("");
  });
});
