import { CommonModule } from '@angular/common';
import { DropdownSelectComponent } from './dropdown-select.component';
import { NgModule } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export * from './dropdown-select.component';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        DropdownSelectComponent,
    ],
    exports: [
        DropdownSelectComponent
    ],
    entryComponents: [
        DropdownSelectComponent
    ]
})
export class DropdownSelectModule {

}
