import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Project } from "@app/interfaces";
import { ProjectService } from "@app/services/project/project.service";
import { DropdownComponentMock } from "@app/shared/dropdown/dropdown.component.mock";
import { of } from "rxjs";
import { SelectProjectComponent } from "./select-project.component";

describe("SelectProjectComponent", () => {
  let component: SelectProjectComponent;
  let fixture: ComponentFixture<SelectProjectComponent>;
  let projectService: jasmine.SpyObj<ProjectService>;

  beforeEach(async () => {
    projectService = jasmine.createSpyObj("ProjectService", ["all"]);
    projectService.all.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [SelectProjectComponent, DropdownComponentMock],
      imports: [HttpClientTestingModule],
      providers: [{ provide: ProjectService, useValue: projectService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should get projects", () => {
    projectService.all.and.returnValue(
      of([
        { id: 1, name: "project 1" },
        { id: 2, name: "project 2" },
      ] as Project[])
    );

    component.ngOnInit();

    expect(component.projects).toBeTruthy();
    expect(component.projects).toEqual([
      {
        key: 1,
        value: "project 1",
      },
      {
        key: 2,
        value: "project 2",
      },
    ]);
  });

  it("should include all projects option", () => {
    projectService.all.and.returnValue(of([{ id: 1, name: "project 1" }] as Project[]));

    component.includeAllOption = true;

    component.ngOnInit();

    expect(component.projects).toBeTruthy();
    expect(component.projects).toEqual([
      {
        key: null,
        value: "All",
      },
      {
        key: 1,
        value: "project 1",
      },
    ]);
  });

  it("should set value and call onChange", () => {
    spyOn(component, "onChange");

    const newValue = [1, 2, 3];
    component.value = [1, 2, 3];

    expect(component.value).toEqual(newValue);
    expect(component.onChange).toHaveBeenCalledWith(newValue);
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
    const value = [1, 2];
    component.writeValue(value);
    expect(component.value).toEqual(value);
  });
});
