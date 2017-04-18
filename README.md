# Suprematism Dropdown Select

An Angular 2 dropdown selection component.


#### Installation
```bash
npm i -S CINBCUniversal/suprematism-dropdown-menu
```
Until it is published to npm, point to github. A consequence of this is that
built files must be checked-in. When we publish to npm with `npm publish`,
there is a prehook to build the files and a posthook to delete them
(so only source files are saved in git). For now, after doing development,
we must manually run the publish prehook and save the files.


#### View
- [Hosted on Github Pages](https://cinbcuniversal.github.io/suprematism-dropdown-select/)
- Run the example locally with `npm run example`


## Component

#### `supre-dropdown-select`
A muti-select dropdown with built-in functionality for selecting and deselecting all options.  The all option is completely managed by the component itself.</p>


#### Options
- `prompt: string`: Label displayed when nothing is selected .
- `showAllOption: boolean`: Include an option for toggling all selected options on/off.
- `allLabel: string`: Label for the "all" option.  
- `allIcon: string`: Icon class for all option.
- `options: Array<any>`: Array of options.  Each option should have "text" and "value" properties and an optional "icon" property.  
- `value: Array<any>`: Array of selected values corresponding to the "value" property of the options array.
- `labelFn: function`: A custom label function for the dropdown button.
  It accepts two parameters: 1. `selectedoptions` : array of selected options, 2. `allSelected` : boolean value if all are selected.
- `openTrigger: Trigger`: Open dropdown on either `click` or `hover`.
- `closeTrigger: Trigger`: Close dropdown on either `click` or `hover`.
- `closeDelay: number`: Timed delay in ms before dropdown is closed when hovering off.
- `emptyValueMode`: Either `none` or `all`.  Determines how to treat an empty value. (see below).
- `noneSelectedValue`: Value that represents no items selected when `emptyValueMode="all"` and the empty array means all.

#### Treatment of empty value
Sometimes you may want to treat an empty value as "All". Setting `emptyValueMode="all"` will show all selected if `value` is empty
and set value to an empty array when all options are selected. If no options are selected `value` will contain a single value determined by the `noneSelectedValue` property which defaults to -1.


#### Example
```
<supre-dropdown-select
  emptyValueMode="all"
  noneSelectedValue="none"
  allLabel="All Things"
  prompt="Select Thing"
  [options]="availableThings"
  [value]="selectedThings"
  >
</supre-dropdown-select>
```
