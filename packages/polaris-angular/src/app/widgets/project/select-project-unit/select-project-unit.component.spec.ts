import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Unit } from "@app/interfaces/unit.interface";
import { UnitService } from "@app/services/unit/unit.service";
import { DropdownComponentMock } from "@app/shared/dropdown/dropdown.component.mock";
import { of } from "rxjs";
import { SelectProjectUnitComponent } from "./select-project-unit.component";

describe("SelectProjectUnitComponent", () => {
  let component: SelectProjectUnitComponent;
  let fixture: ComponentFixture<SelectProjectUnitComponent>;
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
    (unitServiceMock.getAllUnits as jasmine.Spy).and.returnValue(of(unitsData));
    await TestBed.configureTestingModule({
      declarations: [SelectProjectUnitComponent, DropdownComponentMock],
      providers: [{ provide: UnitService, useValue: unitServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProjectUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get units by project id", () => {
    const projectId = 1;
    component.projectId = projectId;

    expect(unitServiceMock.getAllUnits).toHaveBeenCalled();
  });

  it("should set value and call onChange", () => {
    spyOn(component, "onChange");

    const newValue = 1;
    component.value = 1;

    expect(component.value).toEqual(newValue);
    expect(component.onChange).toHaveBeenCalledWith(newValue);
  });

  it("should include all units option", () => {
    unitServiceMock.getAllUnits.and.returnValue(of([{ id: 1, unitNumber: "unit 1" }] as Unit[]));

    component.projectId = 1;
    component.includeAllOption = true;

    component.getUnitsByProject();

    expect(component.projectUnits).toBeTruthy();
    expect(component.projectUnits).toEqual([
      {
        key: null,
        value: "All",
      },
      {
        key: 1,
        value: "unit 1",
      },
    ]);
  });

  it("should register onChange function", () => {
    const fn = () => 1;
    component.registerOnChange(fn);
    expect(component.onChange).toEqual(fn);
  });

  it("should register onTouched function", () => {
    const fn = () => 1;
    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);
  });

  it("should write value", () => {
    const value = 1;
    component.writeValue(value);
    expect(component.value).toEqual(value);
  });
});
