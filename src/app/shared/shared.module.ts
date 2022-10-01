import {NgModule} from '@angular/core';
import {SharedLibModule} from './shared-lib/shared-lib.module';
import {SharedCommonModule} from './shared-common/shared-common.module';
import {ComponentBaseModule} from './component-base/component-base.module';

@NgModule({
  imports: [SharedLibModule, SharedCommonModule, ComponentBaseModule],
  exports: [SharedLibModule, SharedCommonModule, ComponentBaseModule]
})
export class SharedModule {

}
