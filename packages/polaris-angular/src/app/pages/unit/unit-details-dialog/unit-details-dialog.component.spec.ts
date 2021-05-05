import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UnitDetailsDialogComponent } from "./unit-details-dialog.component";

const dialogData = {
  unitRow: {
    unitNumber: "unit-123",
    location: "Block A, Street 5",
    type: "residential",
    bed: 3,
    basePrice: 5000000,
    publishedPrice: 5500000,
    netArea: 1250,
    grossArea: 1250,
    status: "available",
    project: "project",
    completionDate: new Date("2021-02-19T05:20:07.269Z"),
  },
};
describe("UnitDetailsDialogComponent", () => {
  let component: UnitDetailsDialogComponent;
  let fixture: ComponentFixture<UnitDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitDetailsDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: jasmine.createSpy("MatDialogRef") },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
