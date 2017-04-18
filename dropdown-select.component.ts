import { Component, Input, OnChanges, OnInit, forwardRef, HostListener, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type Trigger = 'hover' | 'click';

@Component({
  selector: 'audri-dropdown-select',
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
  @Input() selectedValues = [];
  @Input() items = [];
  @Input() allLabel = 'All';
  @Input() allIcon;
  @Input() labelFn = this._labelFn.bind(this);
  @Input() showAll = true;
  @Input() emptyIsAll= true;
  @Input() emptyValue= -1;
  @Input() openTrigger: Trigger = 'click';
  @Input() closeTrigger: Trigger = 'hover';
  @Input() closeDelay = 500;

  @ViewChild('dropdown') dropdown;

  private allSelected = false;
  private allPartial = false;
  private closeTimer: any;
  private label = this.prompt;
  private options = [];
  private propagateChange = (_: any) => { };

  constructor() { }

  ngOnChanges() {
    this.buildOptions();
  }

  ngOnInit() {
    this.buildOptions();
  }

  isSelected(item) {
    if (this.emptyIsAll && !this.selectedValues.length) {
      return true;
    }
    return this.selectedValues.indexOf(item.value) > -1;
  }

  buildOptions() {
    let allSelected = true;
    let noneSelected = true;
    this.options = this.items.map(item => {
      const selected = this.isSelected(item);
      allSelected = allSelected && selected;
      noneSelected = noneSelected && !selected;
      return {label : item.label, value : item.value, icon : item.icon, selected : selected, item : item};
    });
    this.allSelected = allSelected;
    this.allPartial = !allSelected && !noneSelected;
    this.updateLabel();
  }

  getSelectedItems() {
    return this.options.filter(opt => opt.selected).map(opt => opt.item);
  }

  updateLabel() {
    this.label = (this.labelFn || this._labelFn.bind(this))(this.getSelectedItems(), this.allSelected);
  }

  updateSelectedValues() {
    const selOptions = this.options.filter(opt => opt.selected);
    const allSelected = selOptions.length === this.options.length;
    const noneSelected = !selOptions.length;

    this.selectedValues = selOptions.map(opt => opt.value);
    this.allSelected = allSelected;
    this.allPartial = !allSelected && !noneSelected;

    if (this.emptyIsAll) {
      if (allSelected) {
        this.selectedValues = [];
      } else if (noneSelected) {
        this.selectedValues = [this.emptyValue];
      }
    }
    this.updateLabel();
    this.propagateChange( this.selectedValues || [] );
  }

  public toggleOption(option) {
    option.selected = !option.selected;
    this.updateSelectedValues();
  }

  public toggleAll() {
    const allSelected = !this.allSelected;
    this.options.forEach(option => option.selected = allSelected);
    this.updateSelectedValues();
  }

  public writeValue(selectedValues: any) {
    if (selectedValues) {
      this.selectedValues = selectedValues;
    }
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }
  // not used, used for touch input
  public registerOnTouched() { }


  private _labelFn(selectedItems, allSelected) {
    if (allSelected) {
      return this.allLabel;
    } else if (selectedItems.length === 1) {
      const selectedItem = selectedItems[0];
      return selectedItem.label;
    } else if (selectedItems.length > 1) {
      return `${selectedItems.length} Selected`;
    }
    return this.prompt;
  }

  @HostListener('mouseenter', ['$event.target'])
  private handleMouseEnter(target) {
    clearTimeout(this.closeTimer);
    if (this.openTrigger === 'hover') {
      this.dropdown.nativeElement.focus();
    }
  }

  @HostListener('mouseleave', ['$event.target'])
  private handleMouseLeave(target) {
    if (this.closeTrigger === 'hover') {
      this.closeTimer = setTimeout(() => { this.close(); } , this.closeDelay);
    }
  }

  private close() {
    this.dropdown.nativeElement.blur();
  }

}
