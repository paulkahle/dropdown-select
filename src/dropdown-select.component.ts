import { Component, Input, OnChanges, OnInit, forwardRef, HostListener, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type Trigger = 'hover' | 'click';
type EmptyValueMode = 'none' | 'all';

/**
 * DropdownSelectComponent
 *
 * Multi-select dropdown component with support for selecting and deselecting all.
 * Implements ControlValueAccessor for compatibility with Angular Forms API
 */

@Component({
  selector: 'supre-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSelectComponent),
      multi: true
    }
  ]
})
export class DropdownSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  @Input() prompt = 'Select';
  @Input() value = [];
  @Input() options = [];
  @Input() allLabel = 'All';
  @Input() allIcon;
  @Input() labelFn = this._labelFn.bind(this);
  @Input() showAllOption = true;
  @Input() emptyValueMode: EmptyValueMode = 'none';
  @Input() noneSelectedValue: any = -1;
  @Input() openTrigger: Trigger = 'click';
  @Input() closeTrigger: Trigger = 'hover';
  @Input() closeDelay = 500;

  @ViewChild('dropdown') dropdown;

  private allSelected = false;
  private allPartial = false;
  private closeTimer: any;
  private label = this.prompt;
  private internalOptions = [];
  private isOpen = false;

  private propagateChange = (_: any) => { };

  constructor() { }

  /**
   * ngOnInit
   * Build option list on init
   *
   * @memberOf DropdownMenuComponent
   */
  ngOnInit() {
    this.buildinternalOptions();
  }

  /**
   * ngOnInit
   * Build option list after any changes to the input
   *
   * @memberOf DropdownMenuComponent
   */
  ngOnChanges() {
    this.buildinternalOptions();
  }


  /**
   * buildinternalOptions
   * builds list of internalOptions for dropdown
   *
   * @memberOf DropdownMenuComponent
   */
  private buildinternalOptions() {
    let allSelected = true;
    let noneSelected = true;
    this.internalOptions = this.options.map(item => {
      const selected = this.isSelected(item);
      allSelected = allSelected && selected;
      noneSelected = noneSelected && !selected;
      return {text : item.text, value : item.value, icon : item.icon, selected : selected, item : item};
    });
    this.allSelected = allSelected;
    this.allPartial = !allSelected && !noneSelected;
    this.updateLabel();
  }

  /**
   * getSelectedOptions
   * returns array of the selected options
   *
   * @memberOf DropdownMenuComponent
   */
  public getSelectedOptions() {
    return this.internalOptions.filter(opt => opt.selected).map(opt => opt.item);
  }

  /**
   * isSelected
   * returns true if item is selected
   *
   * @memberOf DropdownMenuComponent
   */
  private isSelected(item) {
    if (this.emptyValueMode === 'all' && !this.value.length) {
      return true;
    }
    return this.value.indexOf(item.value) > -1;
  }

  /**
   * updateLabel
   * updates label using labelFn
   *
   * @memberOf DropdownMenuComponent
   */
  private updateLabel() {
    this.label = (this.labelFn || this._labelFn.bind(this))(this.getSelectedOptions(), this.allSelected);
  }

  /**
   * updateValue
   * updates selected values after change
   *
   * @memberOf DropdownMenuComponent
   */
  private updateValue() {
    const selinternalOptions = this.internalOptions.filter(opt => opt.selected);
    const allSelected = selinternalOptions.length === this.internalOptions.length;
    const noneSelected = !selinternalOptions.length;

    this.value = selinternalOptions.map(opt => opt.value);
    this.allSelected = allSelected;
    this.allPartial = !allSelected && !noneSelected;

    if (this.emptyValueMode === 'all') {
      if (allSelected) {
        this.value = [];
      } else if (noneSelected) {
        this.value = [this.noneSelectedValue];
      }
    }
    this.updateLabel();
    this.propagateChange( this.value || [] );
  }


  /**
   * toggleOption
   * toggles selection of a specific option
   *
   * @memberOf DropdownMenuComponent
   */
  private toggleOption(option) {
    option.selected = !option.selected;
    this.updateValue();
  }

  /**
   * toggleAll
   * toggles selection of the "all" option
   *
   * @memberOf DropdownMenuComponent
   */
  private toggleAll() {
    const allSelected = !this.allSelected;
    this.internalOptions.forEach(option => option.selected = allSelected);
    this.updateValue();
  }

  /**
   * _labelFn
   * default label function used if none is supplied
   *
   * @memberOf DropdownMenuComponent
   */
  private _labelFn(selectedOptions, allSelected) {
    if (allSelected) {
      return this.allLabel;
    } else if (selectedOptions.length === 1) {
      const selectedItem = selectedOptions[0];
      return selectedItem.text;
    } else if (selectedOptions.length > 1) {
      return `${selectedOptions.length} Selected`;
    }
    return this.prompt;
  }

  /**
   * handleMouseEnter
   * open dropdown on hover if openTrigger is'hover'
   *
   * @memberOf DropdownMenuComponent
   */
  @HostListener('mouseenter', ['$event.target'])
  private handleMouseEnter(target) {
    clearTimeout(this.closeTimer);
    if (this.openTrigger === 'hover') {
      this.isOpen = true;
      this.dropdown.nativeElement.focus();
    }
  }

  /**
   * handleMouseLeave
   * close dropdown on hover off if closeTrigger is'hover'
   * there is a timed delay before the dropdown closes.
   * the close will be cancelled if user hovers back over the dropdown
   * before this time is reached
   *
   * @memberOf DropdownMenuComponent
   */
  @HostListener('mouseleave', ['$event.target'])
  private handleMouseLeave(target) {
    if (this.closeTrigger === 'hover') {
      this.closeTimer = setTimeout(() => { this.close(); } , this.closeDelay);
    }
  }

  /**
   * handleButtonClick
   * closes dropdown if the user clicks the button when the dropdown is already open
   *
   * @memberOf DropdownMenuComponent
   */
  private handleButtonClick() {
    if (this.isOpen) {
      return this.close();
    }
    this.isOpen = true;
  }

  /**
   * close
   * closes the dropdown
   *
   * @memberOf DropdownMenuComponent
   */
  private close() {
    this.dropdown.nativeElement.blur();
    this.isOpen = false;
  }

  /**
   * ControlValueAccessor Implementation
   * for Angular Form API
   *
   */
  public writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  // not used, used for touch input
  public registerOnTouched() { }

}
