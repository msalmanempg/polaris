import { unitStatus } from ".prisma/client";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { PaginatedUnit, Unit } from "@app/interfaces/unit.interface";
import { UnitService } from "@app/services/unit/unit.service";
import { of, throwError } from "rxjs";
import { UnitComponent } from "./unit.component";
import { UnitsDatatableComponentMock } from "./units-datatable/units-datatable.component.mock";
class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true),
    };
  }

  closeAll() {}
}

describe("UnitComponent", () => {
  let component: UnitComponent;
  let fixture: ComponentFixture<UnitComponent>;
  let unitServiceMock: jasmine.SpyObj<UnitService>;

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
    unitServiceMock = jasmine.createSpyObj("UnitService", ["getAllUnits"]);
    (unitServiceMock.getAllUnits as jasmine.Spy).and.returnValue(
      of(({
        results: unitsData,
        count: unitsData.length,
        pageSize: 20,
        pageOffset: 0,
        stats: [
          {
            status: unitStatus.available,
            count: 1,
          },
        ],
      } as unknown) as PaginatedUnit)
    );

    await TestBed.configureTestingModule({
      declarations: [UnitComponent, UnitsDatatableComponentMock, MatIcon],
      providers: [
        { provide: UnitService, useValue: unitServiceMock },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: MatIcon, useValue: jasmine.createSpy("MatIcon") },
        { provide: MatDialogRef, useValue: jasmine.createSpy("MatDialogRef") },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get units on init", () => {
    component.ngOnInit();

    expect(component.units).toEqual(unitsData);
    expect(component.count).toEqual(unitsData.length);
  });

  it("should throw error while getting units", () => {
    (unitServiceMock.getAllUnits as jasmine.Spy).and.returnValue(throwError("error"));

    component.ngOnInit();

    expect(unitServiceMock.getAllUnits).toHaveBeenCalled();
    expect(component.units).toEqual([]);
  });

  it("should update page size and page offset on page change", () => {
    const pageSize = 50;
    const offset = 20;

    component.onPageOffsetChange({ offset, pageSize });

    expect(unitServiceMock.getAllUnits).toHaveBeenCalled();
    expect(unitServiceMock.getAllUnits).toHaveBeenCalledWith({
      pageOffset: offset,
      pageSize,
      projectId: null,
      status: null,
      includeStats: true,
    });
    expect(component.pageSize).toEqual(pageSize);
    expect(component.pageOffset).toEqual(offset);
  });

  it("should update page size on page size change", () => {
    const pageSize = 10;

    component.onPageSizeChange(pageSize);

    expect(unitServiceMock.getAllUnits).toHaveBeenCalled();
    expect(unitServiceMock.getAllUnits).toHaveBeenCalledWith({
      pageOffset: 0,
      pageSize,
      projectId: null,
      status: null,
      includeStats: true,
    });
    expect(component.pageSize).toEqual(pageSize);
    expect(component.pageOffset).toEqual(0);
  });

  it("should open unit import dialog", () => {
    spyOn(component.dialog, "open").and.callThrough();
    component.onClickImportAndUpdateUnitsButton();
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it("should get units on project change", () => {
    component.onProjectIdChange();

    expect(unitServiceMock.getAllUnits).toHaveBeenCalled();
  });

  it("should get units on status change", () => {
    const changeEvent = {
      index: 0,
    } as MatTabChangeEvent;

    component.onClickStatusTab(changeEvent);

    expect(component.status).toEqual(unitStatus.booked);
    expect(unitServiceMock.getAllUnits).toHaveBeenCalled();
  });

  it("should reset pagination", () => {
    component.pageOffset = 50;
    component.pageSize = 50;

    component.resetPagination();

    expect(component.pageOffset).toEqual(0);
    expect(component.pageSize).toEqual(20);
  });

  it("should have null status on all tab", () => {
    const changeEvent = {
      index: 3,
    } as MatTabChangeEvent;

    component.onClickStatusTab(changeEvent);

    expect(component.status).toEqual(null);
    expect(unitServiceMock.getAllUnits).toHaveBeenCalled();
  });
});
