import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NavSideListComponent } from "./nav-side-list.component";

describe("NavSideListComponent", () => {
  let component: NavSideListComponent;
  let fixture: ComponentFixture<NavSideListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavSideListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavSideListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
