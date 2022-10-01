import {NgModule} from '@angular/core';
import {TreeModule} from './tree/tree.module';

@NgModule({
  imports: [TreeModule],
  exports: [TreeModule]
})
export class SharedCommonModule {

}
