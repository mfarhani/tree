export interface ITreeNode {
  id?: number | string;
  value?: string;
  parentId?: number;
  parentName?: string;
  key?: string;
  level?: number;
  expandable?: boolean;
  catStatusId?: number;
  code?: string;
  createdBy?: string;
  createdDate?: Date;
  nameEn?: string;
  nameFa?: string;
  version?: number;
  children?: ITreeNode[];
  parent?: ITreeNode;
  isRoot?: boolean;
  isLastChild?: boolean;
  item?: any;
  name?: string;
  selected?: boolean;
  hideAddButton?: boolean;
}
