/** Flat node with expandable and level information */
import {ITreeNode} from './tree-node.interface';

export class DynamicFlatNode {
  constructor(
    public item: ITreeNode,
    public level: number = 1,
    public expandable: boolean = false,
    public isExpanded: boolean = false,
    public isLoading: boolean = false
  ) {}
}
