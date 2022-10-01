import {Component} from '@angular/core';
import {TreeBaseComponent} from '../../../shared/component-base/tree-base/tree-base.component';
import {ITreeConfig} from '../../../shared/shared-common/tree/tree.config';
import {ProjectListService} from '../services/project-list.service';
import {DynamicFlatNode} from '../../../shared/shared-common/tree/dynamic-flat-node';
import {IProject} from '../models/project.interface';

@Component({
  selector: 'app-project-tree',
  templateUrl: '../../../shared/component-base/tree-base/tree-base.component.html'
})
export class ProjectTreeComponent extends TreeBaseComponent<any> {
  private treeData: IProject[] = [];

  constructor(private projectService: ProjectListService) {
    const config: ITreeConfig = {
      titleKey: 'name',
      getTreeDataCallback: (node?: DynamicFlatNode) => this.getTreeData(node),
      getTreeSearchDataCallback: (value: string) => this.getTreeSearchData(value)
    };
    super(config);
  }

  override getTreeData(node?: DynamicFlatNode): any {
    return this.projectService.read(node);
  }

  override getTreeSearchData(value: string): any {
    return this.projectService.read(undefined, value);
  }

}
