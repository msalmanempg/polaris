/* eslint-disable @angular-eslint/directive-class-suffix */
/* eslint-disable @angular-eslint/directive-selector */
import { Directive, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DropdownOption } from "./dropdown.component";

@Directive({
  selector: "app-dropdown",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => DropdownComponentMock),
    },
  ],
})
export class DropdownComponentMock implements ControlValueAccessor {
  @Input() options: DropdownOption[];

  @Input() isSearchable = false;

  @Input() placeholder: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  writeValue(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerOnChange(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registerOnTouched(): void {}
}
