import {ITreeNode} from './tree-node.interface';

export class TreeNode implements ITreeNode {
  public label?: string;
  public id?: number;
  public value?: string;
  public parentId?: number;
  public parentName?: string;
  public key?: string;
  public level?: number;
  public expandable?: boolean;
  public catStatusId?: number;
  public code?: string;
  public createdBy?: string;
  public createdDate?: Date;
  public nameEn?: string;
  public nameFa?: string;
  public version?: number;
  public children?: ITreeNode[];
  public parent?: ITreeNode;
  public isRoot?: boolean;
  public isLastChild?: boolean;
  public name?: string;

  constructor(node?: ITreeNode) {
    if (node) {
      Object.keys(node).forEach((key: string) => {
        // @ts-ignore
        this[key] = node[key];
      });
      this.isRoot = !node.parentId;
    }
  }

  /**
   * toString method defined for getting caption of node
   * if an object of TreeNode class bind to html view this method runs by default
   */
  toString(): string {
    // @ts-ignore
    return this.label && this.label.length > 0 ? this.label : this.name;
  }
}
