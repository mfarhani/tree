import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedLibModule} from '../shared-lib/shared-lib.module';
import {SharedCommonModule} from '../shared-common/shared-common.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedLibModule,
    SharedCommonModule
  ],
  exports: []
})
export class ComponentBaseModule {

}
