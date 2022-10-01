import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {TreeComponent} from './tree.component';
import {SharedLibModule} from '../../shared-lib/shared-lib.module';
import {TreeNodeActionsComponent} from './tree-node-actions/tree-node-actions.component';


@NgModule({
  declarations: [TreeComponent, TreeNodeActionsComponent],
  imports: [CommonModule, SharedLibModule],
  exports: [TreeComponent]
})
export class TreeModule {
}
