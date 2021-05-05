/* eslint-disable @typescript-eslint/ban-types */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnDestroy,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { noop } from "rxjs";

export interface DropdownOption {
  key: any;
  value: string;
}

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true,
    },
  ],
})
export class DropdownComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() placeholder = "Search a Value";

  @Input() label = "Select";

  @Input() searchable = true;

  @Input() required = false;

  @Output() inputChange = new EventEmitter<string>();

  @Output() selectedValueChange = new EventEmitter<any>();

  public displayedDropdownOptions: DropdownOption[];
  public currentValue: string;
  public isSearchable: boolean;
  public selectedValue: any;

  onChange: Function = noop;

  onTouched: Function = noop;

  private dropdownOptions: DropdownOption[];

  set value(newValue: any) {
    this.selectedValue = newValue;
    this.selectedValueChange.emit(this.selectedValue);
    this.onChange(newValue);
  }

  get value(): any {
    return this.selectedValue;
  }

  @Input()
  set options(newOptions: DropdownOption[]) {
    this.dropdownOptions = newOptions;
    this.displayedDropdownOptions = this.dropdownOptions;
  }

  get options(): DropdownOption[] {
    return this.dropdownOptions;
  }

  public inputValueChange() {
    this.displayedDropdownOptions = this.filter(this.currentValue);
  }

  ngOnInit() {}

  resetInput(event: Event): void {
    this.inputChange.emit(this.currentValue);
    event.stopPropagation();
  }

  ngOnDestroy(): void {}

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  private filter(value: string): DropdownOption[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.value.toLowerCase().includes(filterValue));
  }
}
