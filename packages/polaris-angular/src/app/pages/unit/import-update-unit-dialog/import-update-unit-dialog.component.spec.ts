import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ImportUpdateUnitDialogComponent } from "./import-update-unit-dialog.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { of, throwError } from "rxjs";
import * as FileSaver from "file-saver";

describe("ImportUpdateUnitDialogComponent", () => {
  let component: ImportUpdateUnitDialogComponent;
  let fixture: ComponentFixture<ImportUpdateUnitDialogComponent>;
  const selectPorjectId = 1;
  let mockFile: File;

  beforeEach(async () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    mockFile = new File([""], "Zameen Opal - SMS Plan Site Event.xlsx", { type: fileType });
    await TestBed.configureTestingModule({
      declarations: [ImportUpdateUnitDialogComponent],
      providers: [
        { provide: MatDialog, useValue: jasmine.createSpy("MatDialog") },
        { provide: MatDialogRef, useValue: jasmine.createSpy("MatDialogRef") },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportUpdateUnitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should create units on upload", () => {
    const units = [
      {
        basePrice: 100000,
        bed: 1,
        completionDate: "2020-03-12T00:00:00.000Z",
        createdAt: "2021-03-18T11:28:18.967Z",
        grossArea: 230,
        id: 4,
        location: "DHA",
        netArea: 200,
        projectId: 1,
        publishedPrice: 120000,
        status: "available",
        type: "residential",
        unitNumber: "1",
        updatedAt: "2021-03-18T11:28:18.967Z",
      },
      {
        basePrice: 100000,
        bed: 1,
        completionDate: "2020-03-13T00:00:00.000Z",
        createdAt: "2021-03-18T11:28:18.968Z",
        grossArea: 230,
        id: 5,
        location: "DHA",
        netArea: 200,
        projectId: 1,
        publishedPrice: 120000,
        status: "available",
        type: "residential",
        unitNumber: "2",
        updatedAt: "2021-03-22T14:56:33.368Z",
      },
    ];
    spyOn(component.unitService, "saveUnits").and.returnValue(of(units));
    component.selectedProjectId = selectPorjectId;
    component.importedInventoryFile = mockFile;
    component.onSaveUnits();
    fixture.detectChanges();

    expect(component.unitService.saveUnits).toHaveBeenCalled();
    expect(component.isImportCompleted).toBeTrue();
    expect(component.rowsUpdated).toEqual(1);
    expect(component.rowsCreated).toEqual(1);
  });

  it("should throw error while importing units", () => {
    spyOn(component.unitService, "saveUnits").and.returnValue(
      throwError({ error: { error: "empty file" } })
    );
    component.selectedProjectId = selectPorjectId;
    component.importedInventoryFile = mockFile;
    component.onSaveUnits();
    fixture.detectChanges();

    expect(component.unitService.saveUnits).toHaveBeenCalled();
    expect(component.errorMessage).toEqual("empty file");
  });

  it("should throw invalid value error while importing units", () => {
    spyOn(component.unitService, "saveUnits").and.returnValue(
      throwError({
        error: {
          errors: [
            {
              name: "InvalidRequestData",
              message: "Invalid Value",
              param: "units[1].location",
              location: "body",
            },
            {
              name: "InvalidRequestData",
              message: "Invalid Value",
              param: "units[1].type",
              location: "body",
            },
          ],
        },
      })
    );
    component.selectedProjectId = selectPorjectId;
    component.importedInventoryFile = mockFile;
    component.onSaveUnits();
    fixture.detectChanges();

    expect(component.unitService.saveUnits).toHaveBeenCalled();
    expect(component.errorInfo).toBeDefined();
  });

  it("should not call onSaveUnits when project not selected", () => {
    spyOn(component.unitService, "saveUnits").and.returnValue(of({}));
    component.onSaveUnits();
    fixture.detectChanges();

    expect(component.unitService.saveUnits).not.toHaveBeenCalled();
    expect(component.isImportCompleted).toBeUndefined();
  });

  it("should uploaded file ", () => {
    const mockEvt = { target: { files: [mockFile] } };
    component.onUpload(mockEvt as any);
    fixture.detectChanges();

    expect(component.importedInventoryFile).toEqual(mockFile);
  });

  it("should export inventory ", () => {
    const fileUrl = "https://polaris-public.s3.amazonaws.com/41ebdce59f15aaddcca6cf4f692a41a6.xlsx";
    spyOn(component.unitService, "exportUnits").and.returnValue(of(fileUrl));
    spyOn(FileSaver, "saveAs");
    component.selectedProjectId = selectPorjectId;
    component.downloadInventory();
    fixture.detectChanges();

    expect(component.unitService.exportUnits).toHaveBeenCalled();
    expect(FileSaver.saveAs).toHaveBeenCalled();
  });

  it("should update error if exportUnits fails ", () => {
    spyOn(component.unitService, "exportUnits").and.returnValue(throwError("Error"));
    component.selectedProjectId = selectPorjectId;
    component.downloadInventory();
    fixture.detectChanges();

    expect(component.unitService.exportUnits).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });
});
