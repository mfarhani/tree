import {Observable} from 'rxjs';
import {ITreeNode} from './tree-node.interface';
import {ID} from '../../../core/base-models/base-model.interface';
import {DynamicFlatNode} from './dynamic-flat-node';

export interface ITreeConfig {
  titleKey?: string;
  filterLevelEndpoint?: string;
  entityName?: string;
  actions?: IActions;
  link?: string;
  treeWidth?: string;
  searchInputLabel?: string;
  getTreeDataCallback: GetTreeDataCallback;
  getTreeSearchDataCallback: GetTreeSearchDataCallback;
  treeAddCallBack?: TreeAddCallBack;
  treeDeleteCallBack?: TreeDeleteCallBack;
  treeEditCallBack?: TreeEditCallBack;
  treeSelectCallBack?: TreeSelectCallBack;
  customComponent?: any;
  hasCrudOperation?: boolean;
  canAddNode?: boolean;
  canEditNode?: boolean;
  canDeleteNode?: boolean;
  canSelectNode?: boolean;
  parentIdKey?: string;
}

interface IActions {
  createRoot?: boolean;
}

export type GetTreeDataCallback = (
  node?: DynamicFlatNode
) => Observable<ITreeNode[]>;
export type GetTreeSearchDataCallback = (
  value: string
) => Observable<ITreeNode[]>;
export type TreeAddCallBack = (node?: ITreeNode) => Observable<ITreeNode>;
export type TreeDeleteCallBack = (
  id?: ID
) => Observable<ITreeNode>;
export type TreeEditCallBack = (node?: ITreeNode) => Observable<ITreeNode>;
export type TreeSelectCallBack = (nodeList?: ITreeNode[]) => void;
