import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatatablePagerComponent } from "./datatable-pager.component";

describe("DatatablePagerComponent", () => {
  let component: DatatablePagerComponent;
  let fixture: ComponentFixture<DatatablePagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatatablePagerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatablePagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
