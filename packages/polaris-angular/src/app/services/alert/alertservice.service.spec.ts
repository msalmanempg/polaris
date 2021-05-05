import { TestBed } from "@angular/core/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AlertService } from "./alertservice.service";
import { AlertTypes } from "@app/types/alert.type";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("AlertserviceService", () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, BrowserAnimationsModule],
    });
    service = TestBed.inject(AlertService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  [
    {
      testId: 1,
      message: "added successfuly !!",
      type: AlertTypes.success,
      expected: "alert-success",
    },
    {
      testId: 2,
      message: "something went wrong !!",
      type: AlertTypes.danger,
      expected: "alert-danger",
    },
    { testId: 3, message: " ", type: AlertTypes.danger, expected: "alert-danger" },
  ].forEach(({ testId, message, type, expected }) => {
    it(`should generate toast type - ${testId}`, () => {
      service.showAlert(message, type);
      expect(service.snakbarConfig.panelClass).toContain(expected);
    });
  });
});
