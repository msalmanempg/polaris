import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { PaginatedProject } from "@app/interfaces";
import { ProjectService } from "@app/services/project/project.service";
import { of, throwError } from "rxjs";
import { ListProjectComponent } from "./list-project.component";

describe("ListProjectComponent", () => {
  let component: ListProjectComponent;
  let fixture: ComponentFixture<ListProjectComponent>;
  const mockProjects: PaginatedProject = {
    count: 1,
    pageSize: 0,
    pageOffset: 20,
    results: [
      {
        address: "h$90",
        bankDetails: [
          {
            accountNumber: "343",
            accountTitle: "434",
            bankName: "e3",
            createdAt: "2021-03-08T08:04:47.634Z",
            iban: "343",
            swiftCode: "0932",
            branchAddress: "mm alam",
            branchCode: "00722",
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
        units: [],
      },
    ],
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListProjectComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [ProjectService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should fetch and populate list of projects", () => {
    const expected = [
      {
        id: 37,
        name: "projname",
        city: "Catabola",
        completionDate: "11, Mar 2021",
        units: 0,
        availableUnits: "0",
        bookedUnits: "0",
        soldUnits: "0",
      },
    ];
    spyOn(component.projectService, "all").and.returnValue(of(mockProjects));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.projectService.all).toHaveBeenCalled();
    expect(component.projectRows).toEqual(expected);
  });

  it("should throw error while fetching project", () => {
    spyOn(component.projectService, "all").and.returnValue(throwError("error"));
    component.fetchAll();
    expect(component.projectService.all).toHaveBeenCalled();
    expect(component.projectRows).toEqual([]);
  });

  it("should route on update project", () => {
    const projectId = 37;
    spyOn(component.router, "navigate");
    component.onUpdate(projectId);
    expect(component.router.navigate).toHaveBeenCalledWith([`projects/edit/${projectId}`]);
  });

  it("should route on add new porject", () => {
    spyOn(component.router, "navigate");
    component.onClickAddNewProject();
    expect(component.router.navigate).toHaveBeenCalledWith(["/projects/add"]);
  });

  it("should update result on page change", () => {
    spyOn(component, "fetchAll").and.callFake((f: void) => f);
    component.onPageChange({ offset: 0, pageSize: 20 });
    expect(component.fetchAll).toHaveBeenCalled();
  });
});
