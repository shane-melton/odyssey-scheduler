import {
  AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';
import {
  ControlValueAccessor, NG_VALUE_ACCESSOR
} from '@angular/forms';

import { FormSelect } from 'materialize-css';
import * as _ from 'underscore';

/**
 * Interface for describing select options that will be rendered in the Materailize Select element
 */
export interface SelectOption {
  /**
   * The value of the select option
   */
  value: any;

  /**
   * The text that will be displayed in the select option
   */
  text: string;
}

@Component({
  selector: 'app-material-select',
  templateUrl: './material-select.component.html',
  styleUrls: ['./material-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaterialSelectComponent),
      multi: true
    }
  ]
})
export class MaterialSelectComponent implements AfterViewInit, OnChanges, ControlValueAccessor {
  /**
   * The options for this select component, the component will be re-rendered if these options change
   */
  @Input() options: SelectOption[];

  /**
   * The label for this select component
   */
  @Input() label: string;

  /**
   * The default select option that will be disabled when the selected value is null
   */
  @Input() placeHolder = 'Select something';

  /**
   * Emits the selected value whenever the selected value changes
   * @type {EventEmitter<any>}
   */
  @Output() change = new EventEmitter<any>();

  @ViewChild('select') selectRef: ElementRef;

  private _selectedValue: any;
  private _propagateChange = (__: any) => {}

  @Output() selectedChange = new EventEmitter<any>();

  @Input()
  get selected() {
    return this._selectedValue;
  }

  set selected(val) {
    this._selectedValue = val;
    this._propagateChange(this.selected);
    this.change.emit(this.selected);
    this.selectedChange.emit(this.selected);
  }

  constructor() {
  }

  writeValue(value: any): void {
    this._selectedValue = value;
    this.initSelect();
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  trackOptions(index: number, item: SelectOption) {
    if (item) {
      return item.value;
    }
    return index;
  }

  /**
   * Initializes the Materialize FormSelect after a delay of 0ms
   */
  private initSelect() {
    setTimeout(() => {
      FormSelect.init(this.selectRef.nativeElement, {});
    });
  }

  ngAfterViewInit(): void {
    this.initSelect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-initialize the form select if the select options have changed
    if (!_.isEqual(changes.options.previousValue, changes.options.currentValue)) {
      this.initSelect();
    }
  }

}
