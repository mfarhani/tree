import {ITreeConfig} from '../../shared-common/tree/tree.config';
import {ITreeNode} from '../../shared-common/tree/tree-node.interface';
import {IBaseModel} from '../../../core/base-models/base-model.interface';
import {DynamicFlatNode} from '../../shared-common/tree/dynamic-flat-node';

export abstract class TreeBaseComponent<T extends IBaseModel> {
  public treeConfig: ITreeConfig;

  getTreeData(node?: DynamicFlatNode): any {
  }

  getTreeSearchData(value: string): any {
  }

  editNode(node?: ITreeNode): any {
  }

  deleteNode(id?: number): any {
  }

  addNode(): any {
  }

  protected constructor(config: ITreeConfig) {
    this.treeConfig = config;
  }
}
