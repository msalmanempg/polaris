import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { DropdownComponent } from "./dropdown.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { By } from "@angular/platform-browser";
describe("DropdownComponent", () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  const options = [
    {
      key: "1",
      value: "Test",
    },
    {
      key: "2",
      value: "Testing",
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownComponent],
      imports: [MatAutocompleteModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize label", () => {
    component.label = "Test";

    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css("mat-label")).nativeElement;

    expect(element.textContent.trim()).toEqual(component.label);
  });

  it("should initialize options", fakeAsync(() => {
    component.label = "Testing";
    component.placeholder = "Select a value";
    component.options = options;
    fixture.detectChanges();

    const matSelect = fixture.debugElement.query(By.css("mat-select")).nativeElement;
    matSelect.click();

    tick();
    fixture.detectChanges();

    const element = fixture.debugElement.queryAll(By.css("mat-option"));
    expect(element).not.toBeNull();
  }));

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
