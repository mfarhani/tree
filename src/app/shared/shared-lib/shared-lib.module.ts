import {NgModule} from '@angular/core';
import {AngularMaterialModule} from './angular-material/angular-material.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [AngularMaterialModule, FormsModule],
  exports: [AngularMaterialModule, FormsModule]
})
export class SharedLibModule {

}
