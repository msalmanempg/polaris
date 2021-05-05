import { TitleCasePipe } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog } from "@angular/material/dialog";
import { RouterTestingModule } from "@angular/router/testing";
import { Unit } from "@app/interfaces/unit.interface";
import { UnitRow, UnitsDatatableComponent } from "./units-datatable.component";

describe("UnitsDatatableComponent", () => {
  let component: UnitsDatatableComponent;
  let fixture: ComponentFixture<UnitsDatatableComponent>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;

  const unitsData: Unit[] = [
    {
      unitNumber: "unit-123",
      location: "Block A, Street 5",
      type: "residential",
      bed: 3,
      basePrice: 5000000,
      publishedPrice: 5500000,
      netArea: 1250,
      grossArea: 1250,
      status: "available",
      projectId: 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Project: {
        name: "project",
      },
      completionDate: new Date("2021-02-19T05:20:07.269Z"),
    },
  ];

  beforeEach(async () => {
    matDialogMock = jasmine.createSpyObj("MatDialog", ["open"]);

    await TestBed.configureTestingModule({
      declarations: [UnitsDatatableComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [TitleCasePipe, { provide: MatDialog, useValue: matDialogMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get column configuration", () => {
    const columns = component.getColumnConfiguration();

    expect(columns).toBeTruthy();
    expect(columns).toEqual(jasmine.any(Array));
  });

  it("should get mapped units", () => {
    const unitRows: UnitRow[] = [
      {
        unitNumber: "unit-123",
        location: "Block A, Street 5",
        type: "Residential",
        bed: 3,
        basePrice: "5,000,000",
        publishedPrice: "5,500,000",
        netArea: "1,250",
        grossArea: "1,250",
        status: "Available",
        projectId: 1,
        project: "project",
        completionDate: "19, Feb 2021",
      },
    ];

    component.units = unitsData;

    expect(component.rows).toEqual(unitRows);
  });
});
