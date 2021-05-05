import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UnitsImportSuccessComponent } from "./units-import-success.component";

describe("UnitsImportSuccessComponent", () => {
  let component: UnitsImportSuccessComponent;
  let fixture: ComponentFixture<UnitsImportSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnitsImportSuccessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsImportSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
