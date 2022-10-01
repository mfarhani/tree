import {NgModule} from '@angular/core';
import {ProjectTreeComponent} from './project-tree/project-tree.component';
import {ProjectRoutingModule} from './project-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProjectTreeComponent
  ],
  imports: [ProjectRoutingModule, SharedModule],
  exports: []
})
export class ProjectModule {
}
