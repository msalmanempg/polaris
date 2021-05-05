import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MenuListItemComponent } from "./menu-list-item.component";
import { Component, ViewChild } from "@angular/core";
import { NavigationItem } from "@app/interfaces/navigation.interface";

describe("MenuListItemComponent", () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuListItemComponent, TestHostComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should click on item", () => {
    spyOn(component.componentUnderTestComponent.router, "navigate");
    const bannerElement: HTMLElement = fixture.nativeElement;
    const menuItem = bannerElement.querySelector("a");
    menuItem.click();
  });

  it("should expand child item on click", () => {
    spyOn(component.componentUnderTestComponent.router, "navigate");
    component.componentUnderTestComponent.item = {
      displayName: "test route",
      route: "test",
      children: [
        {
          displayName: "child route",
          route: "test child",
        },
      ],
    };
    fixture.detectChanges();

    const bannerElement: HTMLElement = fixture.nativeElement;
    const link = bannerElement.querySelector("a");
    link.click();
  });
  @Component({
    selector: "app-host-component",
    template: " <app-menu-list-item item=\"menuitem\"></app-menu-list-item> ",
  })
  class TestHostComponent {
    @ViewChild(MenuListItemComponent)
    public componentUnderTestComponent: MenuListItemComponent;
    menuitem: NavigationItem = {
      displayName: "test route",
      route: "test",
    };
  }
});
